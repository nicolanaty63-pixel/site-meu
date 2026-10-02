import HomeRoot from "@/components/home-v2/HomeRoot";
import HomeNavbar from "@/components/home-v2/chrome/HomeNavbar";
import HomeFooter from "@/components/home-v2/chrome/HomeFooter";
import HomeCursor from "@/components/home-v2/chrome/HomeCursor";
import RevealObserver from "@/components/home-v2/motion/RevealObserver";
import HeroSection from "@/components/home-v2/hero/HeroSection";
import StatsSection from "@/components/home-v2/sections/StatsSection";
import ServicesStack from "@/components/home-v2/sections/ServicesStack";
import ProjectsGallery from "@/components/home-v2/sections/ProjectsGallery";
import BeforeAfter from "@/components/home-v2/sections/BeforeAfter";
import ProcessThread from "@/components/home-v2/sections/ProcessThread";
import TestimonialLetter from "@/components/home-v2/sections/TestimonialLetter";
import FaqFolder from "@/components/home-v2/sections/FaqFolder";
import ContactSection from "@/components/home-v2/sections/ContactSection";

// Home (`/`) renders its own chrome (see components/SiteChrome).
export default function HomePage() {
  return (
    <HomeRoot>
      <HomeCursor />
      <RevealObserver />
      <HomeNavbar />
      <main id="main">
        <HeroSection />
        <StatsSection />
        <ServicesStack />
        <ProjectsGallery />
        <BeforeAfter />
        <ProcessThread />
        <TestimonialLetter />
        <FaqFolder />
        <ContactSection />
      </main>
      <HomeFooter />
    </HomeRoot>
  );
}
