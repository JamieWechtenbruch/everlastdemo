import Link from "next/link";
import { VoiceWidget } from "@/components/voice-widget";
import {
  Zap, BarChart3, Plug, Check, TrendingUp, Quote,
  Star, Shield, Building2, Users, Workflow, Globe,
  Plane, Rocket, Crown, ChevronRight, Headphones,
  ArrowRight,
} from "lucide-react";

/* ── Data ─────────────────────────────────────────────────── */

const products = [
  {
    name: "FlowPilot Automate",
    tagline: "Nie wieder Copy-Paste zwischen Apps.",
    icon: Zap,
    gradient: "from-orange-500 to-amber-400",
    features: [
      "Drag-and-Drop Workflow-Builder",
      "200+ Integrationen (Slack, HubSpot, SAP, ...)",
      "KI-gestützte Prozesserkennung",
      "Automatische Fehlerbehandlung & Retry-Logik",
    ],
    description:
      "Automatisiere wiederkehrende Aufgaben in Minuten statt Wochen. Von der Rechnungsfreigabe bis zum Onboarding — FlowPilot Automate verbindet deine Tools und lässt Daten fließen.",
  },
  {
    name: "FlowPilot Cockpit",
    tagline: "Dein Kontrollzentrum für alle Geschäftsprozesse.",
    icon: BarChart3,
    gradient: "from-emerald-500 to-teal-400",
    features: [
      "Echtzeit-KPI-Dashboard mit Live-Updates",
      "Benutzerdefinierte Reports & Alerts",
      "Team-Performance auf einen Blick",
      "Engpass-Erkennung mit KI-Empfehlungen",
    ],
    description:
      "Alle Zahlen, alle Teams, ein Dashboard. FlowPilot Cockpit gibt dir den 360-Grad-Blick — und sagt dir, wo es klemmt, bevor du es selbst merkst.",
  },
  {
    name: "FlowPilot Connect",
    tagline: "Verbinde alles. Wirklich alles.",
    icon: Plug,
    gradient: "from-blue-500 to-indigo-400",
    features: [
      "REST API & GraphQL-Endpunkte",
      "Webhooks für Echtzeit-Events",
      "Custom Connectors (Low-Code Builder)",
      "OAuth 2.0 & Enterprise SSO",
    ],
    description:
      "Dein Legacy-ERP spricht nicht mit deinem neuen CRM? FlowPilot Connect ist der Übersetzer, den deine IT-Abteilung sich immer gewünscht hat.",
  },
];

const pricingTiers = [
  {
    name: "Takeoff",
    subtitle: "Starter",
    price: "39",
    period: "/Monat",
    users: "Bis 5 User",
    icon: Plane,
    features: [
      "FlowPilot Automate (25 Flows)",
      "Basis-Dashboard",
      "E-Mail Support",
      "5 Integrationen",
    ],
  },
  {
    name: "Cruising",
    subtitle: "Business",
    price: "119",
    period: "/Monat",
    users: "Bis 25 User",
    icon: Rocket,
    popular: true,
    features: [
      "Automate (unbegrenzt)",
      "Cockpit (alle Features)",
      "Priority Support (4h SLA)",
      "50+ Integrationen",
      "API-Zugang & Webhooks",
    ],
  },
  {
    name: "First Class",
    subtitle: "Enterprise",
    price: "Auf Anfrage",
    period: "",
    users: "Unbegrenzt",
    icon: Crown,
    features: [
      "Alles aus Cruising",
      "Connect (vollständig)",
      "Dedicated Account Manager",
      "Custom Connectors & SSO",
      "99,9% SLA-Garantie",
    ],
  },
];

const testimonials = [
  {
    quote: "Wir haben 3 Tools abgeschafft und machen jetzt alles mit FlowPilot. Mein CFO hat zum ersten Mal gelächelt.",
    name: "Sarah Hoffmann",
    role: "COO, Kreativstrom GmbH",
  },
  {
    quote: "Setup hat 20 Minuten gedauert. Unsere alte Lösung brauchte 3 Monate und einen externen Berater.",
    name: "Dr. Markus Weber",
    role: "Geschäftsführer, TechVenture AG",
  },
  {
    quote: "FlowPilot Connect hat unsere Legacy-Systeme endlich miteinander reden lassen. Ohne einen einzigen Entwickler.",
    name: "Julia Krause",
    role: "IT-Leiterin, Nordlicht Media",
  },
];

