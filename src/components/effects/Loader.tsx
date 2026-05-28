"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface LoaderProps {
  onComplete: () => void;
}

const WORD = "THE CIRCLE";

export function Loader({ onComplete }: LoaderProps) {
  const curtainRef   = useRef<HTMLDivElement>(null);
  const lineRef      = useRef<HTMLDivElement>(null);
  const charsRef     = useRef<(HTMLSpanElement | null)[]>([]);
  const yearRef      = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const curtain = curtainRef.current;
    const line    = lineRef.current;
    const year    = yearRef.current;
    if (!curtain || !line || !year) return;

    const chars = charsRef.current.filter(Boolean) as HTMLSpanElement[];

    // Initial state
    gsap.set(line,  { scaleX: 0, transformOrigin: "center center" });
    gsap.set(chars, { y: 22, opacity: 0 });
    gsap.set(year,  { opacity: 0 });

    const tl = gsap.timeline();

    // 1. Line materialises from center
    tl.to(line, {
      scaleX: 1,
      duration: 0.65,
      ease: "power3.out",
      delay: 0.1,
    });

    // 2. Characters reveal from below — staggered clip
    tl.to(chars, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: "power3.out",
      stagger: 0.038,
    }, "-=0.25");

    // 3. Year tag fades in
    tl.to(year, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    }, "-=0.2");

    // 4. Hold
    tl.to({}, { duration: 0.85 });

    // 5. Chars exit upward
    tl.to(chars, {
      y: -18,
      opacity: 0,
      duration: 0.38,
      ease: "power2.in",
      stagger: 0.025,
    });

    // 6. Year + line exit
    tl.to([year, line], {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    }, "-=0.25");

    // 7. Curtain wipes upward — full reveal
    tl.to(curtain, {
      yPercent: -100,
      duration: 1.05,
      ease: "power4.inOut",
      onComplete,
    }, "-=0.05");

    return () => { tl.kill(); };
  }, [onComplete]);

  return (
    <div
      ref={curtainRef}
      className="fixed inset-0 z-[9997] flex flex-col items-center justify-center bg-[#000]"
      style={{ willChange: "transform" }}
    >
      {/* Thin ruled line */}
      <div
        ref={lineRef}
        className="mb-7 h-[0.5px] w-14 bg-white/20"
        style={{ transformOrigin: "center" }}
      />

      {/* Brand characters */}
      <div
        className="flex items-center overflow-hidden"
        aria-label={WORD}
        role="heading"
        aria-level={1}
      >
        {WORD.split("").map((char, i) => (
          <span
            key={i}
            ref={(el) => { charsRef.current[i] = el; }}
            className={[
              "inline-block font-mono text-[0.6rem] tracking-[0.55em] text-white/45",
              char === " " ? "w-[0.55em]" : "",
            ].join(" ")}
          >
            {char === " " ? " " : char}
          </span>
        ))}
      </div>

      {/* Year */}
      <span
        ref={yearRef}
        className="mt-5 font-mono text-[0.5rem] tracking-[0.3em] text-white/18 uppercase"
      >
        2025
      </span>
    </div>
  );
}
