import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../components/Sidebar";

export const metadata: Metadata = {
  title: "Jump - Campaign Builder",
  description: "AI-powered campaign builder for ticketing platforms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex flex-col h-screen bg-white">
          {/* Top Navigation - Full Width */}
          <header className="bg-[#131939] h-14 relative z-20">
            <div className="flex items-center justify-between px-5 h-full relative">
              <div className="flex items-center gap-4">
                <button>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M4 8H8V4H4V8ZM10 20H14V16H10V20ZM4 20H8V16H4V20ZM4 14H8V10H4V14ZM10 14H14V10H10V14ZM16 4V8H20V4H16ZM10 8H14V4H10V8ZM16 14H20V10H16V14ZM16 20H20V16H16V20Z" />
                  </svg>
                </button>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#0C2340] flex-shrink-0">
                    <img
                      src="https://a.espncdn.com/i/teamlogos/nba/500/min.png"
                      alt="Minnesota Timberwolves Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-white text-xs font-semibold tracking-tight">Minnesota Timberwolves</div>
                    <div className="text-white text-xs opacity-75 tracking-tight">Jump Admin</div>
                  </div>
                </div>
              </div>

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="bg-[rgba(0,0,0,0.4)] rounded-full px-3 py-2 flex items-center justify-between w-[485px]">
                  <div className="flex items-center gap-1">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="white" opacity="0.55">
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                    </svg>
                    <span className="text-sm text-white opacity-55 tracking-tight">Search</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-white opacity-55 tracking-tight">⌘K</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <button className="relative text-white hover:opacity-80 transition-opacity">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                </button>

                <button className="text-white hover:opacity-80 transition-opacity">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </button>

                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-[#657dff] flex items-center justify-center text-white text-xs font-semibold">
                    MC
                  </div>
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-[#ccff00] border-2 border-[#131939]"></div>
                </div>
              </div>
            </div>
          </header>

          {/* Content Area with Sidebar */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-white">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
