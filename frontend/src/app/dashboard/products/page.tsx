"use client";

import { Card } from "@/components/ui/card";
import {
  Zap, BarChart3, Plug, Plane, Rocket, Crown,
  Check, Users, Quote, TrendingUp, ArrowRight,
  Globe, Shield, Clock, Headphones, Building2,
  MessageSquare, FileText, Workflow, Target,
  ChevronDown, ChevronUp, Sparkles, Star,
} from "lucide-react";
import { useState } from "react";

/* ── Products ─────────────────────────────────────────────── */

const products = [
  {
    name: "FlowPilot Automate",
    tagline: "Nie wieder Copy-Paste zwischen Apps.",
    icon: Zap,
    color: "from-orange-500 to-amber-400",
    bgLight: "bg-orange-50",
    borderColor: "border-orange-200/60",
    useCases: [
      { title: "Rechnungsfreigabe", desc: "Eingang → Prüfung → Freigabe → Buchhaltung — vollautomatisch in unter 2 Minuten." },
      { title: "Mitarbeiter-Onboarding", desc: "IT-Zugänge, Willkommensmail, Kalendereinladungen — alles mit einem Klick." },
      { title: "Lead-Routing", desc: "Neue Anfragen werden automatisch dem richtigen Vertriebler zugewiesen." },
    ],
    features: [
      "Drag-and-Drop Workflow-Builder",
      "200+ Integrationen (Slack, HubSpot, SAP, ...)",
      "KI-gestützte Prozesserkennung",
      "Automatische Fehlerbehandlung & Retry-Logik",
      "Echtzeit-Monitoring aller aktiven Flows",
      "Versionierung & Rollback für jeden Workflow",
    ],
    description:
      "Automatisiere wiederkehrende Aufgaben in Minuten statt Wochen. Von der Rechnungsfreigabe bis zum Onboarding neuer Mitarbeiter — FlowPilot Automate verbindet deine Tools und lässt Daten fließen, ohne dass jemand dazwischenfunken muss.",
    stats: { flows: "2.4 Mio+", label: "Flows ausgeführt / Monat" },
  },
  {
    name: "FlowPilot Cockpit",
    tagline: "Dein Kontrollzentrum für alle Geschäftsprozesse.",
    icon: BarChart3,
    color: "from-emerald-500 to-teal-400",
    bgLight: "bg-emerald-50",
    borderColor: "border-emerald-200/60",
    useCases: [
      { title: "Vertriebsperformance", desc: "Pipeline-Wert, Conversion-Rates und Teamziele live auf einem Screen." },
      { title: "Projekt-Tracking", desc: "Alle Deadlines, Budgets und Meilensteine in Echtzeit — nie wieder Statusmeetings." },
      { title: "Engpass-Alarm", desc: "KI erkennt Bottlenecks bevor sie entstehen und schlägt Lösungen vor." },
    ],
    features: [
      "Echtzeit-KPI-Dashboard mit Live-Updates",
      "Benutzerdefinierte Reports & Alerts",
      "Team-Performance auf einen Blick",
      "Engpass-Erkennung mit KI-Empfehlungen",
      "Export als PDF, CSV oder direkt in Slack",
      "Drill-Down von Gesamtübersicht bis Einzelvorgang",
    ],
    description:
      "Alle Zahlen, alle Teams, ein Dashboard. FlowPilot Cockpit gibt dir den 360-Grad-Blick auf dein Unternehmen — und sagt dir sogar, wo es gerade klemmt, bevor du es selbst merkst.",
    stats: { flows: "98,7%", label: "Kundenzufriedenheit" },
  },
  {
    name: "FlowPilot Connect",
    tagline: "Verbinde alles. Wirklich alles.",
    icon: Plug,
    color: "from-blue-500 to-indigo-400",
    bgLight: "bg-blue-50",
    borderColor: "border-blue-200/60",
    useCases: [
      { title: "ERP ↔ CRM Sync", desc: "SAP-Aufträge fließen automatisch in HubSpot — Vertrieb sieht alles live." },
      { title: "Custom Webhooks", desc: "Eigene Events auslösen, wenn sich Daten in irgendeinem System ändern." },
      { title: "Legacy-Anbindung", desc: "Auch das 15 Jahre alte ERP wird angebunden — ohne es anfassen zu müssen." },
    ],
    features: [
      "REST API & GraphQL-Endpunkte",
      "Webhooks für Echtzeit-Events",
      "Custom Connectors (Low-Code Builder)",
      "OAuth 2.0 & Enterprise SSO",
      "Sandbox-Umgebung zum Testen",
      "Rate-Limiting & Retry mit Backoff",
    ],
    description:
      "Dein Legacy-ERP spricht nicht mit deinem neuen CRM? Kein Problem. FlowPilot Connect ist der Übersetzer, den deine IT-Abteilung sich immer gewünscht hat — nur ohne die sechs Monate Implementierungszeit.",
    stats: { flows: "200+", label: "Vorgefertigte Integrationen" },
  },
];

