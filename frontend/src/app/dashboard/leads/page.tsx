"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Download, Filter, Mail, Building2, Clock } from "lucide-react";

const leads = [
  { id: "L-1001", name: "Sarah Jenkins", initials: "SJ", company: "Acme Corp", email: "sarah@acmecorp.com", score: "A", status: "Qualifiziert", lastContact: "Vor 10 Min.", avatarColor: "bg-emerald-100 text-emerald-700" },
  { id: "L-1002", name: "Marcus Thorne", initials: "MT", company: "TechFlow Ltd", email: "m.thorne@techflow.io", score: "B", status: "In Betreuung", lastContact: "Vor 1 Stunde", avatarColor: "bg-orange-100 text-orange-700" },
  { id: "L-1003", name: "Emily Chen", initials: "EC", company: "Globex", email: "emily.c@globex.co", score: "C", status: "Unqualifiziert", lastContact: "Vor 3 Stunden", avatarColor: "bg-stone-200 text-stone-700" },
  { id: "L-1004", name: "David Miller", initials: "DM", company: "Initech", email: "dmiller@initech.net", score: "A", status: "Qualifiziert", lastContact: "Gestern", avatarColor: "bg-blue-100 text-blue-700" },
  { id: "L-1005", name: "Jessica Alba", initials: "JA", company: "Honest Co.", email: "jessica@honest.com", score: "A", status: "Qualifiziert", lastContact: "Vor 2 Tagen", avatarColor: "bg-purple-100 text-purple-700" },
  { id: "L-1006", name: "Tom Hanks", initials: "TH", company: "Playtone", email: "tom@playtone.com", score: "B", status: "In Betreuung", lastContact: "Vor 3 Tagen", avatarColor: "bg-rose-100 text-rose-700" },
];

export default function LeadsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 p-6 md:p-8 rounded-[2rem] border border-stone-200/50 shadow-[0_4px_30px_-10px_rgba(234,88,12,0.04)] backdrop-blur-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-800">Deine Leads 🌱</h1>
          <p className="text-stone-500 font-medium mt-1">
            Diese Kontakte hat dein Agent in den letzten Tagen generiert.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-stone-200 text-stone-700 px-5 py-2.5 rounded-full font-bold text-sm hover:bg-stone-50 transition shadow-sm">
            <Filter className="w-4 h-4 text-stone-400" />
            Filtern
          </button>
          <button className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-stone-800 transition shadow-sm">
            <Download className="w-4 h-4 text-stone-300" />
            CSV Export
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {leads.map((lead) => (
          <Card key={lead.id} className="p-4 md:p-5 hover:border-orange-200/60 transition-all hover:shadow-[0_8px_30px_-12px_rgba(234,88,12,0.15)] group cursor-pointer">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">
              
              {/* Profile / Info */}
              <div className="flex items-center gap-4 min-w-[280px]">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner ${lead.avatarColor}`}>
                  {lead.initials}
                </div>
                <div>
                  <h3 className="font-bold text-stone-800 text-lg group-hover:text-orange-600 transition-colors">
                    {lead.name}
                  </h3>
                  <div className="flex items-center gap-3 text-stone-500 text-sm font-medium mt-0.5">
                    <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {lead.company}</span>
                  </div>
                </div>
              </div>

              {/* Contact Info (Hidden on small screens) */}
              <div className="hidden lg:flex items-center gap-2 text-sm text-stone-500 font-medium min-w-[200px]">
                <Mail className="w-4 h-4 text-stone-400" />
                {lead.email}
              </div>

              {/* Status & Score */}
              <div className="flex flex-wrap items-center gap-3 min-w-[240px]">
                <Badge variant={lead.score === 'A' ? 'success' : lead.score === 'B' ? 'warning' : 'destructive'} className="px-3 py-1 text-sm shadow-sm">
                  Score {lead.score}
                </Badge>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                  lead.status === 'Qualifiziert' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 
                  lead.status === 'In Betreuung' ? 'bg-orange-50 text-orange-700 border border-orange-200/60' : 
                  'bg-stone-100 text-stone-600 border border-stone-200'
                }`}>
                  {lead.status === 'Qualifiziert' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>}
                  {lead.status === 'In Betreuung' && <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5"></span>}
                  {lead.status === 'Unqualifiziert' && <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mr-1.5"></span>}
                  {lead.status}
                </span>
              </div>

              {/* Time & Action */}
              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                <div className="flex items-center gap-1.5 text-sm font-medium text-stone-400 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-100">
                  <Clock className="w-3.5 h-3.5" />
                  {lead.lastContact}
                </div>
                <button className="p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
