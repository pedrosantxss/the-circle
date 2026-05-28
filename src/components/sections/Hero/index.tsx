"use client";

import { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { useMousePosition } from "@/hooks/useMousePosition";
import { HeroContent } from "./HeroContent";

const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((m) => m.HeroScene),
  { ssr: false }
);

export function HeroSection() {
  const mouse  = useMousePosition();
  const glowRef = useRef<HTMLDivElement>(null);

  // Ambient radial glow follows cursor — very slow, imperceptible drift
  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth)  * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      gsap.to(glow, {
        background: `radial-gradient(ellipse 60% 55% at ${x}% ${y}%, rgba(26,26,32,0.55) 0%, transparent 70%)`,
        duration: 3,
        ease: "power1.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-void"
      style={{ height: "100dvh" }}
    >
      {/* Layer 0: mouse-aware ambient glow */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 60% 55% at 58% 42%, rgba(26,26,32,0.55) 0%, transparent 70%)",
        }}
      />

      {/* Layer 1: 3D WebGL canvas */}
      <div className="absolute inset-0 z-[1]">
        <HeroScene mouseX={mouse.normalizedX} mouseY={mouse.normalizedY} />
      </div>

      {/* Layer 2: edge vignette — radial darkening */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(ellipse 130% 130% at 50% 50%, transparent 30%, rgba(0,0,0,0.6) 75%, rgba(0,0,0,0.95) 100%)",
        }}
      />

      {/* Layer 3: bottom fade into next section */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[3]"
        style={{
          height: "280px",
          background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.55) 50%, #000 100%)",
        }}
      />

      {/* Layer 4: left edge darkening */}
      <div
        className="pointer-events-none absolute left-0 top-0 bottom-0 z-[3]"
        style={{
          width: "180px",
          background: "linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 100%)",
        }}
      />

      {/* Layer 5: hero text + CTA */}
      <HeroContent />

      {/* Layer 6: status indicator — top right */}
      <div
        className="pointer-events-none absolute top-0 right-0 z-[20] flex items-center gap-2.5 px-6 md:px-14 lg:px-20"
        style={{ paddingTop: "2.25rem" }}
      >
        {/* Pulsing dot */}
        <span className="relative flex h-[5px] w-[5px]">
          <span
            className="absolute inline-flex h-full w-full rounded-full bg-white/35"
            style={{ animation: "ping-slow 2.8s ease-in-out infinite" }}
          />
          <span className="relative inline-flex h-[5px] w-[5px] rounded-full bg-white/40" />
        </span>
        <span className="font-mono text-[0.52rem] uppercase tracking-[0.2em] text-white/22">
          Applications Open
        </span>
      </div>
    </section>
  );
}
