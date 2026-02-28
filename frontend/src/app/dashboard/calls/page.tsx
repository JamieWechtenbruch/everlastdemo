"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Calendar, Clock, Download, Play, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";

// Types for better structure
type Message = { role: "agent" | "lead"; text: string };

const recentCalls = [
  {
    id: "call-1",
    date: "Vor 10 Min.",
    leadName: "Sarah Jenkins",
    company: "Acme Corp",
    duration: "4m 12s",
    score: "A",
    status: "Termin gebucht",
    summary: "Sarah hat unsere Siemens-Case-Study zur KI-Vertragsanalyse gelesen. Aktueller Schmerzpunkt: Ihr Team überblickt über 400 alte Lieferantenverträge nicht, sie zahlen vermutlich 15% zu viel Lizenzkosten. Budget und Entscheidungsbefugnis (CFO) bestätigt. Demo für nächsten Dienstag gebucht.",
    transcript: [
      { role: "agent", text: "Willkommen bei DocuSync! Mein Name ist Anna. Sie rufen wegen unserer neuen Case Study über die Siemens AG an, richtig?" },
      { role: "lead", text: "Hallo Anna, ja genau. Ich bin Sarah Jenkins, CFO bei Acme Corp. Ich fand die Siemens-Studie spannend und wollte wissen, ob euer System auch bei mittelständischen Unternehmen funktioniert." },
      { role: "agent", text: "Freut mich, Sarah! Unsere KI skaliert perfekt für den Mittelstand. Wie überprüfen Sie bei Acme Corp aktuell alte Verträge auf versteckte Lizenzkosten?" },
      { role: "lead", text: "Puh, das ist ein Albtraum. Unser Legal-Team arbeitet sich manuell durch hunderte PDFs und alte Papier-Akten. Wir zahlen vermutlich massiv zu viel für Lizenzen, die wir gar nicht mehr brauchen." },
      { role: "agent", text: "Genau dort setzen wir an. Unsere KI digitalisiert alle Verträge, liest die Kündigungsfristen aus und warnt vor unnötigen Kosten. Haben Sie für eine solche Prozessoptimierung in diesem Quartal Budget vorgesehen?" },
      { role: "lead", text: "Als CFO verwalte ich das Budget direkt. Wenn mir euer System gefällt und der ROI wie bei Siemens aussieht, können wir das kurzfristig freigeben." },
      { role: "agent", text: "Klasse. Am besten schauen wir uns das Tool live in einer Web-Demo an. Darf ich Ihnen für nächsten Dienstag einen 15-minütigen Demo-Termin in Ihren Google-Kalender einstellen?" },
      { role: "lead", text: "Dienstagvormittag würde passen. Schicken Sie mir gerne die Einladung an sarah@acmecorp.com." },
      { role: "agent", text: "Perfekt. Die Einladung ist soeben rausgegangen. Ich bedanke mich für Ihren Anruf, Sarah, und wünsche einen tollen Tag!" }
    ] as Message[]
  },
  {
    id: "call-2",
    date: "Vor 1 Stunde",
    leadName: "Marcus Thorne",
    company: "TechFlow Ltd",
    duration: "6m 45s",
    score: "B",
    status: "Follow-up",
    summary: "Marcus sieht den Mehrwert, braucht aber die Freigabe vom CTO. Hauptsorge ist die Integration mit bestehenden Legacy-Systemen. Follow-up-Aufgabe für Account Executive erstellt.",
    transcript: [
      { role: "agent", text: "Guten Tag Herr Thorne, hier ist Anna von DocuSync.io." },
      { role: "lead", text: "Hallo, ja was gibt es?" },
      { role: "agent", text: "Ich wollte mich bezüglich Ihrer Anfrage zu unserer API kurz melden. Haben Sie spezifische Systeme, die Sie anbinden möchten?" },
      { role: "lead", text: "Ja, wir nutzen ein sehr altes, proprietäres CRM. Ich bin mir nicht sicher, ob sich das verbinden lässt." },
      { role: "agent", text: "Verstehe. Wir haben eine sehr flexible REST-API, die das meistens problemlos abdeckt. Sind Sie der Entscheidungsträger für solche Integrationen?" },
      { role: "lead", text: "Zum Teil. Ich leite das Projekt, aber der CTO muss es final absegnen." },
      { role: "agent", text: "Alles klar. Soll ich Ihnen und Ihrem CTO ein Info-Paket zusammenstellen, oder direkt einen Call mit unserem Techniker vereinbaren?" },
      { role: "lead", text: "Ein Info-Paket per E-Mail reicht erstmal. Ich bespreche das intern." },
      { role: "agent", text: "Mache ich sofort fertig. Bis dann!" }
    ] as Message[]
  },
  {
    id: "call-3",
    date: "Vor 3 Stunden",
    leadName: "Emily Chen",
    company: "Globex",
    duration: "1m 30s",
    score: "C",
    status: "Abgebrochen",
    summary: "Frühzeitig abgebrochen. Lead erwähnte, dass sie gerade einen 2-Jahres-Vertrag mit unserer Konkurrenz unterschrieben haben. Passt derzeit nicht.",
    transcript: [
      { role: "agent", text: "Hallo Emily, Anna hier. Ich wollte fragen..." },
      { role: "lead", text: "Oh, hallo. Wenn es um das Tool geht, wir haben gerade erst letzte Woche einen 2-Jahres-Vertrag bei der Konkurrenz unterschrieben. Kein Bedarf aktuell." },
      { role: "agent", text: "Oh, das ist schade für uns, aber Glückwunsch zum neuen Tool! Ich vermerke das und melde mich vielleicht in einem Jahr nochmal. Einen schönen Tag noch!" },
      { role: "lead", text: "Danke, Ihnen auch. Tschüss." }
    ] as Message[]
  }
];

