"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Calendar, Clock, Download, MessageSquare, ChevronDown, ChevronUp, Loader2, Trash2, AlertTriangle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

type CallData = {
  id: number;
  call_datetime: string;
  duration_seconds: number;
  conversation_phase: string;
  lead_score: string;
  lead_branche: string | null;
  lead_unternehmensgroesse: string | null;
  lead_aktuelle_loesung: string | null;
  lead_budget_zeitrahmen: string | null;
  lead_interest_level: string | null;
  booking_attempted: boolean;
  booking_succeeded: boolean;
  demo_booked: boolean;
  email_collected: boolean;
  room_name: string;
  transcript_summary: string | null;
  tools_used: string[];
  qualification_data: Record<string, string> | null;
  full_transcript: { role: string; text: string }[] | null;
};

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Gerade eben";
  if (diffMin < 60) return `Vor ${diffMin} Min.`;
  if (diffHours < 24) return `Vor ${diffHours} Stunde${diffHours > 1 ? "n" : ""}`;
  if (diffDays < 7) return `Vor ${diffDays} Tag${diffDays > 1 ? "en" : ""}`;
  return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function phaseToStatus(phase: string, demoBooked: boolean): string {
  if (demoBooked) return "Termin gebucht";
  switch (phase) {
    case "completed": return "Abgeschlossen";
    case "qualification": return "Qualifiziert";
    case "availability_check": return "Verfügbarkeit geprüft";
    case "booking": return "Buchung versucht";
    case "idle_timeout": return "Timeout";
    case "max_duration": return "Max. Dauer";
    default: return "Begrüßung";
  }
}

function phaseToStatusVariant(phase: string, demoBooked: boolean): "success" | "secondary" | "destructive" {
  if (demoBooked) return "success";
  if (phase === "completed" || phase === "qualification") return "secondary";
  if (phase === "idle_timeout" || phase === "max_duration") return "destructive";
  return "secondary";
}

