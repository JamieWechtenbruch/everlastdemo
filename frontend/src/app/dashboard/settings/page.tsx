"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Bot, Calendar, Mic2, Check, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function SettingsPage() {
  const [agentName, setAgentName] = useState("Anna (B2B SaaS Sales)");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [voiceProvider, setVoiceProvider] = useState("elevenlabs");
  const [voiceId, setVoiceId] = useState("cgSgspJ2msm6clMCkdW9");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch(`${API_URL}/api/ai-settings`, {
          headers: { "X-API-Key": "docusync-internal" },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.botName) setAgentName(data.botName);
          if (data.systemPrompt) setSystemPrompt(data.systemPrompt);
          if (data.voiceProvider) setVoiceProvider(data.voiceProvider);
          if (data.voiceId) setVoiceId(data.voiceId);
        }
      } catch {}
      setLoaded(true);
    }
    loadSettings();
  }, []);

  // Set default prompt after loading (only if not loaded from API)
  useEffect(() => {
    if (loaded && !systemPrompt) {
      setSystemPrompt(`Du bist Anna, die Inbound-Voice-Agentin für DocuSync.io (KI-Vertragsmanagement).
Der Anrufer hat soeben unsere Case Study "Wie Siemens 12% Lizenzkosten eingespart hat" gelesen und ruft an, um mehr zu erfahren.
Dein Ziel ist es, den Lead nach BANT (Budget, Authority, Need, Timeline) zu qualifizieren.
1. Begrüße den Anrufer freundlich und frage, ob er Fragen zur Siemens Case Study hat.
2. Finde heraus, ob das Unternehmen aktuell alte Verträge und Lizenzen manuell prüfen muss.
3. Versuche, ein 15-minütiges Demo-Gespräch mit einem Account Executive zu buchen.
Halte die Antworten kurz, natürlich und unter 2 Sätzen.`);
    }
  }, [loaded, systemPrompt]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`${API_URL}/api/ai-settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "docusync-internal",
        },
        body: JSON.stringify({
          botName: agentName,
          systemPrompt,
          voiceProvider,
          voiceId,
          enabled: true,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {}
    setSaving(false);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">Agenten-Einstellungen</h1>
          <p className="text-stone-500 font-medium">
            Konfiguriere deinen KI-Voice-Agenten, Prompts und API-Integrationen.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2.5 rounded-full font-medium text-sm hover:bg-orange-700 transition shadow-sm shadow-orange-600/20 disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saved ? "Gespeichert!" : "Änderungen speichern"}
        </button>
      </div>

      <div className="grid gap-6">
        {/* Prompt Configuration */}
        <Card className="overflow-hidden border-stone-200/50">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 border-b border-stone-100/80 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100/80 flex items-center justify-center">
              <Bot className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-lg">System Prompt & Logik</CardTitle>
              <CardDescription>Definiere, wie der Agent Leads anspricht und qualifiziert.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6 grid gap-5">
            <div className="grid gap-2">
              <label htmlFor="agent-name" className="text-sm font-bold text-stone-700">Name des Agenten</label>
              <input
                id="agent-name"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full bg-white border border-stone-200/80 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-shadow"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="system-prompt" className="text-sm font-bold text-stone-700">
                System Prompt
              </label>
              <textarea
                id="system-prompt"
                rows={8}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full bg-white border border-stone-200/80 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/30 text-stone-600 shadow-sm transition-shadow leading-relaxed"
              />
              <p className="text-xs text-stone-500 font-medium mt-1">
                Die Kernlogik deiner Voice-KI. Variablen wie <code className="bg-stone-100 px-1.5 py-0.5 rounded-md text-orange-600">{"{lead_name}"}</code> werden unterstützt.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Voice Selection */}
        <Card className="overflow-hidden border-stone-200/50">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 border-b border-stone-100/80 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100/80 flex items-center justify-center">
              <Mic2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Sprachsynthese (TTS)</CardTitle>
              <CardDescription>Wähle den Voice-Anbieter und das zugehörige Modell.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6 grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor="voice-provider" className="text-sm font-bold text-stone-700">Anbieter</label>
              <select
                id="voice-provider"
                value={voiceProvider}
                onChange={(e) => setVoiceProvider(e.target.value)}
                className="w-full bg-white border border-stone-200/80 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-shadow"
              >
                <option value="elevenlabs">ElevenLabs</option>
                <option value="playht">Play.ht</option>
                <option value="openai">OpenAI TTS</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="voice-model" className="text-sm font-bold text-stone-700">Voice ID</label>
              <input
                id="voice-model"
                value={voiceId}
                onChange={(e) => setVoiceId(e.target.value)}
                className="w-full bg-white border border-stone-200/80 rounded-xl px-4 py-2.5 text-sm font-mono text-stone-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-shadow"
              />
            </div>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card className="overflow-hidden border-stone-200/50">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 border-b border-stone-100/80 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100/80 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Kalender-Integration</CardTitle>
              <CardDescription>Verbinde dein Termin-Tool für automatische Buchungen.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6 grid gap-4">
            <div className="flex items-center justify-between p-5 bg-white border border-stone-200/80 rounded-2xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center font-black text-lg text-stone-800 border border-stone-200/80">
                  G
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-800">Google Calendar (Service Account)</h4>
                  <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Verbunden. Demo-Termine werden automatisch gebucht.
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200/60">
                Aktiv
              </span>
            </div>

            {/* Tech stack info */}
            <div className="grid grid-cols-3 gap-3 mt-2">
              <div className="bg-stone-50 border border-stone-200/50 rounded-xl p-3 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">STT</span>
                <p className="text-sm font-semibold text-stone-700 mt-0.5">Deepgram Nova-3</p>
              </div>
              <div className="bg-stone-50 border border-stone-200/50 rounded-xl p-3 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">LLM</span>
                <p className="text-sm font-semibold text-stone-700 mt-0.5">Gemini 2.5 Flash</p>
              </div>
              <div className="bg-stone-50 border border-stone-200/50 rounded-xl p-3 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">TTS</span>
                <p className="text-sm font-semibold text-stone-700 mt-0.5">ElevenLabs Flash</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
