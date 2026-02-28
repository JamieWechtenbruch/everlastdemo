"use client"

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

const conversionData = [
  { name: "Mo", calls: 120, booked: 24 },
  { name: "Di", calls: 132, booked: 30 },
  { name: "Mi", calls: 101, booked: 18 },
  { name: "Do", calls: 145, booked: 42 },
  { name: "Fr", calls: 160, booked: 50 },
  { name: "Sa", calls: 80, booked: 12 },
  { name: "So", calls: 90, booked: 15 },
]

const leadQualityData = [
  { name: "A-Leads (Heiß)", value: 35, color: "#10b981" }, // Emerald
  { name: "B-Leads (Warm)", value: 45, color: "#fb923c" }, // Soft Orange
  { name: "C-Leads (Kalt)", value: 20, color: "#f43f5e" }, // Soft Rose/Red
]

const dropOffData = [
  { reason: "Preis zu hoch", count: 45 },
  { reason: "Falscher Zeitpunkt", count: 32 },
  { reason: "Fehlendes Feature", count: 28 },
  { reason: "Frühzeitig aufgelegt", count: 15 },
  { reason: "Nutzt Konkurrenz", count: 12 },
]

const callDurationData = [
  { duration: "0-1 Min", count: 40 },
  { duration: "1-3 Min", count: 85 },
  { duration: "3-5 Min", count: 120 },
  { duration: "5-10 Min", count: 65 },
  { duration: "10+ Min", count: 25 },
]

export function DashboardOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* KPI Cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Conversion Rate
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-orange-600"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24,5%</div>
          <p className="text-xs text-stone-500">
            +4,1% zum Vormonat
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Geführte Anrufe
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-orange-600"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">828</div>
          <p className="text-xs text-stone-500">
            Ø 118 Anrufe/Tag
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ø Gesprächsdauer</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-orange-600"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">4m 12s</div>
          <p className="text-xs text-stone-500">
            Optimale Länge zur Qualifizierung
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Gebuchte Demos
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-orange-600"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
            <path d="M8 14h.01" />
            <path d="M12 14h.01" />
            <path d="M16 14h.01" />
            <path d="M8 18h.01" />
            <path d="M12 18h.01" />
            <path d="M16 18h.01" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">203</div>
          <p className="text-xs text-stone-500">
            Automatisch terminiert
          </p>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Conversion-Übersicht (Anrufe vs. Gebucht)</CardTitle>
          <CardDescription>
            Leistung des Voice Agents der letzten 7 Tage.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart data={conversionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
              <XAxis dataKey="name" stroke="#78716c" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#78716c" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e7e5e4', borderRadius: '1rem', padding: '12px', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)' }}
                itemStyle={{ color: '#09090b' }}
              />
              <Line type="monotone" dataKey="calls" stroke="#a8a29e" strokeWidth={2} dot={false} name="Alle Anrufe" />
              <Line type="monotone" dataKey="booked" stroke="#ea580c" strokeWidth={3} dot={{ r: 4 }} name="Gebuchte Demos" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Lead-Qualität (Verteilung)</CardTitle>
          <CardDescription>
            Bewertung der vom Agenten qualifizierten Leads.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart>
              <Pie
                data={leadQualityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {leadQualityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e7e5e4', borderRadius: '1rem', padding: '12px', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
            {leadQualityData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-sm text-stone-600 font-medium">{entry.name} ({entry.value}%)</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Häufigste Abbruchgründe & Einwände</CardTitle>
          <CardDescription>
            Hauptgründe für Anrufe, die ohne Termin endeten.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={dropOffData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" horizontal={true} vertical={false} />
              <XAxis type="number" stroke="#78716c" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis dataKey="reason" type="category" stroke="#57534e" fontSize={11} tickLine={false} axisLine={false} width={120} />
              <Tooltip 
                cursor={{fill: '#f5f5f4'}}
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e7e5e4', borderRadius: '1rem', padding: '12px', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)' }}
              />
              <Bar dataKey="count" fill="#f43f5e" radius={[0, 8, 8, 0]} name="Häufigkeit" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Gesprächsdauer vs. Conversion</CardTitle>
          <CardDescription>
            Dauer der Anrufe, bis typischerweise eine Buchung erfolgt.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={callDurationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
              <XAxis dataKey="duration" stroke="#78716c" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#78716c" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{fill: '#f5f5f4'}}
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e7e5e4', borderRadius: '1rem', padding: '12px', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)' }}
              />
              <Bar dataKey="count" fill="#60a5fa" radius={[8, 8, 0, 0]} name="Anzahl der Anrufe" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
