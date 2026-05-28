"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useLang } from "@/lib/LanguageContext";
import { translations } from "@/lib/translations";

export function AboutSection() {
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });
  const { lang } = useLang();
  const t        = translations[lang].about;

  return (
    <section id="about" className="relative bg-void section-pad overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

      <Container ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-start">

          {/* Left */}
          <div>
            <SectionLabel number="01">{t.label}</SectionLabel>

            <div className="mt-10 overflow-hidden">
              <motion.h2
                initial={{ y: "100%" }}
                animate={isInView ? { y: 0 } : {}}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="font-display italic text-display-lg text-ivory leading-[0.95]"
              >
                {t.h1}
                <br />
                <span className="text-gradient-silver">{t.h2}</span>
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="mt-8 text-body-lg text-mist leading-relaxed max-w-md"
            >
              {t.p1}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
              className="mt-5 text-body-lg text-mist leading-relaxed max-w-md"
            >
              {t.p2}
            </motion.p>
          </div>

          {/* Right — stats */}
          <div className="grid grid-cols-2 gap-px bg-white/[0.06] border border-white/[0.06]">
            {t.stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 + i * 0.1 }}
                className="group flex flex-col justify-end gap-2 p-8 md:p-10 bg-void hover:bg-graphite/40 transition-colors duration-500"
              >
                <span className="font-display italic text-[2.5rem] md:text-[3.5rem] leading-none text-gradient-silver">
                  {stat.value}
                </span>
                <span className="font-mono text-label uppercase tracking-widest text-ghost group-hover:text-mist transition-colors duration-300">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          className="mt-24 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent origin-left"
        />
      </Container>
    </section>
  );
}
