"use client";

import { useState, useEffect } from "react";
import { DashboardOverview } from "@/components/dashboard/overview";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

function getGreeting(name: string): string {
  const hour = new Date().getHours();
  const base = hour < 12 ? "Guten Morgen" : hour < 18 ? "Guten Tag" : "Guten Abend";
  return name ? `${base}, ${name}` : base;
}

function getUserFirstName(): string {
  if (typeof window === "undefined") return "";
  try {
    const stored = localStorage.getItem("kreativstrom_user");
    if (stored) return JSON.parse(stored).firstName || "";
  } catch {}
  return "Max";
}

export default function DashboardPage() {
  const [totalCalls, setTotalCalls] = useState(0);
  const [agentOnline, setAgentOnline] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    setUserName(getUserFirstName());
    async function checkStatus() {
      try {
        const res = await fetch(`${API_URL}/api/analytics/kpis?days=1`);
        if (res.ok) {
          const data = await res.json();
          setTotalCalls(data.total_calls || 0);
          setAgentOnline(true);
        }
      } catch {
        setAgentOnline(false);
      }
    }
    checkStatus();
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <div className="bg-white/60 p-6 md:p-8 rounded-[2rem] border border-stone-200/50 shadow-[0_4px_30px_-10px_rgba(234,88,12,0.04)] backdrop-blur-sm flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-800">
            {getGreeting(userName)}
          </h1>
          <p className="text-stone-500 font-medium mt-1">
            {totalCalls > 0
              ? `Heute ${totalCalls} Gespräch${totalCalls > 1 ? "e" : ""} geführt.`
              : "Dein Voice Agent wartet auf den nächsten Anruf."}
          </p>
        </div>
        <div className={`flex items-center gap-2 font-medium px-4 py-2 rounded-2xl border ${
          agentOnline
            ? "bg-emerald-50/60 text-emerald-700 border-emerald-200/50"
            : "bg-stone-100 text-stone-500 border-stone-200/50"
        }`}>
          <span className={`w-2 h-2 rounded-full ${agentOnline ? "bg-emerald-500 animate-pulse" : "bg-stone-400"}`}></span>
          Agenten-Status: {agentOnline ? "Aktiv" : "Offline"}
        </div>
      </div>
      <DashboardOverview />
    </div>
  );
}
