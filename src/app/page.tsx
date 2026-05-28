"use client";

import { useState, useLayoutEffect } from "react";
import { Loader } from "@/components/effects/Loader";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/Hero";
import { AboutSection } from "@/components/sections/About";
import { EcosystemSection } from "@/components/sections/Ecosystem";
import { ExperienceSection } from "@/components/sections/Experience";
import { CommunitySection } from "@/components/sections/Community";
import { CTASection } from "@/components/sections/CTA";
import { useLenis } from "@/hooks/useLenis";

export default function Home() {
  const [ready, setReady] = useState(false);
  useLenis();

  // Lock body scroll while loader is visible
  useLayoutEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleLoaderComplete = () => {
    document.body.style.overflow = "";
    setReady(true);
  };

  return (
    <>
      {!ready && <Loader onComplete={handleLoaderComplete} />}

      <div
        style={{
          opacity: ready ? 1 : 0,
          transition: ready ? "opacity 0.5s ease" : "none",
        }}
      >
        <Navigation visible={ready} />

        <main>
          <HeroSection />
          <AboutSection />
          <EcosystemSection />
          <ExperienceSection />
          <CommunitySection />
          <CTASection />
        </main>

        <Footer />
      </div>
    </>
  );
}
