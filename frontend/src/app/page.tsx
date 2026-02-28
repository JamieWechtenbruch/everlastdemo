import Link from "next/link";
import { VoiceWidget } from "@/components/voice-widget";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white text-stone-900 font-sans overflow-hidden flex flex-col">

      {/* Background Vector Line */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none z-0 flex justify-end">
        <img
          src="https://cdn.prod.website-files.com/6916bcaf0384493efbddbb2b/6926a2e2166eaddf3f01d024_Vector%201118.svg"
          alt=""
          className="object-cover w-[80%] max-w-[1300px] opacity-70"
        />
      </div>

      {/* Navbar */}
      <header className="flex items-center justify-between px-6 lg:px-12 py-6 relative z-50 w-full max-w-[1600px] mx-auto">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter text-stone-900">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          DocuSync.io
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-stone-800">
          <Link href="#" className="hover:text-black transition-colors">Produkt</Link>
          <Link href="#" className="hover:text-black transition-colors">Case Studies</Link>
          <Link href="#" className="hover:text-black transition-colors">Preise</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="hidden md:flex text-sm font-bold px-6 py-3 rounded-full bg-black text-white hover:bg-stone-800 transition-all shadow-md"
          >
            Dashboard Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center relative z-10 w-full max-w-[1600px] mx-auto px-6 lg:px-12 pt-10 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">

          {/* Left Column - Text */}
          <div className="flex flex-col items-start max-w-2xl">
            <div className="text-orange-600 font-bold tracking-wide uppercase text-sm mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-600"></span>
              Fallstudie: Siemens AG
            </div>

            <h1 className="text-[3.5rem] lg:text-[5rem] font-extrabold tracking-tight mb-6 leading-[1.05] text-stone-900">
              Wie Siemens <br/>
              <span className="relative">
                12% Kosten
                <img
                  src="https://cdn.prod.website-files.com/6916bcaf0384493efbddbb2b/6926979362f93110864a43fc_Vector%20-%202025-11-26T113042.092.svg"
                  className="absolute -top-4 -right-8 w-6 h-6 animate-pulse"
                  alt=""
                />
              </span> <br/>
              einsparte.
            </h1>

            <p className="text-xl text-stone-600 mb-10 font-medium leading-relaxed max-w-xl">
              Lies unsere Case Study und erfahre, wie die KI-Vertragsanalyse von DocuSync versteckte Lizenzkosten aufdeckt. Hast du Fragen dazu? Unser Voice-Agent beantwortet sie in Echtzeit.
            </p>

            <div className="flex items-center gap-4 mb-14">
              <VoiceWidget />
            </div>

            {/* Feature Icons */}
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

          {/* Right Column - Robot Image */}
          <div className="relative w-full flex justify-center lg:justify-end">
            <img
              src="https://cdn.prod.website-files.com/6916bcaf0384493efbddbb2b/69269baeac4a97fe1ab51c6d_3ea1420939bbda3198d1f953517c1ac9_nuonix-home-two-hero-image.avif"
              alt="AI Robot"
              className="w-full max-w-[700px] h-auto object-contain relative z-10"
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
      </main>
    </div>
  );
}