function csvField(value: string | number | boolean | null | undefined): string {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export default function CallsPage() {
  const [calls, setCalls] = useState<CallData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCallId, setExpandedCallId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<CallData | null>(null);
  const [deleting, setDeleting] = useState(false);
  const perPage = 20;

  const loadCalls = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/analytics/calls?page=${page}&per_page=${perPage}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setCalls(data.calls || []);
      setTotal(data.total || 0);
    } catch {
      setCalls([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCalls();
  }, [page]);

  const toggleTranscript = (id: number) => {
    setExpandedCallId(expandedCallId === id ? null : id);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/analytics/calls/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setCalls((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        setTotal((prev) => prev - 1);
        if (expandedCallId === deleteTarget.id) setExpandedCallId(null);
      }
    } catch {}
    setDeleting(false);
    setDeleteTarget(null);
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Datum", "Dauer (s)", "Phase", "Score", "Branche", "Unternehmensgröße", "Demo gebucht", "Zusammenfassung"];
    const csvRows = [headers.join(",")];
    calls.forEach((call) => {
      const row = [
        csvField(call.id),
        csvField(new Date(call.call_datetime).toLocaleString("de-DE")),
        csvField(call.duration_seconds),
        csvField(call.conversation_phase),
        csvField(call.lead_score || "-"),
        csvField(call.lead_branche || "-"),
        csvField(call.lead_unternehmensgroesse || "-"),
        csvField(call.demo_booked ? "Ja" : "Nein"),
        csvField(call.transcript_summary || ""),
      ];
      csvRows.push(row.join(","));
    });
    const bom = "\uFEFF";
    const blob = new Blob([bom + csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `flowpilot-calls_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 p-6 md:p-8 rounded-[2rem] border border-stone-200/50 shadow-[0_4px_30px_-10px_rgba(234,88,12,0.04)] backdrop-blur-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-900">Letzte Anrufe</h1>
          <p className="text-stone-500 font-medium mt-1">
            {total > 0 ? `${total} Gespräche aufgezeichnet` : "Noch keine Anrufe aufgezeichnet"}
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={calls.length === 0}
          className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-stone-800 transition shadow-sm w-fit group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4 text-stone-300 group-hover:text-white transition-colors" />
          CSV Export
        </button>
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => !deleting && setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900">Anruf löschen?</h3>
                <p className="text-sm text-stone-500">Anruf #{deleteTarget.id}{deleteTarget.lead_branche ? ` — ${deleteTarget.lead_branche}` : ""}</p>
              </div>
            </div>
            <p className="text-sm text-stone-600 mb-6">
              Dieser Anruf wird unwiderruflich gelöscht. Alle Daten, Transkripte und Lead-Informationen gehen verloren.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-stone-100 text-stone-700 text-sm font-bold hover:bg-stone-200 transition disabled:opacity-50"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
          <span className="ml-3 text-stone-500 font-medium">Lade Anrufe...</span>
        </div>
      ) : calls.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Phone className="w-12 h-12 text-stone-300 mb-4" />
          <h3 className="text-lg font-bold text-stone-700">Noch keine Anrufe</h3>
          <p className="text-stone-500 font-medium mt-1">Sobald dein Agent Gespräche führt, erscheinen sie hier.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {calls.map((call) => {
            const status = phaseToStatus(call.conversation_phase, call.demo_booked);
            const statusVariant = phaseToStatusVariant(call.conversation_phase, call.demo_booked);

            return (
              <Card key={call.id} className="overflow-hidden p-0 hover:border-orange-200/60 transition-colors">
                <div className="flex flex-col">
                  <div className="p-6 md:p-8 flex flex-col gap-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold flex items-center gap-2 text-stone-900">
                          Anruf #{call.id}
                          {call.lead_branche && (
                            <span className="text-sm font-medium text-stone-500 bg-stone-100/80 px-2 py-0.5 rounded-full">
                              {call.lead_branche}
                            </span>
                          )}
                          {call.lead_unternehmensgroesse && (
                            <span className="text-sm font-medium text-stone-500 bg-stone-100/80 px-2 py-0.5 rounded-full">
                              {call.lead_unternehmensgroesse}
                            </span>
                          )}
                        </h3>
                        <div className="flex items-center gap-4 text-sm font-medium text-stone-500 mt-2">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-stone-400" /> {formatRelativeTime(call.call_datetime)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-stone-400" /> {formatDuration(call.duration_seconds || 0)}
                          </span>
                          <span className="text-stone-400 text-xs">{call.room_name}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {call.lead_score && (
                          <Badge
                            variant={call.lead_score === "A" ? "success" : call.lead_score === "B" ? "warning" : "destructive"}
                            className="shadow-sm"
                          >
                            Score: {call.lead_score}
                          </Badge>
                        )}
                        <Badge variant={statusVariant} className="shadow-sm">
                          {status}
                        </Badge>
                        <button
                          onClick={() => setDeleteTarget(call)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Anruf löschen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Summary */}
                    {call.transcript_summary && (
                      <div className="bg-[#faf8f5] p-5 rounded-2xl border border-stone-200/50 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-orange-600/80 mb-2 flex items-center gap-1.5">
                          Gesprächszusammenfassung
                        </h4>
                        <p className="text-sm text-stone-700 leading-relaxed font-medium">{call.transcript_summary}</p>
                      </div>
                    )}

                    {/* Qualification data */}
                    {call.qualification_data && Object.keys(call.qualification_data).length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {call.lead_branche && (
                          <div className="bg-white border border-stone-200/50 rounded-xl p-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Branche</span>
                            <p className="text-sm font-semibold text-stone-800 mt-0.5">{call.lead_branche}</p>
                          </div>
                        )}
                        {call.lead_unternehmensgroesse && (
                          <div className="bg-white border border-stone-200/50 rounded-xl p-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Größe</span>
                            <p className="text-sm font-semibold text-stone-800 mt-0.5">{call.lead_unternehmensgroesse}</p>
                          </div>
                        )}
                        {call.lead_aktuelle_loesung && (
                          <div className="bg-white border border-stone-200/50 rounded-xl p-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Akt. Lösung</span>
                            <p className="text-sm font-semibold text-stone-800 mt-0.5">{call.lead_aktuelle_loesung}</p>
                          </div>
                        )}
                        {call.lead_budget_zeitrahmen && (
                          <div className="bg-white border border-stone-200/50 rounded-xl p-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Budget/Zeitrahmen</span>
                            <p className="text-sm font-semibold text-stone-800 mt-0.5">{call.lead_budget_zeitrahmen}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tools used & booking info */}
                    <div className="flex flex-wrap items-center gap-2">
                      {call.demo_booked && (
                        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-3 py-1.5 rounded-xl text-xs font-bold">
                          <Calendar className="w-3.5 h-3.5" />
                          Demo gebucht
                        </div>
                      )}
                      {call.email_collected && (
                        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200/60 px-3 py-1.5 rounded-xl text-xs font-bold">
                          E-Mail erfasst
                        </div>
                      )}
                      {call.tools_used && call.tools_used.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-stone-400 font-medium">
                          Tools: {call.tools_used.join(", ")}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Transcript toggle — WhatsApp-style chat */}
                  {(call.full_transcript || call.transcript_summary) && (
                    <>
                      <button
                        onClick={() => toggleTranscript(call.id)}
                        className="w-full flex items-center justify-center gap-2 py-3 border-t border-stone-100 bg-stone-50/50 hover:bg-orange-50/50 text-stone-600 hover:text-orange-600 text-sm font-bold transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        {expandedCallId === call.id ? "Transkript schließen" : "Transkript anzeigen"}
                        {expandedCallId === call.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {expandedCallId === call.id && (
                        <div className="p-6 md:p-8 bg-[#efeae2] border-t border-stone-200 max-h-[500px] overflow-y-auto">
                          {/* Info bar */}
                          <div className="flex items-center justify-center mb-4">
                            <div className="bg-white/80 backdrop-blur-sm text-stone-500 text-xs font-medium px-3 py-1 rounded-lg shadow-sm">
                              {new Date(call.call_datetime).toLocaleString("de-DE", {
                                day: "2-digit", month: "2-digit", year: "numeric",
                                hour: "2-digit", minute: "2-digit",
                              })} &middot; {formatDuration(call.duration_seconds || 0)}
                            </div>
                          </div>

                          {call.full_transcript && call.full_transcript.length > 0 ? (
                            <div className="flex flex-col gap-2">
                              {call.full_transcript.map((msg, idx) => (
                                <div
                                  key={idx}
                                  className={`flex ${msg.role === "agent" ? "justify-start" : "justify-end"}`}
                                >
                                  <div
                                    className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                                      msg.role === "agent"
                                        ? "bg-white text-stone-800 rounded-2xl rounded-tl-sm border border-stone-200/30"
                                        : "bg-[#d9fdd3] text-stone-800 rounded-2xl rounded-tr-sm"
                                    }`}
                                  >
                                    <span className={`text-[10px] font-bold block mb-0.5 ${
                                      msg.role === "agent" ? "text-orange-500" : "text-emerald-600"
                                    }`}>
                                      {msg.role === "agent" ? "Anna" : "Anrufer"}
                                    </span>
                                    {msg.text}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            /* Fallback: show summary as single message */
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-end">
                                <div className="max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed shadow-sm bg-[#d9fdd3] text-stone-800 rounded-2xl rounded-tr-sm">
                                  <span className="text-[10px] font-bold block mb-0.5 text-emerald-600">Anrufer</span>
                                  {call.transcript_summary}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-full bg-white border border-stone-200 text-sm font-bold text-stone-600 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Zurück
          </button>
          <span className="text-sm font-medium text-stone-500">
            Seite {page} von {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-full bg-white border border-stone-200 text-sm font-bold text-stone-600 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Weiter
          </button>
        </div>
      )}
    </div>
  );
}
