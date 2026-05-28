"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useLang } from "@/lib/LanguageContext";
import { translations } from "@/lib/translations";

export function CommunitySection() {
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const { lang } = useLang();
  const t        = translations[lang].community;
  const marquee  = [...t.marquee, ...t.marquee];

  return (
    <section id="community" className="relative bg-obsidian section-pad overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Marquee */}
      <div className="relative py-6 mb-16 overflow-hidden border-y border-white/[0.05] bg-void/30">
        <div
          className="flex gap-12 whitespace-nowrap"
          style={{ animation: "marquee 28s linear infinite" }}
        >
          {marquee.map((text, i) => (
            <span key={i} className="font-display italic text-3xl text-white/[0.07] shrink-0">
              {text}
            </span>
          ))}
        </div>
      </div>

      <Container ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-start">

          {/* Left */}
          <div>
            <SectionLabel number="04">{t.label}</SectionLabel>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="mt-6 font-display italic text-display-lg text-ivory leading-[0.95]"
            >
              {t.h1}
              <br />
              {t.h2}
              <br />
              <span className="text-gradient-silver">{t.h3}</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
              className="mt-8 text-body-lg text-mist max-w-sm leading-relaxed"
            >
              {t.sub}
            </motion.p>
          </div>

          {/* Right — pillars */}
          <div className="flex flex-col divide-y divide-white/[0.06]">
            {t.pillars.map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.15 }}
                className="group flex items-start gap-6 py-8 hover:border-white/[0.15] transition-colors duration-500"
              >
                <span className="font-mono text-[0.6rem] text-ghost mt-1 shrink-0 tabular-nums">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="font-display italic text-xl text-ivory mb-2 group-hover:text-chrome transition-colors duration-500">
                    {pillar.title}
                  </h3>
                  <p className="text-body-sm text-mist leading-relaxed">{pillar.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
}
