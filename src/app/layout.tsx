import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import ToastContainer from "@/components/ToastContainer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NEXUS — AI Content Transformation & Assurance Platform",
  description:
    "NEXUS transforms source intelligence into multiple verified communication artefacts using structured Content DNA, factual validation, source provenance, and human approval workflows.",
  keywords: [
    "AI",
    "content transformation",
    "cybersecurity",
    "NTRO",
    "SIH 2026",
    "content DNA",
  ],
  robots: "noindex",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className="antialiased"
        style={{
          background: "#0a0f1e",
          color: "#e8edf5",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* App Shell */}
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar />

          {/* Main area */}
          <div
            className="flex-1 flex flex-col overflow-hidden"
            style={{
              marginLeft: "var(--sidebar-width, 240px)",
              transition: "margin-left 0.25s ease",
            }}
            id="main-content"
          >
            {/* Top Bar */}
            <TopBar />

            {/* Page Content */}
            <main
              className="app-main flex-1 overflow-y-auto page-enter"
              style={{ marginTop: 56 }}
            >
              {children}
            </main>
          </div>
        </div>

        {/* Global Toast Notifications */}
        <ToastContainer />
      </body>
    </html>
  );
}
