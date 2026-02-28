import Link from "next/link";
import {
  LayoutDashboard,
  PhoneCall,
  Users,
  Settings,
  Menu,
  Bell,
  Search,
  Sparkles,
} from "lucide-react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-[#faf8f5] text-stone-800 font-sans">
      {/* Sidebar - Soft and slightly floating */}
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
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-2xl bg-orange-100/50 px-4 py-3 text-orange-900 transition-all hover:bg-orange-100"
            >
              <LayoutDashboard className="h-4 w-4 text-orange-600" />
              Übersicht
            </Link>
            <Link
              href="/dashboard/calls"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-stone-500 transition-all hover:bg-stone-100/50 hover:text-stone-900"
            >
              <PhoneCall className="h-4 w-4 text-stone-400" />
              Letzte Anrufe
            </Link>
            <Link
              href="/dashboard/leads"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-stone-500 transition-all hover:bg-stone-100/50 hover:text-stone-900"
            >
              <Users className="h-4 w-4 text-stone-400" />
              Leads
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4 mb-4">
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-stone-500 transition-all hover:bg-stone-100/50 hover:text-stone-900"
            >
              <Settings className="h-4 w-4 text-stone-400" />
              Einstellungen
            </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col w-full flex-1">
        <header className="flex h-16 items-center gap-4 border-b border-stone-200/50 bg-[#faf8f5]/80 backdrop-blur-md px-6 mt-4 mx-4 md:mx-0 rounded-3xl md:rounded-none md:mt-0 shadow-sm shadow-stone-200/20 md:shadow-none border md:border-b md:border-x-0 md:border-t-0">
          <button className="md:hidden text-stone-500 hover:bg-stone-100 p-2 rounded-xl transition">
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
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
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
