import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Nova Studio — Agenție digitală premium",
  description:
    "Construim experiențe web rapide, elegante și moderne. Design premium, dezvoltare și strategie pentru brandul tău.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro">
      <body className="relative min-h-screen overflow-x-hidden">
        {/* Background layer: grid + glow */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="bg-grid absolute inset-0" />
          <div className="absolute left-1/2 top-[-10rem] h-[34rem] w-[60rem] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[140px]" />
          <div className="absolute bottom-[-12rem] right-[-6rem] h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-[130px]" />
        </div>

        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
