"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useLang } from "@/lib/LanguageContext";
import { translations, type Lang } from "@/lib/translations";

export function HeroContent() {
  const root         = useRef<HTMLDivElement>(null);
  const textGroup    = useRef<HTMLDivElement>(null);
  const { lang }     = useLang();
  const hasEntered   = useRef(false);

  // ─── displayLang lags behind lang so we can fade-out → swap → fade-in ───
  const [displayLang, setDisplayLang] = useState<Lang>(lang);
  const t = translations[displayLang].hero;

  // ─── Initial entrance — fires once after loader ─────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".hl-tag",        { y: 14, opacity: 0 });
      gsap.set(".hl-line-inner", { yPercent: 108 });
      gsap.set(".hl-rule",       { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".hl-sub",        { y: 16, opacity: 0 });
      gsap.set(".hl-cta-wrap",   { y: 14, opacity: 0 });
      gsap.set(".hl-scroll",     { opacity: 0 });

      const tl = gsap.timeline({
        delay: 0.08,
        onComplete: () => { hasEntered.current = true; },
      });

      tl.to(".hl-tag",        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" })
        .to(".hl-line-inner",  { yPercent: 0, duration: 1.45, ease: "power4.out", stagger: 0.115 }, "-=0.65")
        .to(".hl-rule",        { scaleX: 1, duration: 1.3, ease: "power4.out" }, "-=1.1")
        .to(".hl-sub",         { y: 0, opacity: 1, duration: 1.0, ease: "power3.out" }, "-=0.8")
        .to(".hl-cta-wrap",    { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, "-=0.8")
        .to(".hl-scroll",      { opacity: 1, duration: 0.9, ease: "power2.out" }, "-=0.6");
    }, root);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Language switch — fade-out → swap content → fade-in ────────────────
  useEffect(() => {
    if (!hasEntered.current) return;
    const el = textGroup.current;
    if (!el) return;

    gsap.to(el, {
      opacity: 0,
      y: -6,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => {
        setDisplayLang(lang);
        requestAnimationFrame(() => {
          if (textGroup.current) {
            gsap.fromTo(
              textGroup.current,
              { opacity: 0, y: 6 },
              { opacity: 1, y: 0, duration: 0.42, ease: "power2.out" }
            );
          }
        });
      },
    });
  }, [lang]);

  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div ref={root} className="absolute inset-0 z-10 flex flex-col justify-end pointer-events-none">
      <div className="container-max pb-14 md:pb-20 lg:pb-24 pointer-events-auto">

        {/* ─── Translatable block ──────────────────────────── */}
        <div ref={textGroup}>

          {/* Tag */}
          <div className="hl-tag mb-10 flex items-center gap-3.5">
            <span className="block h-[0.5px] w-5 bg-white/20" />
            <span className="font-mono text-[0.57rem] uppercase tracking-[0.22em] text-white/26">
              {t.tag}
            </span>
          </div>

          {/* Headline */}
          <h1
            className="mb-10 max-w-[880px]"
            aria-label={`${t.line1} ${t.line2} ${t.line3}`}
          >
            {[t.line1, t.line2, t.line3].map((line, i) => (
              <div key={i} className="overflow-hidden leading-none pb-[0.05em]">
                <span
                  className="hl-line-inner block font-display italic font-light text-[clamp(3.6rem,8.2vw,7.8rem)] leading-[0.88] tracking-[-0.025em] text-[#f5f5f5]"
                >
                  {line}
                </span>
              </div>
            ))}
          </h1>

          {/* Rule */}
          <div
            className="hl-rule mb-9 h-[0.5px] bg-white/[0.09] max-w-[540px]"
            style={{ transformOrigin: "left center" }}
          />

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-9 max-w-[840px]">

            {/* Sub */}
            <p className="hl-sub font-sans font-light text-[0.875rem] leading-[1.82] text-white/30 max-w-[300px] tracking-[0.005em]">
              {t.sub}
            </p>

            {/* CTAs */}
            <div className="hl-cta-wrap flex items-center gap-5 shrink-0">

              {/* Primary pill */}
              <button
                onClick={() => scrollTo("#join")}
                className="group relative flex items-center overflow-hidden rounded-full border border-white/[0.14] focus-visible:outline-none"
                aria-label={t.cta1}
              >
                <span
                  className="absolute inset-0 -translate-x-full bg-white/[0.05] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0"
                  aria-hidden
                />
                <span className="relative px-6 py-3.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/60 transition-colors duration-300 group-hover:text-white/90">
                  {t.cta1}
                </span>
                <span className="relative mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/[0.12] text-white/35 transition-all duration-400 group-hover:border-white/28 group-hover:text-white/75 group-hover:translate-x-[2px]">
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
                    <path d="M1 4.5h7M5 1.5l3 3-3 3" stroke="currentColor" strokeWidth="0.85" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>

              {/* Ghost link */}
              <button
                onClick={() => scrollTo("#about")}
                className="group flex items-center gap-2 font-mono text-[0.57rem] uppercase tracking-[0.18em] text-white/20 transition-colors duration-400 hover:text-white/50"
              >
                {t.cta2}
                <span className="block h-[0.5px] w-0 bg-current transition-all duration-500 group-hover:w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Scroll indicator ────────────────────────────── */}
      <div
        className="hl-scroll pointer-events-none fixed bottom-9 right-9 md:bottom-11 md:right-11 flex flex-col items-center gap-3 select-none"
        aria-hidden
      >
        <span
          className="font-mono text-[0.5rem] uppercase tracking-[0.3em] text-white/16"
          style={{ writingMode: "vertical-rl" }}
        >
          {t.scroll}
        </span>
        <div className="relative h-11 w-[0.5px] overflow-hidden bg-white/[0.06]">
          <div
            className="absolute inset-0 bg-white/22"
            style={{ animation: "scrollLineAnim 2.4s ease-in-out infinite" }}
          />
        </div>
      </div>
    </div>
  );
}
