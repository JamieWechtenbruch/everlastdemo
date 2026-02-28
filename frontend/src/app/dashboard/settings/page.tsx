"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Calendar, Mic2, Check, Loader2, Shield, Clock, ListChecks, RotateCcw } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const DEFAULTS = {
  botName: "Anna (B2B SaaS Sales)",
  systemPrompt: `Du bist Anna, die Inbound-Voice-Agentin für FlowPilot.io (KI-Workflow-Automatisierung).
Der Anrufer hat soeben unsere Case Study "Wie Kreativstrom 45% schneller liefert" gelesen und ruft an, um mehr zu erfahren.
Dein Ziel ist es, den Lead nach BANT (Budget, Authority, Need, Timeline) zu qualifizieren.
1. Begrüße den Anrufer freundlich und frage, ob er Fragen zur Kreativstrom Case Study hat.
2. Finde heraus, ob das Unternehmen aktuell Workflows manuell oder mit Excel organisiert.
3. Versuche, ein 15-minütiges Demo-Gespräch mit einem Account Executive zu buchen.
Halte die Antworten kurz, natürlich und unter 2 Sätzen.`,
  voiceProvider: "elevenlabs",
  voiceId: "cgSgspJ2msm6clMCkdW9",
  sttProvider: "deepgram",
  sttModel: "nova-3",
  llmProvider: "google",
  llmModel: "gemini-2.5-flash",
  idleTimeout: 60,
  maxSessionDuration: 600,
  qualificationCriteria: [
    "Branche & Unternehmensgröße",
    "Aktuelle Lösung / Pain Points",
    "Budget & Zeitrahmen",
    "Entscheidungsträger (Authority)",
  ],
};