/* ── Pricing ──────────────────────────────────────────────── */

const pricingTiers = [
  {
    name: "Takeoff",
    subtitle: "Starter",
    price: "39",
    period: "/Monat",
    users: "Bis 5 User",
    icon: Plane,
    color: "text-stone-600",
    bgColor: "bg-stone-50",
    borderColor: "border-stone-200",
    features: [
      "FlowPilot Automate (25 Flows)",
      "Basis-Dashboard",
      "E-Mail Support",
      "5 Integrationen",
      "Community-Zugang",
    ],
  },
  {
    name: "Cruising",
    subtitle: "Business",
    price: "119",
    period: "/Monat",
    users: "Bis 25 User",
    icon: Rocket,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-300",
    popular: true,
    features: [
      "FlowPilot Automate (unbegrenzt)",
      "FlowPilot Cockpit (alle Features)",
      "Priority Support (4h SLA)",
      "50+ Integrationen",
      "API-Zugang & Webhooks",
      "Custom Reports",
    ],
  },
  {
    name: "First Class",
    subtitle: "Enterprise",
    price: "Auf Anfrage",
    period: "",
    users: "Unbegrenzt",
    icon: Crown,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-300",
    features: [
      "Alles aus Cruising",
      "FlowPilot Connect (vollständig)",
      "Dedicated Account Manager",
      "Custom Connectors & SSO",
      "On-Premise Option",
      "99,9% SLA-Garantie",
    ],
  },
];

/* ── Integrations ─────────────────────────────────────────── */

const integrations = [
  "Slack", "HubSpot", "Salesforce", "SAP", "Microsoft 365",
  "Google Workspace", "Jira", "Asana", "Notion", "Stripe",
  "Shopify", "Zendesk", "Pipedrive", "Monday.com", "Trello",
  "Zapier", "Airtable", "Confluence", "GitHub", "Linear",
];

/* ── Testimonials ─────────────────────────────────────────── */

const testimonials = [
  {
    quote: "Wir haben 3 Tools abgeschafft und machen jetzt alles mit FlowPilot. Mein CFO hat zum ersten Mal gelächelt.",
    name: "Sarah Hoffmann",
    role: "COO, Kreativstrom GmbH",
    initials: "SH",
    color: "bg-orange-100 text-orange-700",
  },
  {
    quote: "Setup hat 20 Minuten gedauert. Unsere alte Lösung brauchte 3 Monate und einen externen Berater.",
    name: "Dr. Markus Weber",
    role: "Geschäftsführer, TechVenture AG",
    initials: "MW",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    quote: "FlowPilot Connect hat unsere Legacy-Systeme endlich miteinander reden lassen. Ohne einen einzigen Entwickler.",
    name: "Julia Krause",
    role: "IT-Leiterin, Nordlicht Media",
    initials: "JK",
    color: "bg-blue-100 text-blue-700",
  },
];

/* ── FAQ ──────────────────────────────────────────────────── */

const faqs = [
  {
    q: "Wie schnell kann ich FlowPilot einrichten?",
    a: "Die meisten Teams sind in unter 30 Minuten produktiv. Einfach Account erstellen, erste Integration verbinden, und los. Keine Installation, kein IT-Aufwand.",
  },
  {
    q: "Kann ich FlowPilot mit meinem bestehenden ERP verbinden?",
    a: "Ja! FlowPilot Connect unterstützt über 200 Integrationen out-of-the-box, plus einen Low-Code Connector-Builder für alles andere. Auch Legacy-Systeme mit REST oder SOAP-APIs sind kein Problem.",
  },
  {
    q: "Ist FlowPilot DSGVO-konform?",
    a: "Absolut. Alle Daten werden in deutschen Rechenzentren (Frankfurt) gehostet. Wir sind ISO 27001 zertifiziert und bieten auf Wunsch auch On-Premise-Deployment an.",
  },
  {
    q: "Was passiert, wenn ein automatisierter Workflow fehlschlägt?",
    a: "FlowPilot Automate hat eingebaute Retry-Logik mit exponential Backoff. Bei dauerhaften Fehlern wirst du sofort per Slack, E-Mail oder SMS benachrichtigt — mit konkreten Lösungsvorschlägen.",
  },
  {
    q: "Gibt es eine kostenlose Testphase?",
    a: "Ja, 14 Tage kostenlos mit vollem Funktionsumfang (Cruising-Plan). Keine Kreditkarte nötig.",
  },
];

