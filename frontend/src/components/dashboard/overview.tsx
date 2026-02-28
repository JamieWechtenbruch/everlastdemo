"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ""

const phaseLabels: Record<string, string> = {
  greeting: "Begrüßung",
  qualification: "Qualifizierung",
  availability_check: "Verfügbarkeit",
  booking: "Buchung",
  completed: "Abgeschlossen",
  idle_timeout: "Timeout",
  max_duration: "Max. Dauer",
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}

export function DashboardOverview() {
  const [kpis, setKpis] = useState<any>(null)
  const [conversionData, setConversionData] = useState<any[]>([])
  const [leadQualityData, setLeadQualityData] = useState<any[]>([])
  const [dropOffData, setDropOffData] = useState<any[]>([])
  const [durationData, setDurationData] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const [kpiRes, callsRes] = await Promise.all([
          fetch(`${API_URL}/api/analytics/kpis?days=30`),
          fetch(`${API_URL}/api/analytics/calls?per_page=100`),
        ])

        // Process KPIs
        if (kpiRes.ok) {
          const data = await kpiRes.json()
          setKpis(data)

          // Transform calls_by_day to chart format
          if (data.calls_by_day?.length > 0) {
            const dayNames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]
            setConversionData(
              data.calls_by_day.slice(-7).map((d: any) => ({
                name: dayNames[new Date(d.date).getDay()],
                calls: d.count,
                booked: d.conversions,
              }))
            )
          }

          // Transform lead score distribution
          if (data.lead_score_distribution) {
            const dist = data.lead_score_distribution
            const total = (dist.A || 0) + (dist.B || 0) + (dist.C || 0)
            if (total > 0) {
              setLeadQualityData([
                { name: "A-Leads (Heiß)", value: dist.A || 0, pct: Math.round(((dist.A || 0) / total) * 100), color: "#10b981" },
                { name: "B-Leads (Warm)", value: dist.B || 0, pct: Math.round(((dist.B || 0) / total) * 100), color: "#fb923c" },
                { name: "C-Leads (Kalt)", value: dist.C || 0, pct: Math.round(((dist.C || 0) / total) * 100), color: "#f43f5e" },
              ])
            }
          }

          // Transform drop-off points
          if (data.drop_off_points) {
            const points = data.drop_off_points
            const dropOff = Object.entries(points)
              .filter(([, count]) => (count as number) > 0)
              .map(([phase, count]) => ({
                reason: phaseLabels[phase] || phase,
                count: count as number,
              }))
              .sort((a, b) => b.count - a.count)
            if (dropOff.length > 0) setDropOffData(dropOff)
          }
        }

        // Process calls for duration distribution
        if (callsRes.ok) {
          const callsData = await callsRes.json()
          const calls = callsData.calls || []
          if (calls.length > 0) {
            const buckets = [
              { label: "0-30s", min: 0, max: 30, count: 0 },
              { label: "30s-1m", min: 30, max: 60, count: 0 },
              { label: "1-3 Min", min: 60, max: 180, count: 0 },
              { label: "3-5 Min", min: 180, max: 300, count: 0 },
              { label: "5+ Min", min: 300, max: Infinity, count: 0 },
            ]
            calls.forEach((c: any) => {
              const dur = c.duration_seconds || 0
              for (const b of buckets) {
                if (dur >= b.min && dur < b.max) { b.count++; break }
              }
            })
            setDurationData(buckets.filter(b => b.count > 0).map(b => ({ duration: b.label, count: b.count })))
          }
        }
      } catch {}
    }
    loadData()
  }, [])

  const totalCalls = kpis?.total_calls ?? 0
  const conversionRate = kpis?.conversion_rate ?? 0
  const avgDuration = formatDuration(kpis?.avg_duration_seconds ?? 0)
  const demoBookings = kpis?.demo_bookings ?? 0

  const hasData = totalCalls > 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* KPI Cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-orange-600">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{conversionRate}%</div>
          <p className="text-xs text-stone-500">Demo-Buchungsrate</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Geführte Anrufe</CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-orange-600">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCalls}</div>
          <p className="text-xs text-stone-500">Letzte 30 Tage</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ø Gesprächsdauer</CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-orange-600">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgDuration}</div>
          <p className="text-xs text-stone-500">Optimale Länge zur Qualifizierung</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gebuchte Demos</CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-orange-600">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{demoBookings}</div>
          <p className="text-xs text-stone-500">Automatisch terminiert</p>
        </CardContent>
      </Card>

      {/* Charts */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Conversion-Übersicht (Anrufe vs. Gebucht)</CardTitle>
          <CardDescription>Leistung des Voice Agents der letzten 7 Tage.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          {conversionData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <LineChart data={conversionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
                <XAxis dataKey="name" stroke="#78716c" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#78716c" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e7e5e4', borderRadius: '1rem', padding: '12px', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)' }} />
                <Line type="monotone" dataKey="calls" stroke="#a8a29e" strokeWidth={2} dot={false} name="Alle Anrufe" />
                <Line type="monotone" dataKey="booked" stroke="#ea580c" strokeWidth={3} dot={{ r: 4 }} name="Gebuchte Demos" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-stone-400 font-medium text-sm">
              Noch keine Daten vorhanden
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Lead-Qualität (Verteilung)</CardTitle>
          <CardDescription>Bewertung der vom Agenten qualifizierten Leads.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center relative">
          {leadQualityData.length > 0 ? (
            <>
              <ResponsiveContainer width="60%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie data={leadQualityData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {leadQualityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e7e5e4', borderRadius: '1rem', padding: '12px', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-4">
                {leadQualityData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm text-stone-600 font-medium">{entry.name} ({entry.value})</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-stone-400 font-medium text-sm">
              Noch keine Leads qualifiziert
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Drop-off Punkte</CardTitle>
          <CardDescription>In welcher Phase brechen Leads das Gespräch ab?</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          {dropOffData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={dropOffData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#78716c" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis dataKey="reason" type="category" stroke="#57534e" fontSize={11} tickLine={false} axisLine={false} width={120} />
                <Tooltip cursor={{fill: '#f5f5f4'}} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e7e5e4', borderRadius: '1rem', padding: '12px', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)' }} />
                <Bar dataKey="count" fill="#f43f5e" radius={[0, 8, 8, 0]} name="Anzahl" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-stone-400 font-medium text-sm">
              Noch keine Daten vorhanden
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Gesprächsdauer-Verteilung</CardTitle>
          <CardDescription>Wie lange dauern die Anrufe?</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          {durationData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={durationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
                <XAxis dataKey="duration" stroke="#78716c" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#78716c" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip cursor={{fill: '#f5f5f4'}} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e7e5e4', borderRadius: '1rem', padding: '12px', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)' }} />
                <Bar dataKey="count" fill="#60a5fa" radius={[8, 8, 0, 0]} name="Anzahl der Anrufe" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-stone-400 font-medium text-sm">
              Noch keine Daten vorhanden
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
