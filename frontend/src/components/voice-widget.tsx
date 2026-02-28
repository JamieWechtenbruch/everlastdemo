"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Phone, PhoneOff, Mic, Send, X } from "lucide-react";

type ConnectionState = "idle" | "connecting" | "connected" | "disconnecting";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export function VoiceWidget() {
  const [state, setState] = useState<ConnectionState>("idle");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);
  const roomRef = useRef<any>(null);
  const animRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const cleanup = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    if (roomRef.current) {
      try { roomRef.current.disconnect(); } catch {}
    }
    roomRef.current = null;
    analyserRef.current = null;
    setAudioLevel(0);
    setShowEmailModal(false);
    setEmail("");
  }, []);

  const startCall = useCallback(async () => {
    setState("connecting");
    try {
      // Get LiveKit token from backend
      const res = await fetch(`${API_URL}/api/livekit-token`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to get token");
      const { token, url } = await res.json();

      // Dynamic import of livekit-client
      const { Room, RoomEvent } = await import("livekit-client");
      const room = new Room({ autoSubscribe: true });
      roomRef.current = room;

      // Listen for data channel messages (email request from agent)
      room.on(RoomEvent.DataReceived, (payload: Uint8Array) => {
        try {
          const msg = JSON.parse(new TextDecoder().decode(payload));
          if (msg.type === "request_email") {
            setShowEmailModal(true);
          }
        } catch {}
      });

      // Track audio from remote participant (agent voice)
      room.on(RoomEvent.TrackSubscribed, (track: any) => {
        if (track.kind === "audio") {
          const mediaStream = new MediaStream([track.mediaStreamTrack]);
          const audioCtx = new AudioContext();
          const source = audioCtx.createMediaStreamSource(mediaStream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);
          analyserRef.current = analyser;

          // Attach audio element for playback
          const audioEl = document.createElement("audio");
          audioEl.srcObject = mediaStream;
          audioEl.autoplay = true;
          audioEl.style.display = "none";
          document.body.appendChild(audioEl);

          // Animate audio level
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const tick = () => {
            analyser.getByteFrequencyData(dataArray);
            const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
            setAudioLevel(avg / 255);
            animRef.current = requestAnimationFrame(tick);
          };
          tick();
        }
      });

      room.on(RoomEvent.Disconnected, () => {
        setState("idle");
        cleanup();
      });

      await room.connect(url, token);
      setState("connected");
    } catch (err) {
      console.error("Failed to connect:", err);
      setState("idle");
      cleanup();
    }
  }, [cleanup]);

  const endCall = useCallback(() => {
    setState("disconnecting");
    cleanup();
    setState("idle");
  }, [cleanup]);

  const sendEmail = useCallback(async () => {
    if (!email || !email.includes("@") || !roomRef.current) return;
    try {
      const msg = JSON.stringify({ type: "email_response", email });
      const encoder = new TextEncoder();
      await roomRef.current.localParticipant.publishData(encoder.encode(msg), { reliable: true });
      setShowEmailModal(false);
      setEmail("");
    } catch (err) {
      console.error("Failed to send email:", err);
    }
  }, [email]);

  // Cleanup on unmount
  useEffect(() => () => cleanup(), [cleanup]);

  const pulseSize = 1 + audioLevel * 0.4;

  if (state === "idle") {
    return (
      <button
        onClick={startCall}
        className="group px-8 py-4 rounded-full bg-black text-white font-bold hover:bg-stone-800 transition-all flex items-center gap-3 text-lg shadow-lg hover:shadow-xl"
      >
        <Phone className="w-5 h-5" />
        KI-Agenten anrufen
      </button>
    );
  }

  if (state === "connecting") {
    return (
      <div className="px-8 py-4 rounded-full bg-stone-800 text-white font-bold flex items-center gap-3 text-lg animate-pulse">
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        Verbinde...
      </div>
    );
  }

  // Connected state
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex items-center gap-4">
        {/* Audio visualization */}
        <div className="relative flex items-center justify-center">
          <div
            className="absolute w-16 h-16 rounded-full bg-emerald-400/20 transition-transform duration-100"
            style={{ transform: `scale(${pulseSize})` }}
          />
          <div
            className="absolute w-12 h-12 rounded-full bg-emerald-400/30 transition-transform duration-100"
            style={{ transform: `scale(${1 + audioLevel * 0.2})` }}
          />
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
            <Mic className="w-6 h-6" />
          </div>
        </div>

        <div>
          <p className="font-bold text-stone-900 text-lg">Alex spricht mit Ihnen</p>
          <p className="text-sm text-emerald-600 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Verbunden
          </p>
        </div>

        <button
          onClick={endCall}
          className="ml-4 w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>

      {/* Email modal */}
      {showEmailModal && (
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xl w-full max-w-md animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-stone-900">E-Mail für Terminbestätigung</h3>
            <button onClick={() => setShowEmailModal(false)} className="text-stone-400 hover:text-stone-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendEmail()}
              placeholder="ihre@email.de"
              className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50"
              autoFocus
            />
            <button
              onClick={sendEmail}
              disabled={!email.includes("@")}
              className="px-4 py-2.5 bg-orange-600 text-white rounded-xl font-bold text-sm hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Senden
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
