"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Übersicht", icon: LayoutDashboard },
  { href: "/dashboard/calls", label: "Letzte Anrufe", icon: PhoneCall },
  { href: "/dashboard/leads", label: "Leads", icon: Users },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    // Strip basePath for comparison
    const clean = pathname?.replace(/^\/docusync/, "") || "";
    if (href === "/dashboard") return clean === "/dashboard";
    return clean.startsWith(href);
  };

  return (
    <div className="flex min-h-screen w-full bg-[#faf8f5] text-stone-800 font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-64 flex-col border-r border-stone-200/50 bg-[#faf8f5]/80 backdrop-blur-md md:flex">
        <div className="flex h-16 items-center px-6 mt-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-stone-900">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-sm shadow-orange-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>DocuSync</span>
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
                DocuSync
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

          <div className="w-full flex-1">
            <form>
              <div className="relative group max-w-md">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-stone-400 transition-colors group-focus-within:text-orange-500" />
                <input
                  type="search"
                  placeholder="Suchen..."
                  className="w-full appearance-none bg-white border border-stone-200/60 pl-10 rounded-full px-4 py-2 text-sm text-stone-700 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50"
                />
              </div>
            </form>
          </div>

          <button className="relative rounded-full bg-white border border-stone-200/60 p-2 text-stone-500 hover:text-orange-600 hover:bg-orange-50 transition-colors shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
            <Bell className="h-4 w-4" />
          </button>

          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-stone-200 to-stone-100 border border-stone-200 flex items-center justify-center text-xs font-bold text-stone-600 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] cursor-pointer hover:shadow-md transition-shadow">
            ME
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
