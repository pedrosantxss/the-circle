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

          {/* Right — manifesto */}
          <div className="flex flex-col justify-center gap-10 pt-4 lg:pl-8">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="label-tag self-start"
            >
              {t.tagline}
            </motion.span>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
              className="font-display italic text-[1.9rem] md:text-[2.4rem] text-ivory leading-[1.1]"
            >
              {t.manifesto}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              className="text-body-lg text-mist leading-relaxed max-w-sm"
            >
              {t.manifestoSub}
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
              className="h-px w-full bg-gradient-to-r from-white/20 to-transparent origin-left"
            />
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
