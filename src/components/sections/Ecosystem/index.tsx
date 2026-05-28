"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useLang } from "@/lib/LanguageContext";
import { translations } from "@/lib/translations";

export function EcosystemSection() {
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const { lang } = useLang();
  const t        = translations[lang].ecosystem;

  return (
    <section id="ecosystem" className="relative bg-obsidian section-pad overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <Container ref={ref}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <SectionLabel number="02">{t.label}</SectionLabel>
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="mt-6 font-display italic text-display-lg text-ivory leading-[0.95] max-w-xl"
            >
              {t.h1}
              <br />
              {t.h2}
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-body-sm text-mist max-w-xs text-right hidden md:block"
          >
            {t.description}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06]">
          {t.pillars.map((pillar, i) => (
            <motion.div
              key={pillar.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.08 }}
              className="group relative flex flex-col justify-between gap-8 p-8 md:p-10 bg-obsidian hover:bg-graphite/30 transition-all duration-700 overflow-hidden cursor-default"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-display italic text-[1.8rem] text-ghost group-hover:text-mist transition-colors duration-500">
                    {pillar.number}
                  </span>
                  <span className="label-tag text-[0.6rem]">{pillar.tag}</span>
                </div>

                <h3 className="font-display italic text-2xl text-ivory mb-4 group-hover:text-chrome transition-colors duration-500">
                  {pillar.title}
                </h3>

                <p className="text-body-sm text-mist leading-relaxed">{pillar.desc}</p>
              </div>

              <div className="h-px w-0 bg-silver/20 group-hover:w-full transition-all duration-700 ease-in-out" />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
