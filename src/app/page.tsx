import HomeRoot from "@/components/home-v2/HomeRoot";
import HomeNavbar from "@/components/home-v2/chrome/HomeNavbar";
import HomeFooter from "@/components/home-v2/chrome/HomeFooter";
import HomeCursor from "@/components/home-v2/chrome/HomeCursor";
import RevealObserver from "@/components/home-v2/motion/RevealObserver";
import LegacyHome from "@/components/home-v2/legacy/LegacyHome";

// Home (`/`) renders its own chrome (see components/SiteChrome). Sections not
// yet rebuilt still render from LegacyHome (temporary, removed in phase 6).
export default function HomePage() {
  return (
    <>
      <HomeRoot>
        <HomeCursor />
        <RevealObserver />
        <HomeNavbar />
      </HomeRoot>
      <main id="main">
        <LegacyHome only={["hero", "badges", "stats", "services", "projects", "beforeAfter", "process", "testimonials", "cta", "faq", "contact"]} />
      </main>
      <HomeRoot>
        <HomeFooter />
      </HomeRoot>
    </>
  );
}
