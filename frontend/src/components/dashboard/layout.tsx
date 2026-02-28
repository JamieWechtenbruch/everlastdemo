"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PhoneCall,
  Users,
  Settings,
  Menu,
  Bell,
  Search,
  Sparkles,
  X,
  Phone,
  Calendar,
  LogOut,
  User,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const navItems = [
  { href: "/dashboard", label: "Übersicht", icon: LayoutDashboard },
  { href: "/dashboard/calls", label: "Letzte Anrufe", icon: PhoneCall },
  { href: "/dashboard/leads", label: "Leads", icon: Users },
];

type CallResult = {
  id: number;
  call_datetime: string;
  duration_seconds: number;
  conversation_phase: string;
  lead_score: string;
  lead_branche: string | null;
  transcript_summary: string | null;
  demo_booked: boolean;
};

type SearchSuggestion = {
  label: string;
  description: string;
  href: string;
  icon: "call" | "lead" | "setting" | "page";
};

const USER_KEY = "kreativstrom_user";
const NOTIF_SEEN_KEY = "kreativstrom_notif_seen";

function getUser(): { firstName: string; lastName: string; email: string } {
  if (typeof window === "undefined") return { firstName: "Max", lastName: "Mustermann", email: "max@kreativstrom.de" };
  try {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  const def = { firstName: "Max", lastName: "Mustermann", email: "max@kreativstrom.de" };
  localStorage.setItem(USER_KEY, JSON.stringify(def));
  return def;
}

function saveUser(user: { firstName: string; lastName: string; email: string }) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function getSeenNotifId(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(NOTIF_SEEN_KEY) || "0", 10);
}

