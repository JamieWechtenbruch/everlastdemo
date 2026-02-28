"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Bot, Calendar, Webhook, Mic2 } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">Agenten-Einstellungen</h1>
          <p className="text-stone-500 font-medium">
            Konfiguriere deinen KI-Voice-Agenten, Prompts und API-Integrationen.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2.5 rounded-full font-medium text-sm hover:bg-orange-700 transition shadow-sm shadow-orange-600/20">
          <Save className="w-4 h-4" />
          Änderungen speichern
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
                defaultValue="Alex (B2B SaaS Sales)" 
                className="w-full bg-white border border-stone-200/80 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-shadow" 
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="system-prompt" className="text-sm font-bold text-stone-700 flex justify-between">
                System Prompt
                <span className="text-xs text-orange-600 cursor-pointer hover:underline font-medium">Beispiele ansehen</span>
              </label>
              <textarea 
                id="system-prompt" 
                rows={8}
                className="w-full bg-white border border-stone-200/80 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/30 text-stone-600 shadow-sm transition-shadow leading-relaxed"
                defaultValue={`Du bist Alex, der Inbound-Voice-Agent für DocuSync.io (KI-Vertragsmanagement).
Der Anrufer hat soeben unsere Case Study "Wie Siemens 12% Lizenzkosten eingespart hat" gelesen und ruft an, um mehr zu erfahren.
Dein Ziel ist es, den Lead nach BANT (Budget, Authority, Need, Timeline) zu qualifizieren.
1. Begrüße den Anrufer freundlich und frage, ob er Fragen zur Siemens Case Study hat.
2. Finde heraus, ob das Unternehmen aktuell alte Verträge und Lizenzen manuell prüfen muss.
3. Versuche, ein 15-minütiges Demo-Gespräch mit einem Account Executive zu buchen.
Halte die Antworten kurz, natürlich und unter 2 Sätzen.`}
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
                className="w-full bg-white border border-stone-200/80 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-shadow"
              >
                <option value="elevenlabs">ElevenLabs</option>
                <option value="playht">Play.ht</option>
                <option value="openai">OpenAI TTS</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="voice-model" className="text-sm font-bold text-stone-700">Voice Clone ID</label>
              <input 
                id="voice-model" 
                defaultValue="pNInz6obbf5AWCGqe..." 
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
                  C
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-800">Cal.com API</h4>
                  <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Derzeit aktiv. Links werden automatisch erstellt.
                  </p>
                </div>
              </div>
              <button className="text-sm font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-full transition-colors">
                Trennen
              </button>
            </div>
            <div className="flex items-center justify-between p-5 bg-stone-50/50 border border-stone-200/50 rounded-2xl opacity-70 grayscale">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center font-black text-lg text-stone-400 border border-stone-200">
                  G
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-800">Google Kalender</h4>
                  <p className="text-xs text-stone-500 font-medium mt-0.5">Nicht verbunden.</p>
                </div>
              </div>
              <button className="text-sm font-bold text-stone-600 hover:text-stone-900 bg-white border border-stone-200/80 hover:bg-stone-50 px-4 py-2 rounded-full shadow-sm transition-all">
                Verbinden
              </button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