export default function CallsPage() {
  const [expandedCallId, setExpandedCallId] = useState<string | null>(null);

  const toggleTranscript = (id: string) => {
    setExpandedCallId(expandedCallId === id ? null : id);
  };

  const handleExportCSV = () => {
    // 1. Generate CSV data
    const headers = ["ID", "Datum", "Lead Name", "Unternehmen", "Dauer", "Score", "Status", "Zusammenfassung"];
    const csvRows = [headers.join(",")];

    recentCalls.forEach(call => {
      // Escape commas in the summary by wrapping in quotes
      const summaryEscaped = `"${call.summary.replace(/"/g, '""')}"`;
      const row = [call.id, call.date, call.leadName, call.company, call.duration, call.score, call.status, summaryEscaped];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    
    // 2. Create a blob and trigger download
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `voice-agent-calls_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 p-6 md:p-8 rounded-[2rem] border border-stone-200/50 shadow-[0_4px_30px_-10px_rgba(234,88,12,0.04)] backdrop-blur-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-900">Letzte Anrufe 📞</h1>
          <p className="text-stone-500 font-medium mt-1">
            Höre dir die Gespräche deines Agenten an und prüfe die Live-Transkripte.
          </p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-stone-800 transition shadow-sm w-fit group"
        >
          <Download className="w-4 h-4 text-stone-300 group-hover:text-white transition-colors" />
          CSV Export
        </button>
      </div>

      <div className="grid gap-6">
        {recentCalls.map((call) => (
          <Card key={call.id} className="overflow-hidden p-0 hover:border-orange-200/60 transition-colors">
            <div className="grid md:grid-cols-[1fr_320px] divide-y md:divide-y-0 md:divide-x divide-stone-100">
              {/* Left Side: Summary & Transcript Toggle */}
              <div className="flex flex-col">
                <div className="p-6 md:p-8 flex flex-col gap-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold flex items-center gap-2 text-stone-900">
                        {call.leadName}
                        <span className="text-sm font-medium text-stone-500 bg-stone-100/80 px-2 py-0.5 rounded-full">@ {call.company}</span>
                      </h3>
                      <div className="flex items-center gap-4 text-sm font-medium text-stone-500 mt-2">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-stone-400" /> {call.date}</span>
                        <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-stone-400" /> {call.duration}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={call.score === 'A' ? 'success' : call.score === 'B' ? 'warning' : 'destructive'} className="shadow-sm">
                        Score: {call.score}
                      </Badge>
                      <Badge variant={call.status === 'Termin gebucht' ? 'success' : call.status === 'Follow-up' ? 'secondary' : 'destructive'} className="shadow-sm">
                        {call.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="bg-[#faf8f5] p-5 rounded-2xl border border-stone-200/50 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-orange-600/80 mb-2 flex items-center gap-1.5">
                      ✨ Agenten-Zusammenfassung
                    </h4>
                    <p className="text-sm text-stone-700 leading-relaxed font-medium">
                      {call.summary}
                    </p>
                  </div>
                </div>

                {/* Transcript Toggle Button */}
                <button 
                  onClick={() => toggleTranscript(call.id)}
                  className="w-full flex items-center justify-center gap-2 py-3 border-t border-stone-100 bg-stone-50/50 hover:bg-orange-50/50 text-stone-600 hover:text-orange-600 text-sm font-bold transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  {expandedCallId === call.id ? "Transkript schließen" : "Vollständiges Transkript lesen"}
                  {expandedCallId === call.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {/* Transcript Content (Animated Expand) */}
                {expandedCallId === call.id && (
                  <div className="p-6 md:p-8 bg-stone-50 border-t border-stone-100 animate-in fade-in slide-in-from-top-4 duration-300 max-h-[400px] overflow-y-auto">
                    <div className="flex flex-col gap-4">
                      {call.transcript.map((msg, idx) => (
                        <div key={idx} className={`flex flex-col ${msg.role === 'agent' ? 'items-end' : 'items-start'} max-w-[85%] ${msg.role === 'agent' ? 'ml-auto' : 'mr-auto'}`}>
                          <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${msg.role === 'agent' ? 'text-orange-500' : 'text-stone-400'}`}>
                            {msg.role === 'agent' ? '🤖 Voice Agent' : `👤 ${call.leadName}`}
                          </span>
                          <div className={`p-3.5 rounded-2xl text-sm font-medium shadow-sm ${
                            msg.role === 'agent' 
                              ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-tr-sm' 
                              : 'bg-white border border-stone-200 text-stone-700 rounded-tl-sm'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side: Audio Player */}
              <div className="bg-stone-50/50 p-6 md:p-8 flex flex-col justify-center gap-6 relative h-full">
                <div className="flex flex-col gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Aufzeichnung</span>
                  <div className="flex items-center gap-3">
                    <button className="w-12 h-12 rounded-full bg-white border border-stone-200 shadow-sm text-orange-600 flex items-center justify-center hover:bg-orange-50 hover:border-orange-200 transition-all shrink-0">
                      <Play className="w-5 h-5 ml-1" />
                    </button>
                    <div className="flex-1 bg-stone-200/60 h-2.5 rounded-full overflow-hidden shadow-inner">
                      <div className="w-1/3 h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"></div>
                    </div>
                    <span className="text-xs font-semibold text-stone-500 tabular-nums">00:00 / {call.duration}</span>
                  </div>
                </div>

                {call.status === "Termin gebucht" && (
                  <div className="mt-2 p-4 bg-emerald-50/80 border border-emerald-100/80 rounded-2xl flex items-start gap-3 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-emerald-800 block">Demo gebucht</span>
                      <span className="text-xs font-medium text-emerald-600/80">Zu Google Kalender hinzugefügt</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