/* ── Team ─────────────────────────────────────────────────── */

const team = [
  {
    name: "Max Berger",
    role: "CEO & Gründer",
    bio: "Hat FlowPilot gegründet, weil er seinen eigenen Workflow nicht im Griff hatte. Vorher: 8 Jahre McKinsey, wo er gelernt hat, wie man Berater-Rechnungen automatisiert.",
    initials: "MB",
    color: "bg-orange-100 text-orange-700",
  },
  {
    name: "Lisa Chen",
    role: "CTO",
    bio: "Glaubt fest daran, dass kein Prozess zu klein zum Automatisieren ist. Hat vor FlowPilot die Deployment-Pipeline bei Zalando gebaut. Trinkt mehr Kaffee als der gesamte Vertrieb.",
    initials: "LC",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "Tom Richter",
    role: "Head of Sales",
    bio: "Verkauft Automatisierung, nutzt aber heimlich noch Excel für seine Kundenliste. Behauptet, das sei 'strategische Ironie'. Vorher: Vertriebsleiter bei Personio.",
    initials: "TR",
    color: "bg-blue-100 text-blue-700",
  },
];

/* ── Numbers ──────────────────────────────────────────────── */

const companyNumbers = [
  { value: "850+", label: "Unternehmen", icon: Building2 },
  { value: "12.000+", label: "Aktive User", icon: Users },
  { value: "2,4 Mio", label: "Flows / Monat", icon: Workflow },
  { value: "99,9%", label: "Uptime SLA", icon: Shield },
];

/* ── Component ────────────────────────────────────────────── */