function formatRelative(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMin < 1) return "Gerade eben";
  if (diffMin < 60) return `Vor ${diffMin} Min.`;
  if (diffHours < 24) return `Vor ${diffHours}h`;
  if (diffDays < 7) return `Vor ${diffDays}d`;
  return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchSuggestion[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [allCalls, setAllCalls] = useState<CallResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Notifications
  const [notifOpen, setNotifOpen] = useState(false);
  const [recentCalls, setRecentCalls] = useState<CallResult[]>([]);
  const [seenNotifId, setSeenNotifId] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);

  // User profile
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState({ firstName: "Max", lastName: "Mustermann", email: "max@kreativstrom.de" });
  const [editingProfile, setEditingProfile] = useState(false);
  const [editUser, setEditUser] = useState(user);
  const profileRef = useRef<HTMLDivElement>(null);

  // Load user from localStorage
  useEffect(() => {
    setUser(getUser());
    setSeenNotifId(getSeenNotifId());
  }, []);

  // Fetch calls for search + notifications
  const fetchCalls = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/analytics/calls?per_page=50`);
      if (!res.ok) return;
      const data = await res.json();
      const calls = data.calls || [];
      setAllCalls(calls);
      setRecentCalls(calls.slice(0, 10));
    } catch {}
  }, []);

  useEffect(() => {
    fetchCalls();
    const interval = setInterval(fetchCalls, 30000);
    return () => clearInterval(interval);
  }, [fetchCalls]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
        setEditingProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Search logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const results: SearchSuggestion[] = [];

    // Static pages
    const pages = [
      { label: "Übersicht", description: "Dashboard & KPIs", href: "/dashboard", keywords: ["übersicht", "dashboard", "kpi", "statistik", "overview"] },
      { label: "Letzte Anrufe", description: "Anrufhistorie & Transkripte", href: "/dashboard/calls", keywords: ["anrufe", "calls", "transkript", "gespräch"] },
      { label: "Leads", description: "Lead-Übersicht & Qualifizierung", href: "/dashboard/leads", keywords: ["leads", "qualifizierung", "score", "kontakt"] },
      { label: "Einstellungen", description: "Agent-Konfiguration & Tech-Stack", href: "/dashboard/settings", keywords: ["einstellungen", "settings", "konfiguration", "agent"] },
    ];
    pages.forEach((p) => {
      if (p.label.toLowerCase().includes(q) || p.keywords.some((k) => k.includes(q))) {
        results.push({ label: p.label, description: p.description, href: p.href, icon: "page" });
      }
    });

    // Search calls
    allCalls.forEach((c) => {
      const matches =
        (c.lead_branche && c.lead_branche.toLowerCase().includes(q)) ||
        (c.lead_score && c.lead_score.toLowerCase() === q) ||
        (c.conversation_phase && c.conversation_phase.toLowerCase().includes(q)) ||
        (c.transcript_summary && c.transcript_summary.toLowerCase().includes(q)) ||
        String(c.id) === q;
      if (matches) {
        results.push({
          label: `Anruf #${c.id}${c.lead_branche ? ` — ${c.lead_branche}` : ""}`,
          description: c.transcript_summary?.slice(0, 60) || c.conversation_phase || "",
          href: "/dashboard/calls",
          icon: c.demo_booked ? "lead" : "call",
        });
      }
    });

    setSearchResults(results.slice(0, 8));
  }, [searchQuery, allCalls]);

  const handleSearchSelect = (href: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    router.push(href);
  };

  // Notification count
  const unreadCount = recentCalls.filter((c) => c.id > seenNotifId).length;

  const handleOpenNotifications = () => {
    setNotifOpen(!notifOpen);
    if (!notifOpen && recentCalls.length > 0) {
      const maxId = Math.max(...recentCalls.map((c) => c.id));
      setSeenNotifId(maxId);
      localStorage.setItem(NOTIF_SEEN_KEY, String(maxId));
    }
  };

  const handleSaveProfile = () => {
    saveUser(editUser);
    setUser(editUser);
    setEditingProfile(false);
  };

  const isActive = (href: string) => {
    const clean = pathname?.replace(/^\/flowpilot/, "") || "";
    if (href === "/dashboard") return clean === "/dashboard";
    return clean.startsWith(href);
  };

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="flex min-h-screen w-full bg-[#faf8f5] text-stone-800 font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-64 flex-col border-r border-stone-200/50 bg-[#faf8f5]/80 backdrop-blur-md md:flex sticky top-0 h-screen overflow-hidden">
        <div className="flex h-16 items-center px-6 mt-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-stone-900">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-sm shadow-orange-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>Kreativstrom</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-6">
          <nav className="grid items-start px-4 text-sm font-medium gap-1.5">
            <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 ml-2 mt-2">Menü</div>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                  isActive(item.href)
                    ? "bg-orange-100/50 text-orange-900 hover:bg-orange-100"
                    : "text-stone-500 hover:bg-stone-100/50 hover:text-stone-900"
                }`}
              >
                <item.icon className={`h-4 w-4 ${isActive(item.href) ? "text-orange-600" : "text-stone-400"}`} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4 mb-4">
          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
              isActive("/dashboard/settings")
                ? "bg-orange-100/50 text-orange-900 hover:bg-orange-100"
                : "text-stone-500 hover:bg-stone-100/50 hover:text-stone-900"
            }`}
          >
            <Settings className={`h-4 w-4 ${isActive("/dashboard/settings") ? "text-orange-600" : "text-stone-400"}`} />
            Einstellungen
          </Link>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative w-72 h-full bg-[#faf8f5] border-r border-stone-200 shadow-xl flex flex-col">
            <div className="flex h-16 items-center justify-between px-6 mt-4">
              <span className="font-bold text-xl tracking-tight text-stone-900 flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-sm shadow-orange-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                Kreativstrom
              </span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-stone-500 hover:bg-stone-100 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="grid items-start px-4 text-sm font-medium gap-1.5 py-6">
              <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 ml-2">Menü</div>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                    isActive(item.href)
                      ? "bg-orange-100/50 text-orange-900"
                      : "text-stone-500 hover:bg-stone-100/50 hover:text-stone-900"
                  }`}
                >
                  <item.icon className={`h-4 w-4 ${isActive(item.href) ? "text-orange-600" : "text-stone-400"}`} />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto p-4 mb-4">
              <Link
                href="/dashboard/settings"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                  isActive("/dashboard/settings")
                    ? "bg-orange-100/50 text-orange-900"
                    : "text-stone-500 hover:bg-stone-100/50 hover:text-stone-900"
                }`}
              >
                <Settings className={`h-4 w-4 ${isActive("/dashboard/settings") ? "text-orange-600" : "text-stone-400"}`} />
                Einstellungen
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col w-full flex-1">
        <header className="flex h-16 items-center gap-4 border-b border-stone-200/50 bg-[#faf8f5]/80 backdrop-blur-md px-6 mt-4 mx-4 md:mx-0 rounded-3xl md:rounded-none md:mt-0 shadow-sm shadow-stone-200/20 md:shadow-none border md:border-b md:border-x-0 md:border-t-0">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-stone-500 hover:bg-stone-100 p-2 rounded-xl transition"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Navigationsmenü umschalten</span>
          </button>

          {/* Global Search */}
          <div className="w-full flex-1" ref={searchRef}>
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-stone-400 transition-colors" style={{ color: searchOpen ? "#f97316" : undefined }} />
              <input
                type="text"
                placeholder="Suche nach Anrufen, Leads, Seiten..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                onFocus={() => { if (searchQuery.trim()) setSearchOpen(true); }}
                className="w-full appearance-none bg-white border border-stone-200/60 pl-10 pr-4 rounded-full py-2 text-sm text-stone-700 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(""); setSearchOpen(false); }} className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600">
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Search dropdown */}
              {searchOpen && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                  {searchResults.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-stone-400">
                      Keine Ergebnisse für &ldquo;{searchQuery}&rdquo;
                    </div>
                  ) : (
                    <div className="py-2">
                      {searchResults.map((r, i) => (
                        <button
                          key={i}
                          onClick={() => handleSearchSelect(r.href)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-orange-50 transition-colors"
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            r.icon === "call" ? "bg-blue-100 text-blue-600"
                              : r.icon === "lead" ? "bg-emerald-100 text-emerald-600"
                              : r.icon === "setting" ? "bg-stone-100 text-stone-600"
                              : "bg-orange-100 text-orange-600"
                          }`}>
                            {r.icon === "call" ? <Phone className="w-3.5 h-3.5" /> :
                             r.icon === "lead" ? <Users className="w-3.5 h-3.5" /> :
                             r.icon === "setting" ? <Settings className="w-3.5 h-3.5" /> :
                             <LayoutDashboard className="w-3.5 h-3.5" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-semibold text-stone-800 truncate">{r.label}</div>
                            <div className="text-xs text-stone-400 truncate">{r.description}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={handleOpenNotifications}
              className="relative rounded-full bg-white border border-stone-200/60 p-2 text-stone-500 hover:text-orange-600 hover:bg-orange-50 transition-colors shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[18px] h-[18px] bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-stone-800">Benachrichtigungen</span>
                  {recentCalls.length > 0 && (
                    <span className="text-xs font-medium text-stone-400">{recentCalls.length} Anrufe</span>
                  )}
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                  {recentCalls.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-stone-400">
                      Noch keine Benachrichtigungen
                    </div>
                  ) : (
                    recentCalls.map((call) => (
                      <button
                        key={call.id}
                        onClick={() => { setNotifOpen(false); router.push("/dashboard/calls"); }}
                        className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-stone-50 transition-colors border-b border-stone-50 last:border-0 ${
                          call.id > seenNotifId ? "bg-orange-50/40" : ""
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          call.demo_booked ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                        }`}>
                          {call.demo_booked ? <Calendar className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-stone-800 truncate">
                              Anruf #{call.id}
                              {call.lead_branche ? ` — ${call.lead_branche}` : ""}
                            </span>
                            <span className="text-[10px] font-medium text-stone-400 shrink-0">
                              {formatRelative(call.call_datetime)}
                            </span>
                          </div>
                          <div className="text-xs text-stone-500 mt-0.5 truncate">
                            {call.demo_booked
                              ? "Demo-Termin gebucht"
                              : call.transcript_summary?.slice(0, 50) || `Score ${call.lead_score || "—"}`}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
                {recentCalls.length > 0 && (
                  <div className="px-4 py-2.5 border-t border-stone-100">
                    <button
                      onClick={() => { setNotifOpen(false); router.push("/dashboard/calls"); }}
                      className="w-full text-center text-xs font-bold text-orange-600 hover:text-orange-700 transition"
                    >
                      Alle Anrufe anzeigen
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setProfileOpen(!profileOpen); setEditingProfile(false); setEditUser(user); }}
              className="h-9 w-9 rounded-full bg-gradient-to-tr from-orange-400 to-orange-500 border border-orange-300/50 flex items-center justify-center text-xs font-bold text-white shadow-[0_2px_10px_-4px_rgba(234,88,12,0.3)] cursor-pointer hover:shadow-md transition-shadow"
            >
              {initials}
            </button>

            {profileOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden z-50">
                {!editingProfile ? (
                  <>
                    <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-orange-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-stone-800 truncate">{user.firstName} {user.lastName}</div>
                        <div className="text-xs text-stone-400 truncate">{user.email}</div>
                      </div>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => { setEditingProfile(true); setEditUser(user); }}
                        className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition"
                      >
                        <User className="w-4 h-4 text-stone-400" />
                        Profil bearbeiten
                      </button>
                      <button
                        onClick={() => { setProfileOpen(false); router.push("/dashboard/settings"); }}
                        className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition"
                      >
                        <Settings className="w-4 h-4 text-stone-400" />
                        Einstellungen
                      </button>
                      <button
                        onClick={() => { setProfileOpen(false); router.push("/"); }}
                        className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Abmelden
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-5">
                    <div className="text-sm font-bold text-stone-800 mb-3">Profil bearbeiten</div>
                    <div className="grid gap-3">
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1 block">Vorname</label>
                        <input
                          type="text"
                          value={editUser.firstName}
                          onChange={(e) => setEditUser({ ...editUser, firstName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1 block">Nachname</label>
                        <input
                          type="text"
                          value={editUser.lastName}
                          onChange={(e) => setEditUser({ ...editUser, lastName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1 block">E-Mail</label>
                        <input
                          type="email"
                          value={editUser.email}
                          onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                        />
                      </div>
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={handleSaveProfile}
                          className="flex-1 bg-stone-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-stone-800 transition"
                        >
                          Speichern
                        </button>
                        <button
                          onClick={() => setEditingProfile(false)}
                          className="flex-1 bg-stone-100 text-stone-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-stone-200 transition"
                        >
                          Abbrechen
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
