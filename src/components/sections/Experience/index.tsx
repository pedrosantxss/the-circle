"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useLang } from "@/lib/LanguageContext";
import { translations } from "@/lib/translations";

export function ExperienceSection() {
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const { lang } = useLang();
  const t        = translations[lang].experience;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  return (
    <section id="experience" className="relative bg-void section-pad overflow-hidden">
      <motion.div
        style={{ y }}
        className="pointer-events-none absolute right-[-5%] top-1/2 -translate-y-1/2 select-none"
        aria-hidden
      >
        <span
          className="font-display italic text-[clamp(8rem,20vw,22rem)] leading-none text-white/[0.025]"
          style={{ whiteSpace: "nowrap" }}
        >
          {t.bgWord}
        </span>
      </motion.div>

      <Container ref={ref}>
        <SectionLabel number="03">{t.label}</SectionLabel>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="mt-6 mb-24 font-display italic text-display-lg text-ivory leading-[0.95] max-w-2xl"
        >
          {t.h1}
          <br />
          {t.h2}
          <br />
          <span className="text-gradient-silver">{t.h3}</span>
        </motion.h2>

        <div className="space-y-px">
          {t.moments.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 + i * 0.15 }}
              className="group grid grid-cols-1 md:grid-cols-[200px_1fr_1fr] gap-8 py-10 border-b border-white/[0.06] hover:border-white/[0.15] transition-colors duration-500 items-start"
            >
              <span className="label-tag">{item.label}</span>
              <h3 className="font-display italic text-xl md:text-2xl text-ivory group-hover:text-chrome transition-colors duration-500 leading-snug">
                {item.title}
              </h3>
              <p className="text-body-sm text-mist leading-relaxed md:pl-8">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
