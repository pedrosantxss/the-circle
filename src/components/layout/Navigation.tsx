"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/LanguageContext";
import { translations, type Lang } from "@/lib/translations";

interface NavigationProps {
  visible: boolean;
}

export function Navigation({ visible }: NavigationProps) {
  const navRef   = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang } = useLang();
  const t = { ...translations[lang].nav, status: translations[lang].hero.status };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!navRef.current) return;
    gsap.to(navRef.current, {
      y:       visible ? 0 : -80,
      opacity: visible ? 1 : 0,
      duration: 0.9,
      ease: "power3.out",
    });
  }, [visible]);

  const scrollTo = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });

  return (
    <nav
      ref={navRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] px-6 md:px-14 lg:px-20",
        scrolled
          ? "py-4 border-b border-white/[0.04] bg-black/55 backdrop-blur-2xl"
          : "py-7"
      )}
      style={{ transform: "translateY(-80px)", opacity: 0 }}
    >
      <div className="flex items-center justify-between max-w-[1440px] mx-auto">

        {/* ─── Logo ─── */}
        <a href="#" className="group flex items-center gap-3 no-select">
          <svg viewBox="0 0 24 24" fill="none" className="h-[22px] w-[22px]">
            <circle
              cx="12" cy="12" r="10"
              stroke="white" strokeWidth="0.65"
              className="transition-opacity duration-500 group-hover:opacity-60"
            />
            <circle cx="12" cy="12" r="1.4" fill="white" opacity="0.7" />
          </svg>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55 transition-colors duration-400 group-hover:text-white/80">
            The Circle
          </span>
        </a>

        {/* ─── Nav links ─── */}
        <div className="hidden md:flex items-center gap-9">
          {t.links.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-white/28 transition-colors duration-300 hover:text-white/65"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* ─── Right cluster ─── */}
        <div className="flex items-center gap-5">

          {/* Language switcher */}
          <div className="flex items-center gap-2.5" role="group" aria-label="Language">
            {(["en", "pt"] as Lang[]).map((l, i) => (
              <span key={l} className="flex items-center gap-2.5">
                {i > 0 && (
                  <span className="h-3 w-[0.5px] bg-white/12" aria-hidden />
                )}
                <button
                  onClick={() => setLang(l)}
                  className={cn(
                    "font-mono text-[0.58rem] uppercase tracking-[0.15em] transition-colors duration-300",
                    lang === l
                      ? "text-white/65"
                      : "text-white/20 hover:text-white/45"
                  )}
                  aria-current={lang === l ? "true" : undefined}
                >
                  {l.toUpperCase()}
                </button>
              </span>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => scrollTo("#join")}
            className="hidden sm:flex items-center gap-2 rounded-full border border-white/[0.13] px-5 py-2.5 font-mono text-[0.58rem] uppercase tracking-[0.15em] text-white/45 transition-all duration-400 hover:border-white/28 hover:text-white/72"
          >
            {t.cta}
          </button>
        </div>
      </div>
    </nav>
  );
}