export default function ProductsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full">
      {/* Header / Company Intro */}
      <div className="bg-white/60 p-6 md:p-8 rounded-[2rem] border border-stone-200/50 shadow-[0_4px_30px_-10px_rgba(234,88,12,0.04)] backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-800">
            FlowPilot.io
          </h1>
        </div>
        <p className="text-stone-600 font-medium leading-relaxed max-w-3xl">
          FlowPilot ist die All-in-One Plattform für Workflow-Automatisierung.
          Wir helfen wachsenden Teams, manuelle Prozesse zu eliminieren, bessere
          Entscheidungen zu treffen und sich auf das zu konzentrieren, was wirklich zählt.
        </p>
        <p className="text-orange-600 font-semibold text-sm mt-2">
          Autopilot für deine Geschäftsprozesse — weniger Chaos, mehr Flow.
        </p>
      </div>

      {/* Company Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {companyNumbers.map((stat) => (
          <Card key={stat.label} className="p-5 text-center">
            <stat.icon className="w-5 h-5 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-stone-800">{stat.value}</div>
            <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mt-1">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Products */}
      <div>
        <h2 className="text-xl font-bold text-stone-800 mb-1">Produkte</h2>
        <p className="text-stone-500 font-medium text-sm mb-5">Drei Module, ein Ziel: Dein Unternehmen auf Autopilot.</p>
        <div className="grid gap-6">
          {products.map((product) => (
            <Card key={product.name} className="p-0 overflow-hidden">
              <div className="flex flex-col">
                {/* Top: Icon + Name + Description */}
                <div className="flex flex-col lg:flex-row">
                  <div className={`${product.bgLight} p-6 md:p-8 lg:w-[320px] shrink-0 flex flex-col items-start gap-4 border-b lg:border-b-0 lg:border-r ${product.borderColor}`}>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center shadow-lg`}>
                      <product.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-stone-800">{product.name}</h3>
                      <p className="text-sm font-semibold text-stone-500 mt-1">{product.tagline}</p>
                    </div>
                    <div className="mt-auto pt-2">
                      <div className="text-2xl font-bold text-stone-800">{product.stats.flows}</div>
                      <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">{product.stats.label}</div>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 flex-1">
                    <p className="text-stone-600 font-medium leading-relaxed mb-5">
                      {product.description}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-2 mb-6">
                      {product.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-2.5 text-sm">
                          <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span className="text-stone-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Use Cases */}
                    <div className="border-t border-stone-100 pt-5">
                      <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Anwendungsfälle</div>
                      <div className="grid sm:grid-cols-3 gap-3">
                        {product.useCases.map((uc) => (
                          <div key={uc.title} className="bg-stone-50 rounded-xl p-3.5">
                            <div className="text-sm font-bold text-stone-700 mb-1">{uc.title}</div>
                            <div className="text-xs text-stone-500 font-medium leading-relaxed">{uc.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Integrations */}
      <Card className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-1">
          <Globe className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl font-bold text-stone-800">200+ Integrationen</h2>
        </div>
        <p className="text-stone-500 font-medium text-sm mb-5">
          Verbinde FlowPilot mit den Tools, die du bereits nutzt.
        </p>
        <div className="flex flex-wrap gap-2">
          {integrations.map((name) => (
            <span
              key={name}
              className="px-3.5 py-2 bg-stone-50 border border-stone-200/60 rounded-xl text-sm font-semibold text-stone-600 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition-colors cursor-default"
            >
              {name}
            </span>
          ))}
          <span className="px-3.5 py-2 bg-orange-50 border border-orange-200/60 rounded-xl text-sm font-bold text-orange-600">
            +180 weitere
          </span>
        </div>
      </Card>

      {/* Case Study — expanded */}
      <Card className="p-6 md:p-8 bg-gradient-to-br from-orange-50/80 to-amber-50/50 border-orange-200/40">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
              Case Study — Kreativstrom GmbH
            </div>
            <h3 className="text-lg font-bold text-stone-800 mb-2">
              Wie eine Berliner Werbeagentur ihre Projektlaufzeiten um 45% verkürzt hat
            </h3>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-bold text-stone-700 mb-2">Die Herausforderung</h4>
            <p className="text-stone-600 font-medium text-sm leading-relaxed mb-4">
              Kreativstrom, eine 35-köpfige Berliner Werbeagentur, kämpfte mit manueller
              Projektplanung, verlorenen Briefings und Excel-Tabellen, die niemand aktuell hielt.
              Jede Woche gingen 12+ Stunden nur für Koordination drauf.
            </p>
            <h4 className="text-sm font-bold text-stone-700 mb-2">Die Lösung</h4>
            <p className="text-stone-600 font-medium text-sm leading-relaxed">
              Mit FlowPilot Automate werden Briefing-Anfragen jetzt automatisch erfasst,
              Timelines generiert und Ressourcen zugewiesen. FlowPilot Cockpit gibt dem
              Projektmanagement Echtzeit-Überblick über alle laufenden Kampagnen.
            </p>
          </div>
          <div>
            <div className="bg-white/70 rounded-2xl p-5 border border-orange-200/30 mb-4">
              <div className="flex items-start gap-2 mb-3">
                <Quote className="w-4 h-4 text-orange-400 mt-1 shrink-0 rotate-180" />
                <p className="text-sm text-stone-700 font-medium italic leading-relaxed">
                  &ldquo;Wir haben nicht nur Zeit gespart — wir haben aufgehört, uns in
                  Statusmeetings anzuschreien. Das allein war den Preis wert.&rdquo;
                </p>
              </div>
              <div className="text-xs font-bold text-stone-500 ml-6">— Sarah Hoffmann, COO Kreativstrom</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center bg-white/70 rounded-xl p-3 border border-orange-200/30">
                <div className="text-2xl font-bold text-orange-600">45%</div>
                <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Schnellere Projekte</div>
              </div>
              <div className="text-center bg-white/70 rounded-xl p-3 border border-orange-200/30">
                <div className="text-2xl font-bold text-orange-600">12h</div>
                <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Gespart / Woche</div>
              </div>
              <div className="text-center bg-white/70 rounded-xl p-3 border border-orange-200/30">
                <div className="text-2xl font-bold text-orange-600">3x</div>
                <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">ROI in 6 Monaten</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Testimonials */}
      <div>
        <h2 className="text-xl font-bold text-stone-800 mb-1">Was Kunden sagen</h2>
        <p className="text-stone-500 font-medium text-sm mb-5">Ehrliches Feedback von echten Teams.</p>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <Card key={t.name} className="p-6">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                ))}
              </div>
              <div className="flex items-start gap-2 mb-4">
                <Quote className="w-4 h-4 text-stone-300 mt-0.5 shrink-0 rotate-180" />
                <p className="text-sm text-stone-600 font-medium italic leading-relaxed">{t.quote}</p>
              </div>
              <div className="flex items-center gap-3 mt-auto pt-2 border-t border-stone-100">
                <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center font-bold text-sm`}>
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-bold text-stone-800">{t.name}</div>
                  <div className="text-xs text-stone-400">{t.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div>
        <h2 className="text-xl font-bold text-stone-800 mb-1">Preise</h2>
        <p className="text-stone-500 font-medium text-sm mb-5">Kein Kleingedrucktes. Kein Pilotenschein nötig. 14 Tage kostenlos testen.</p>
        <div className="grid md:grid-cols-3 gap-5">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.name}
              className={`p-6 relative ${tier.popular ? "border-orange-300 shadow-[0_8px_30px_-12px_rgba(234,88,12,0.2)]" : ""}`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow">
                  Beliebt
                </div>
              )}
              <div className={`w-10 h-10 rounded-xl ${tier.bgColor} flex items-center justify-center mb-4`}>
                <tier.icon className={`w-5 h-5 ${tier.color}`} />
              </div>
              <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">{tier.subtitle}</div>
              <h3 className="text-lg font-bold text-stone-800">{tier.name}</h3>
              <div className="mt-3 mb-1">
                {tier.price === "Auf Anfrage" ? (
                  <span className="text-2xl font-bold text-stone-800">Auf Anfrage</span>
                ) : (
                  <>
                    <span className="text-3xl font-bold text-stone-800">&euro;{tier.price}</span>
                    <span className="text-stone-500 font-medium text-sm">{tier.period}</span>
                  </>
                )}
              </div>
              <div className="text-sm text-stone-500 font-medium mb-5">{tier.users}</div>
              <div className="flex flex-col gap-2.5">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-stone-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-xl font-bold text-stone-800 mb-1">Häufige Fragen</h2>
        <p className="text-stone-500 font-medium text-sm mb-5">Alles, was du vor dem Start wissen musst.</p>
        <div className="grid gap-3">
          {faqs.map((faq, i) => (
            <Card
              key={i}
              className="p-0 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="flex items-center justify-between gap-3 px-5 py-4">
                <span className="text-sm font-bold text-stone-700">{faq.q}</span>
                {openFaq === i ? (
                  <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                )}
              </div>
              {openFaq === i && (
                <div className="px-5 pb-4 -mt-1">
                  <p className="text-sm text-stone-600 font-medium leading-relaxed">{faq.a}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Team */}
      <div>
        <h2 className="text-xl font-bold text-stone-800 mb-1">Das Team</h2>
        <p className="text-stone-500 font-medium text-sm mb-5">Drei Leute, eine Mission: Weniger manuelle Arbeit für alle.</p>
        <div className="grid md:grid-cols-3 gap-5">
          {team.map((person) => (
            <Card key={person.name} className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl ${person.color} flex items-center justify-center font-bold text-lg`}>
                  {person.initials}
                </div>
                <div>
                  <h3 className="font-bold text-stone-800">{person.name}</h3>
                  <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">{person.role}</div>
                </div>
              </div>
              <p className="text-sm text-stone-600 font-medium leading-relaxed">{person.bio}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Security & Compliance */}
      <Card className="p-6 md:p-8 bg-stone-50/50">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-stone-800">Sicherheit & Compliance</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: "DSGVO-konform", desc: "Deutsche Rechenzentren, Frankfurt am Main" },
            { title: "ISO 27001", desc: "Zertifiziertes Informationssicherheits-management" },
            { title: "SOC 2 Type II", desc: "Jährlich auditiert durch unabhängige Prüfer" },
            { title: "Verschlüsselung", desc: "AES-256 at rest, TLS 1.3 in transit" },
          ].map((item) => (
            <div key={item.title} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-sm font-bold text-stone-700">{item.title}</span>
              </div>
              <span className="text-xs text-stone-500 font-medium ml-6">{item.desc}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* CTA */}
      <Card className="p-6 md:p-8 bg-gradient-to-br from-stone-900 to-stone-800 border-stone-700">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Bereit für den Autopiloten?</h2>
            <p className="text-stone-400 font-medium text-sm">
              14 Tage kostenlos testen. Keine Kreditkarte nötig. Setup in unter 5 Minuten.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 text-white px-5 py-3 rounded-2xl text-sm font-bold hover:bg-white/20 transition cursor-pointer">
              <Headphones className="w-4 h-4" />
              Demo buchen
            </div>
            <div className="flex items-center gap-2 bg-orange-500 text-white px-5 py-3 rounded-2xl text-sm font-bold hover:bg-orange-600 transition cursor-pointer shadow-lg shadow-orange-500/20">
              Kostenlos starten
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Card>

      {/* Contact info */}
      <div className="text-center pb-4">
        <p className="text-xs text-stone-400 font-medium">
          FlowPilot.io — Workflow Automation GmbH &middot; Torstraße 77, 10119 Berlin &middot; info@flowpilot.io &middot; +49 30 12345678
        </p>
      </div>
    </div>
  );
}
