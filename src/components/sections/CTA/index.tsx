"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { useLang } from "@/lib/LanguageContext";
import { translations } from "@/lib/translations";

export function CTASection() {
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const { lang } = useLang();
  const t        = translations[lang].cta;

  return (
    <section id="join" className="relative bg-void section-pad overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(30,30,30,0.5) 0%, transparent 70%)" }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <Container ref={ref}>
        <div className="text-center max-w-4xl mx-auto">

          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-3 mb-12"
          >
            <span className="block h-px w-10 bg-white/20" />
            <span className="label-tag">{t.label}</span>
            <span className="block h-px w-10 bg-white/20" />
          </motion.div>

          {/* Heading */}
          {[t.h1, t.h2, t.h3].map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={isInView ? { y: 0 } : {}}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.12 }}
                className="block font-display italic text-display-xl text-ivory leading-[0.9]"
              >
                {line}
              </motion.span>
            </div>
          ))}

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            className="mt-10 text-body-lg text-mist max-w-xl mx-auto leading-relaxed"
          >
            {t.sub}
          </motion.p>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.75 }}
            onSubmit={(e) => e.preventDefault()}
            className="mt-12 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              placeholder={t.placeholder}
              className="flex-1 bg-graphite/50 border border-white/10 px-5 py-4 text-body-sm text-ivory placeholder-ghost font-mono focus:outline-none focus:border-white/30 transition-colors duration-300"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              {t.button}
            </button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-5 font-mono text-[0.65rem] text-ghost uppercase tracking-widest"
          >
            {t.fine}
          </motion.p>
        </div>
      </Container>

      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full border border-white/[0.03]" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[900px] w-[900px] rounded-full border border-white/[0.02]" aria-hidden />
    </section>
  );
}