type Settings = typeof DEFAULTS;

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch(`${API_URL}/api/ai-settings`);
        if (res.ok) {
          const data = await res.json();
          setSettings((prev) => ({
            ...prev,
            ...Object.fromEntries(
              Object.entries(data).filter(([_, v]) => v !== undefined && v !== null && v !== "")
            ),
          }));
        }
      } catch {}
      setLoaded(true);
    }
    loadSettings();
  }, []);

  // Autosave with debounce
  const doSave = useCallback(async (data: Settings) => {
    setSaveStatus("saving");
    try {
      const res = await fetch(`${API_URL}/api/ai-settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, enabled: true }),
      });
      if (res.ok) {
        setSaveStatus("saved");
        if (statusTimer.current) clearTimeout(statusTimer.current);
        statusTimer.current = setTimeout(() => setSaveStatus("idle"), 2500);
      } else {
        setSaveStatus("idle");
      }
    } catch {
      setSaveStatus("idle");
    }
  }, []);

  const triggerAutosave = useCallback(
    (newSettings: Settings) => {
      if (!loaded) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => doSave(newSettings), 800);
    },
    [loaded, doSave]
  );

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    triggerAutosave(next);
  };

  const updateCriterion = (index: number, value: string) => {
    const updated = [...settings.qualificationCriteria];
    updated[index] = value;
    update("qualificationCriteria", updated);
  };

  const addCriterion = () => {
    if (settings.qualificationCriteria.length < 8) {
      update("qualificationCriteria", [...settings.qualificationCriteria, ""]);
    }
  };

  const removeCriterion = (index: number) => {
    if (settings.qualificationCriteria.length > 1) {
      update(
        "qualificationCriteria",
        settings.qualificationCriteria.filter((_, i) => i !== index)
      );
    }
  };

  const handleReset = () => {
    setSettings(DEFAULTS);
    triggerAutosave(DEFAULTS);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/60 p-6 md:p-8 rounded-[2rem] border border-stone-200/50 shadow-[0_4px_30px_-10px_rgba(234,88,12,0.04)] backdrop-blur-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-900">Agenten-Einstellungen</h1>
          <p className="text-stone-500 font-medium mt-1 flex items-center gap-2">
            Konfiguriere deinen KI-Voice-Agenten, Prompts und API-Integrationen.
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full transition-all duration-300 ${
                saveStatus === "saving"
                  ? "bg-orange-100 text-orange-600"
                  : saveStatus === "saved"
                  ? "bg-emerald-100 text-emerald-600"
                  : "opacity-0"
              }`}
            >
              {saveStatus === "saving" && <Loader2 className="w-3 h-3 animate-spin" />}
              {saveStatus === "saved" && <Check className="w-3 h-3" />}
              {saveStatus === "saving" ? "Speichert..." : saveStatus === "saved" ? "Gespeichert" : ""}
            </span>
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 bg-stone-100 text-stone-600 px-5 py-2.5 rounded-full font-bold text-sm hover:bg-stone-200 transition shadow-sm w-fit"
        >
          <RotateCcw className="w-4 h-4" />
          Zurücksetzen
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
                value={settings.botName}
                onChange={(e) => update("botName", e.target.value)}
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
                value={settings.systemPrompt}
                onChange={(e) => update("systemPrompt", e.target.value)}
                className="w-full bg-white border border-stone-200/80 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/30 text-stone-600 shadow-sm transition-shadow leading-relaxed"
              />
              <p className="text-xs text-stone-500 font-medium mt-1">
                Die Kernlogik deiner Voice-KI. Variablen wie <code className="bg-stone-100 px-1.5 py-0.5 rounded-md text-orange-600">{"{lead_name}"}</code> werden unterstützt.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Lead Qualification Criteria */}
        <Card className="overflow-hidden border-stone-200/50">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 border-b border-stone-100/80 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100/80 flex items-center justify-center">
              <ListChecks className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Lead-Qualifizierung (BANT)</CardTitle>
              <CardDescription>Kriterien, die der Agent im Gespräch systematisch erfasst.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6 grid gap-3">
            {settings.qualificationCriteria.map((criterion, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold shrink-0">
                  {idx + 1}
                </span>
                <input
                  value={criterion}
                  onChange={(e) => updateCriterion(idx, e.target.value)}
                  className="flex-1 bg-white border border-stone-200/80 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-shadow"
                  placeholder="Qualifizierungskriterium..."
                />
                {settings.qualificationCriteria.length > 1 && (
                  <button
                    onClick={() => removeCriterion(idx)}
                    className="text-stone-400 hover:text-red-500 transition p-1"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            {settings.qualificationCriteria.length < 8 && (
              <button
                onClick={addCriterion}
                className="text-sm font-bold text-purple-600 hover:text-purple-700 transition mt-1"
              >
                + Kriterium hinzufügen
              </button>
            )}
            <p className="text-xs text-stone-500 font-medium mt-1">
              Mindestens 4 Kriterien für vollständige Lead-Qualifizierung. Der Agent erfasst diese natürlich im Gesprächsverlauf.
            </p>
          </CardContent>
        </Card>

        {/* Voice Stack — Display Only */}
        <Card className="overflow-hidden border-stone-200/50">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 border-b border-stone-100/80 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100/80 flex items-center justify-center">
              <Mic2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Voice-Stack Konfiguration</CardTitle>
              <CardDescription>Aktiver Tech-Stack für Echtzeit-Sprachverarbeitung.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6 grid gap-4">
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { label: "Speech-to-Text", provider: "Deepgram", model: "Nova-3", color: "bg-sky-50 border-sky-200/50 text-sky-700" },
                { label: "Large Language Model", provider: "Google", model: "Gemini 2.5 Flash", color: "bg-violet-50 border-violet-200/50 text-violet-700" },
                { label: "Text-to-Speech", provider: "ElevenLabs", model: "Flash v2.5", color: "bg-rose-50 border-rose-200/50 text-rose-700" },
              ].map((item) => (
                <div key={item.label} className={`rounded-2xl border p-4 ${item.color}`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{item.label}</span>
                  <p className="text-sm font-bold mt-1">{item.provider}</p>
                  <p className="text-xs font-medium opacity-70 mt-0.5">{item.model}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border bg-stone-50 border-stone-200/50 p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Voice-Plattform</span>
                <p className="text-sm font-bold text-stone-700 mt-0.5">LiveKit Cloud</p>
                <p className="text-xs text-stone-500 mt-0.5">Echtzeit-Voice mit WebRTC, Latenz &lt;1.5s</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/60">Aktiv</span>
            </div>
            <div className="rounded-2xl border bg-stone-50 border-stone-200/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Voice ID (ElevenLabs)</span>
                  <p className="text-xs font-mono text-stone-500 mt-1">{settings.voiceId}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session & Safety */}
        <Card className="overflow-hidden border-stone-200/50">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 border-b border-stone-100/80 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100/80 flex items-center justify-center">
              <Shield className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Session & Sicherheit</CardTitle>
              <CardDescription>Timeout-Einstellungen und Abuse-Schutz.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6 grid gap-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  Idle-Timeout (Sekunden)
                </label>
                <input
                  type="number"
                  value={settings.idleTimeout}
                  onChange={(e) => update("idleTimeout", parseInt(e.target.value) || 0)}
                  min={10}
                  max={300}
                  className="w-full bg-white border border-stone-200/80 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-shadow"
                />
                <p className="text-xs text-stone-400">Agent beendet bei Stille nach X Sekunden</p>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  Max. Gesprächsdauer (Sekunden)
                </label>
                <input
                  type="number"
                  value={settings.maxSessionDuration}
                  onChange={(e) => update("maxSessionDuration", parseInt(e.target.value) || 0)}
                  min={60}
                  max={1800}
                  className="w-full bg-white border border-stone-200/80 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-shadow"
                />
                <p className="text-xs text-stone-400">Verhindert Token-Drain bei langen Gesprächen</p>
              </div>
            </div>
            <div className="bg-amber-50/60 border border-amber-200/50 rounded-2xl p-4">
              <h4 className="text-sm font-bold text-amber-800 mb-1.5">Sicherheitsfeatures aktiv</h4>
              <ul className="text-xs text-amber-700/80 font-medium space-y-1">
                <li className="flex items-center gap-2"><Check className="w-3 h-3 text-amber-600 shrink-0" /> Anti-Jailbreak & Prompt-Injection-Schutz</li>
                <li className="flex items-center gap-2"><Check className="w-3 h-3 text-amber-600 shrink-0" /> Themen-Guardrails (nur FlowPilot-relevante Themen)</li>
                <li className="flex items-center gap-2"><Check className="w-3 h-3 text-amber-600 shrink-0" /> Eskalierendes Warnsystem bei Manipulation</li>
                <li className="flex items-center gap-2"><Check className="w-3 h-3 text-amber-600 shrink-0" /> Automatische Session-Beendigung bei Timeout</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Integration */}
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
          <CardContent className="pt-6">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