const integrations = [
  "Slack", "HubSpot", "Salesforce", "SAP", "Microsoft 365",
  "Google Workspace", "Jira", "Asana", "Notion", "Stripe",
  "Shopify", "Zendesk", "Pipedrive", "Monday.com", "Trello",
];

const numbers = [
  { value: "850+", label: "Unternehmen", icon: Building2 },
  { value: "12.000+", label: "Aktive User", icon: Users },
  { value: "2,4 Mio", label: "Flows / Monat", icon: Workflow },
  { value: "99,9%", label: "Uptime", icon: Shield },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white text-stone-900 font-sans overflow-x-hidden flex flex-col">

      {/* Background Vector Line */}
      <div className="absolute top-0 right-0 w-full h-[900px] pointer-events-none z-0 flex justify-end overflow-hidden">
        <img
          src="https://cdn.prod.website-files.com/6916bcaf0384493efbddbb2b/6926a2e2166eaddf3f01d024_Vector%201118.svg"
          alt=""
          className="object-cover w-[80%] max-w-[1300px] opacity-70"
        />
      </div>

      {/* ── Navbar ──────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className="flex items-center justify-between px-6 lg:px-12 py-4 w-full max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter text-stone-900">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            FlowPilot.io
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-stone-600">
            <a href="#produkte" className="hover:text-black transition-colors">Produkt</a>
            <a href="#casestudy" className="hover:text-black transition-colors">Case Study</a>
            <a href="#preise" className="hover:text-black transition-colors">Preise</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="hidden md:flex text-sm font-bold px-6 py-2.5 rounded-full bg-black text-white hover:bg-stone-800 transition-all shadow-md"
            >
              Dashboard Login
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────── */}
      <section className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 pt-16 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">
          <div className="flex flex-col items-start max-w-2xl">
            <div className="text-orange-600 font-bold tracking-wide uppercase text-sm mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-600"></span>
              Fallstudie: Agentur Kreativstrom
            </div>

            <h1 className="text-[3rem] lg:text-[4.5rem] font-extrabold tracking-tight mb-6 leading-[1.05] text-stone-900">
              Wie Kreativstrom <br/>
              <span className="relative">
                45% schneller
                <img
                  src="https://cdn.prod.website-files.com/6916bcaf0384493efbddbb2b/6926979362f93110864a43fc_Vector%20-%202025-11-26T113042.092.svg"
                  className="absolute -top-4 -right-8 w-6 h-6 animate-pulse"
                  alt=""
                />
              </span> <br/>
              liefert.
            </h1>

            <p className="text-lg text-stone-600 mb-10 font-medium leading-relaxed max-w-xl">
              Erfahre, wie FlowPilot die Projektlaufzeiten einer 35-köpfigen Agentur um 45% verkürzt hat. Fragen? Unser KI-Agent beantwortet sie in Echtzeit.
            </p>

            <div className="flex items-center gap-4 mb-12">
              <VoiceWidget />
            </div>

            <div className="flex items-center gap-8 border-t border-stone-200 pt-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
                  <img src="https://cdn.prod.website-files.com/6916bcaf0384493efbddbb2b/69269a39001e0a8ee2fc6bf1_Group%201597883905.svg" alt="" className="w-6 h-6" />
                </div>
                <div className="font-bold text-stone-900 text-sm leading-tight">
                  Echtzeit<br/>Antworten
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
                  <img src="https://cdn.prod.website-files.com/6916bcaf0384493efbddbb2b/69269a7257f0f198911b9cc7_Vector%20-%202025-11-26T114253.838.svg" alt="" className="w-6 h-6" />
                </div>
                <div className="font-bold text-stone-900 text-sm leading-tight">
                  Automatische<br/>Terminbuchung
                </div>
              </div>
            </div>
          </div>

          <div className="relative w-full flex justify-center lg:justify-end">
            <img
              src="https://cdn.prod.website-files.com/6916bcaf0384493efbddbb2b/69269baeac4a97fe1ab51c6d_3ea1420939bbda3198d1f953517c1ac9_nuonix-home-two-hero-image.avif"
              alt="AI Robot"
              className="w-full max-w-[600px] h-auto object-contain relative z-10"
            />
            <img
              src="https://cdn.prod.website-files.com/6916bcaf0384493efbddbb2b/6926aa05eea3e7d5e7b2493b_Vector%20-%202025-11-26T124841.120.svg"
              className="absolute top-10 left-10 w-12 h-12 z-20 animate-bounce"
              alt=""
            />
            <img
              src="https://cdn.prod.website-files.com/6916bcaf0384493efbddbb2b/6926aa66d1b458025a0b0ac1_Vector%20-%202025-11-26T124847.169.svg"
              className="absolute bottom-20 right-10 w-10 h-10 z-20 animate-pulse"
              alt=""
            />
          </div>
        </div>
      </section>

      {/* ── Company Numbers ─────────────────────────── */}
      <section className="bg-stone-50 border-y border-stone-200/60 py-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {numbers.map((s) => (
              <div key={s.label} className="text-center">
                <s.icon className="w-6 h-6 text-orange-500 mx-auto mb-3" />
                <div className="text-3xl lg:text-4xl font-extrabold text-stone-900">{s.value}</div>
                <div className="text-sm font-bold text-stone-400 uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Products ────────────────────────────────── */}
      <section id="produkte" className="py-20 scroll-mt-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <div className="text-orange-600 font-bold tracking-wide uppercase text-sm mb-3">Unsere Produkte</div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-stone-900 mb-3">
              Drei Module, ein Ziel
            </h2>
            <p className="text-lg text-stone-500 font-medium max-w-2xl mx-auto">
              Dein Unternehmen auf Autopilot — von der Prozessautomatisierung bis zur API-Integration.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {products.map((p) => (
              <div key={p.name} className="bg-white border border-stone-200/60 rounded-3xl p-8 hover:shadow-xl transition-shadow group">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.gradient} flex items-center justify-center shadow-lg mb-6`}>
                  <p.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-1">{p.name}</h3>
                <p className="text-sm font-semibold text-orange-600 mb-4">{p.tagline}</p>
                <p className="text-stone-600 font-medium leading-relaxed text-sm mb-6">{p.description}</p>
                <div className="flex flex-col gap-2.5">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-stone-700 font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Integrations */}
          <div className="mt-14 text-center">
            <div className="flex items-center justify-center gap-2 mb-5">
              <Globe className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-stone-800">200+ Integrationen</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
              {integrations.map((name) => (
                <span
                  key={name}
                  className="px-3.5 py-2 bg-stone-50 border border-stone-200/60 rounded-xl text-sm font-semibold text-stone-600"
                >
                  {name}
                </span>
              ))}
              <span className="px-3.5 py-2 bg-orange-50 border border-orange-200/60 rounded-xl text-sm font-bold text-orange-600">
                +185 weitere
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Case Study ──────────────────────────────── */}
      <section id="casestudy" className="py-20 bg-gradient-to-br from-orange-50/80 to-amber-50/40 border-y border-orange-100/60 scroll-mt-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <div className="text-orange-600 font-bold tracking-wide uppercase text-sm mb-3">Case Study</div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-stone-900 mb-3">
              Kreativstrom GmbH
            </h2>
            <p className="text-lg text-stone-500 font-medium max-w-2xl mx-auto">
              Wie eine Berliner Werbeagentur ihre Projektlaufzeiten um 45% verkürzt hat.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h3 className="text-lg font-bold text-stone-800 mb-3">Die Herausforderung</h3>
              <p className="text-stone-600 font-medium leading-relaxed mb-6">
                Kreativstrom, eine 35-köpfige Berliner Werbeagentur, kämpfte mit manueller
                Projektplanung, verlorenen Briefings und Excel-Tabellen, die niemand aktuell hielt.
                Jede Woche gingen 12+ Stunden nur für Koordination drauf.
              </p>
              <h3 className="text-lg font-bold text-stone-800 mb-3">Die Lösung</h3>
              <p className="text-stone-600 font-medium leading-relaxed">
                Mit FlowPilot Automate werden Briefing-Anfragen automatisch erfasst,
                Timelines generiert und Ressourcen zugewiesen. FlowPilot Cockpit gibt dem
                Projektmanagement Echtzeit-Überblick über alle laufenden Kampagnen.
              </p>
            </div>

            <div>
              <div className="bg-white rounded-2xl p-6 border border-orange-200/40 shadow-sm mb-6">
                <div className="flex items-start gap-3 mb-3">
                  <Quote className="w-5 h-5 text-orange-400 mt-1 shrink-0 rotate-180" />
                  <p className="text-stone-700 font-medium italic leading-relaxed">
                    &ldquo;Wir haben nicht nur Zeit gespart — wir haben aufgehört, uns in
                    Statusmeetings anzuschreien. Das allein war den Preis wert.&rdquo;
                  </p>
                </div>
                <div className="text-sm font-bold text-stone-500 ml-8">— Sarah Hoffmann, COO Kreativstrom</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center bg-white rounded-2xl p-5 border border-orange-200/40 shadow-sm">
                  <div className="text-3xl font-extrabold text-orange-600">45%</div>
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mt-1">Schnellere Projekte</div>
                </div>
                <div className="text-center bg-white rounded-2xl p-5 border border-orange-200/40 shadow-sm">
                  <div className="text-3xl font-extrabold text-orange-600">12h</div>
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mt-1">Gespart / Woche</div>
                </div>
                <div className="text-center bg-white rounded-2xl p-5 border border-orange-200/40 shadow-sm">
                  <div className="text-3xl font-extrabold text-orange-600">3x</div>
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mt-1">ROI in 6 Monaten</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-stone-900 mb-3">
              Was Kunden sagen
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white border border-stone-200/60 rounded-3xl p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="text-stone-600 font-medium leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <div className="text-sm font-bold text-stone-800">{t.name}</div>
                  <div className="text-xs text-stone-400">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────── */}
      <section id="preise" className="py-20 bg-stone-50 border-y border-stone-200/60 scroll-mt-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <div className="text-orange-600 font-bold tracking-wide uppercase text-sm mb-3">Preise</div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-stone-900 mb-3">
              Kein Kleingedrucktes. Kein Pilotenschein nötig.
            </h2>
            <p className="text-lg text-stone-500 font-medium">14 Tage kostenlos testen — keine Kreditkarte nötig.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`bg-white rounded-3xl p-8 border relative ${
                  tier.popular
                    ? "border-orange-300 shadow-[0_8px_40px_-12px_rgba(234,88,12,0.2)]"
                    : "border-stone-200/60"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                    Beliebt
                  </div>
                )}
                <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">{tier.subtitle}</div>
                <h3 className="text-xl font-bold text-stone-900 mb-4">{tier.name}</h3>
                <div className="mb-1">
                  {tier.price === "Auf Anfrage" ? (
                    <span className="text-2xl font-extrabold text-stone-900">Auf Anfrage</span>
                  ) : (
                    <>
                      <span className="text-4xl font-extrabold text-stone-900">&euro;{tier.price}</span>
                      <span className="text-stone-500 font-medium">{tier.period}</span>
                    </>
                  )}
                </div>
                <div className="text-sm text-stone-500 font-medium mb-6">{tier.users}</div>
                <div className="flex flex-col gap-3">
                  {tier.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-stone-700 font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security ────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap justify-center gap-8 md:gap-14 text-center">
            {[
              { title: "DSGVO-konform", desc: "Deutsche Rechenzentren" },
              { title: "ISO 27001", desc: "Zertifiziert" },
              { title: "SOC 2 Type II", desc: "Jährlich auditiert" },
              { title: "AES-256 / TLS 1.3", desc: "Verschlüsselung" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-emerald-500 shrink-0" />
                <div className="text-left">
                  <div className="text-sm font-bold text-stone-800">{item.title}</div>
                  <div className="text-xs text-stone-400">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <section className="py-20 bg-stone-900">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
            Bereit für den Autopiloten?
          </h2>
          <p className="text-stone-400 font-medium text-lg mb-8 max-w-xl mx-auto">
            14 Tage kostenlos. Keine Kreditkarte. Setup in unter 5 Minuten.
            Oder sprich direkt mit unserem KI-Agenten.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a href="#" className="flex items-center gap-2 bg-white/10 text-white px-6 py-3.5 rounded-full text-sm font-bold hover:bg-white/20 transition border border-white/10">
              <Headphones className="w-4 h-4" />
              Demo buchen
            </a>
            <a href="#" className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3.5 rounded-full text-sm font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/20">
              Kostenlos starten
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────── */}
      <footer className="py-8 border-t border-stone-200/60">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm font-bold text-stone-400">
            &copy; 2026 FlowPilot.io — Workflow Automation GmbH
          </div>
          <div className="text-xs text-stone-400">
            Torstraße 77, 10119 Berlin &middot; info@flowpilot.io &middot; +49 30 12345678
          </div>
        </div>
      </footer>
    </div>
  );
}
