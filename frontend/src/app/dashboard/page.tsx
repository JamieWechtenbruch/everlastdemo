import { DashboardOverview } from "@/components/dashboard/overview";

export const metadata = {
  title: "Dashboard - DocuSync.io",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <div className="bg-white/60 p-6 md:p-8 rounded-[2rem] border border-stone-200/50 shadow-[0_4px_30px_-10px_rgba(234,88,12,0.04)] backdrop-blur-sm flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-800">
            Guten Morgen, Alex 👋
          </h1>
          <p className="text-stone-500 font-medium mt-1">
            Hier ist, was dein Voice Agent heute geleistet hat. Sieht super aus! ☕️
          </p>
        </div>
        <div className="flex items-center gap-2 bg-orange-100/50 text-orange-800 font-medium px-4 py-2 rounded-2xl border border-orange-200/50">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          Agenten-Status: Aktiv
        </div>
      </div>
      <DashboardOverview />
    </div>
  );
}
