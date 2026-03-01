"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Filter, Building2, Clock, Phone, Loader2, Users, ChevronDown, ChevronUp, Calendar, Mail, Trash2, AlertTriangle } from "lucide-react";

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
};

type Lead = {
  id: number;
  callId: number;
  score: string;
  branche: string;
  unternehmensgroesse: string;
  aktuelle_loesung: string;
  budget_zeitrahmen: string;
  status: string;
  lastContact: string;
  duration: number;
  demoBooked: boolean;
  emailCollected: boolean;
  summary: string;
  roomName: string;
};

const avatarColors = [
  "bg-emerald-100 text-emerald-700",
  "bg-orange-100 text-orange-700",
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
  "bg-amber-100 text-amber-700",
];

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

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function getLeadStatus(call: CallData): string {
  if (call.demo_booked) return "Termin gebucht";
  if (call.lead_score === "A") return "Qualifiziert";
  if (call.lead_score === "B") return "In Betreuung";
  return "Unqualifiziert";
}

function csvField(value: string | number | boolean | null | undefined): string {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export default function LeadsPage() {
  const [calls, setCalls] = useState<CallData[]>([]);
  const [loading, setLoading] = useState(true);
  const [scoreFilter, setScoreFilter] = useState<string>("all");
  const [showFilter, setShowFilter] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/analytics/calls/${deleteTarget.callId}`, { method: "DELETE" });
      if (res.ok) {
        setCalls((prev) => prev.filter((c) => c.id !== deleteTarget.callId));
        if (expandedId === deleteTarget.callId) setExpandedId(null);
      }
    } catch {}
    setDeleting(false);
    setDeleteTarget(null);
  };

  useEffect(() => {
    async function loadLeads() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/analytics/calls?per_page=100`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setCalls(data.calls || []);
      } catch {
        setCalls([]);
      }
      setLoading(false);
    }
    loadLeads();
  }, []);

  const leads: Lead[] = useMemo(() => {
    return calls.map((call, idx) => ({
      id: idx + 1,
      callId: call.id,
      score: call.lead_score || "C",
      branche: call.lead_branche || "Unbekannt",
      unternehmensgroesse: call.lead_unternehmensgroesse || "-",
      aktuelle_loesung: call.lead_aktuelle_loesung || "-",
      budget_zeitrahmen: call.lead_budget_zeitrahmen || "-",
      status: getLeadStatus(call),
      lastContact: call.call_datetime,
      duration: call.duration_seconds || 0,
      demoBooked: call.demo_booked,
      emailCollected: call.email_collected,
      summary: call.transcript_summary || "",
      roomName: call.room_name || "",
    }));
  }, [calls]);

  const filteredLeads = useMemo(() => {
    if (scoreFilter === "all") return leads;
    return leads.filter((l) => l.score === scoreFilter);
  }, [leads, scoreFilter]);

  const handleExportCSV = () => {
    const headers = ["ID", "Score", "Branche", "Unternehmensgröße", "Status", "Datum", "Dauer", "Demo gebucht", "Zusammenfassung"];
    const csvRows = [headers.join(",")];
    filteredLeads.forEach((lead) => {
      const row = [
        csvField(lead.callId),
        csvField(lead.score),
        csvField(lead.branche),
        csvField(lead.unternehmensgroesse),
        csvField(lead.status),
        csvField(new Date(lead.lastContact).toLocaleString("de-DE")),
        csvField(lead.duration),
        csvField(lead.demoBooked ? "Ja" : "Nein"),
        csvField(lead.summary),
      ];
      csvRows.push(row.join(","));
    });
    const bom = "\uFEFF";
    const blob = new Blob([bom + csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `kreativstrom-leads_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const scoreCounts = useMemo(() => {
    const counts = { A: 0, B: 0, C: 0 };
    leads.forEach((l) => {
      if (l.score in counts) counts[l.score as keyof typeof counts]++;
    });
    return counts;
  }, [leads]);

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 p-6 md:p-8 rounded-[2rem] border border-stone-200/50 shadow-[0_4px_30px_-10px_rgba(234,88,12,0.04)] backdrop-blur-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-800">Deine Leads</h1>
          <p className="text-stone-500 font-medium mt-1">
            {leads.length > 0
              ? `${leads.length} Lead${leads.length > 1 ? "s" : ""} aus ${leads.length} Gespräch${leads.length > 1 ? "en" : ""}`
              : "Noch keine Leads generiert"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-stone-200 text-stone-700 px-5 py-2.5 rounded-full font-bold text-sm hover:bg-stone-50 transition shadow-sm"
            >
              <Filter className="w-4 h-4 text-stone-400" />
              {scoreFilter === "all" ? "Filtern" : `Score ${scoreFilter}`}
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </button>
            {showFilter && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden z-10 min-w-[180px]">
                {[
                  { value: "all", label: "Alle Leads", count: leads.length },
                  { value: "A", label: "A-Leads (Heiß)", count: scoreCounts.A },
                  { value: "B", label: "B-Leads (Warm)", count: scoreCounts.B },
                  { value: "C", label: "C-Leads (Kalt)", count: scoreCounts.C },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setScoreFilter(opt.value); setShowFilter(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-stone-50 transition flex items-center justify-between ${
                      scoreFilter === opt.value ? "bg-orange-50 text-orange-700" : "text-stone-700"
                    }`}
                  >
                    {opt.label}
                    <span className="text-xs text-stone-400 font-bold">{opt.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleExportCSV}
            disabled={filteredLeads.length === 0}
            className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-stone-800 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4 text-stone-300" />
            CSV Export
          </button>
        </div>
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
                <h3 className="text-lg font-bold text-stone-900">Lead löschen?</h3>
                <p className="text-sm text-stone-500">Lead #{deleteTarget.callId}{deleteTarget.branche !== "Unbekannt" ? ` — ${deleteTarget.branche}` : ""}</p>
              </div>
            </div>
            <p className="text-sm text-stone-600 mb-6">
              Dieser Lead und der zugehörige Anruf werden unwiderruflich gelöscht.
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

      {/* Score summary cards */}
      {leads.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-emerald-50/60 border border-emerald-200/50 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-700">{scoreCounts.A}</div>
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mt-1">A-Leads</div>
          </div>
          <div className="bg-orange-50/60 border border-orange-200/50 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-700">{scoreCounts.B}</div>
            <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mt-1">B-Leads</div>
          </div>
          <div className="bg-stone-100/60 border border-stone-200/50 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-stone-600">{scoreCounts.C}</div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mt-1">C-Leads</div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
          <span className="ml-3 text-stone-500 font-medium">Lade Leads...</span>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users className="w-12 h-12 text-stone-300 mb-4" />
          <h3 className="text-lg font-bold text-stone-700">
            {scoreFilter !== "all" ? `Keine ${scoreFilter}-Leads gefunden` : "Noch keine Leads"}
          </h3>
          <p className="text-stone-500 font-medium mt-1">
            {scoreFilter !== "all"
              ? "Versuche einen anderen Filter."
              : "Sobald dein Agent Gespräche führt, erscheinen hier die qualifizierten Leads."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredLeads.map((lead, idx) => {
            const isExpanded = expandedId === lead.callId;
            return (
            <Card key={lead.callId} className="p-0 overflow-hidden hover:border-orange-200/60 transition-all hover:shadow-[0_8px_30px_-12px_rgba(234,88,12,0.15)] group">
              <div
                className="p-4 md:p-5 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : lead.callId)}
              >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">
                {/* Avatar & Info */}
                <div className="flex items-center gap-4 min-w-[280px]">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner ${avatarColors[idx % avatarColors.length]}`}>
                    #{lead.callId}
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-800 text-lg group-hover:text-orange-600 transition-colors">
                      Lead #{lead.callId}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-stone-500 text-sm font-medium mt-0.5">
                      {lead.branche !== "Unbekannt" && (
                        <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {lead.branche}</span>
                      )}
                      {lead.unternehmensgroesse !== "-" && (
                        <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {lead.unternehmensgroesse}</span>
                      )}
                      <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {formatDuration(lead.duration)}</span>
                    </div>
                  </div>
                </div>

                {/* Status & Score */}
                <div className="flex flex-wrap items-center gap-2">
                  {lead.demoBooked && (
                    <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-1 rounded-xl text-xs font-bold">
                      <Calendar className="w-3 h-3" /> Demo
                    </div>
                  )}
                  {lead.emailCollected && (
                    <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200/60 px-2.5 py-1 rounded-xl text-xs font-bold">
                      <Mail className="w-3 h-3" /> E-Mail
                    </div>
                  )}
                  <Badge variant={lead.score === "A" ? "success" : lead.score === "B" ? "warning" : "destructive"} className="px-3 py-1 text-sm shadow-sm">
                    Score {lead.score}
                  </Badge>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                      lead.status === "Termin gebucht"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                        : lead.status === "Qualifiziert"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                        : lead.status === "In Betreuung"
                        ? "bg-orange-50 text-orange-700 border border-orange-200/60"
                        : "bg-stone-100 text-stone-600 border border-stone-200"
                    }`}
                  >
                    {lead.status === "Termin gebucht" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />}
                    {lead.status === "Qualifiziert" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />}
                    {lead.status === "In Betreuung" && <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5" />}
                    {lead.status === "Unqualifiziert" && <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mr-1.5" />}
                    {lead.status}
                  </span>
                </div>

                {/* Time + expand */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-stone-400 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-100">
                    <Clock className="w-3.5 h-3.5" />
                    {formatRelativeTime(lead.lastContact)}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(lead); }}
                    className="w-8 h-8 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors"
                    title="Lead löschen"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-8 h-8 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-400 group-hover:text-orange-500 transition-colors">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>
              </div>

              {/* Expanded detail section */}
              {isExpanded && (
                <div className="border-t border-stone-100 bg-[#faf8f5] p-5 md:p-6 flex flex-col gap-4">
                  {/* Summary */}
                  {lead.summary && (
                    <div className="relative overflow-hidden group/summary">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-orange-600 rounded-full" />
                      <div className="pl-4">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-orange-600/80 mb-1.5">
                          Gesprächszusammenfassung
                        </h4>
                        <p className="text-sm text-stone-700 leading-relaxed font-medium">{lead.summary}</p>
                      </div>
                    </div>
                  )}

                  {/* BANT qualification grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {lead.branche !== "Unbekannt" && (
                      <div className="bg-white border border-stone-200/50 rounded-xl p-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Branche</span>
                        <p className="text-sm font-semibold text-stone-800 mt-0.5">{lead.branche}</p>
                      </div>
                    )}
                    {lead.unternehmensgroesse !== "-" && (
                      <div className="bg-white border border-stone-200/50 rounded-xl p-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Größe</span>
                        <p className="text-sm font-semibold text-stone-800 mt-0.5">{lead.unternehmensgroesse}</p>
                      </div>
                    )}
                    {lead.aktuelle_loesung !== "-" && (
                      <div className="bg-white border border-stone-200/50 rounded-xl p-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Akt. Lösung</span>
                        <p className="text-sm font-semibold text-stone-800 mt-0.5">{lead.aktuelle_loesung}</p>
                      </div>
                    )}
                    {lead.budget_zeitrahmen !== "-" && (
                      <div className="bg-white border border-stone-200/50 rounded-xl p-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Budget/Zeitrahmen</span>
                        <p className="text-sm font-semibold text-stone-800 mt-0.5">{lead.budget_zeitrahmen}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
