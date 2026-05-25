import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";
import ConsentProvider from "@/components/consent/ConsentProvider";
import CookieBanner from "@/components/consent/CookieBanner";
import Analytics from "@/components/consent/Analytics";
import Schema from "@/components/Schema";
import { site } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default:
      "Nicolla Contractors Ltd | Premium Builders & Renovation in Hertfordshire",
    template: "%s | Nicolla Contractors Ltd",
  },
  description: site.description,
  keywords: [
    "builders near me",
    "bathroom renovation UK",
    "flooring contractors",
    "kitchen renovation specialists",
    "laminate flooring installation",
    "tiling contractors",
    "home refurbishment company",
    "builders Hertfordshire",
    "renovation Kings Langley",
    "builders Watford",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: site.url,
    siteName: site.name,
    title: "Nicolla Contractors Ltd | Premium Builders & Renovation",
    description: site.description,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Nicolla Contractors Ltd — premium building & renovation in Hertfordshire",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nicolla Contractors Ltd | Premium Builders & Renovation",
    description: site.description,
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "construction",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${sora.variable}`}>
      <body className="relative min-h-screen overflow-x-hidden bg-ink">
        <Schema />

        {/* Ambient background (clipped so the wide blobs never cause
            horizontal scroll on mobile — fixed children aren't clipped by
            body overflow) */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="bg-grid absolute inset-0" />
          <div className="absolute left-1/2 top-[-12rem] h-[32rem] w-[60rem] -translate-x-1/2 rounded-full bg-gold/10 blur-[160px]" />
          <div className="absolute bottom-[-12rem] right-[-8rem] h-[32rem] w-[32rem] rounded-full bg-navy/50 blur-[150px]" />
        </div>

        <ConsentProvider>
          <ScrollProgress />
          <Navbar />
          <main className="pt-28 sm:pt-52">{children}</main>
          <Footer />
          <WhatsAppButton />
          <CookieBanner />
          <Analytics />
        </ConsentProvider>
      </body>
    </html>
  );
}
