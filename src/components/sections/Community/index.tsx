"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useLang } from "@/lib/LanguageContext";
import { translations } from "@/lib/translations";

const members = [
  { role: "Founder, Series A",   location: "San Francisco", initials: "AK" },
  { role: "Creative Director",   location: "London",        initials: "ML" },
  { role: "AI Researcher",       location: "Tokyo",         initials: "RN" },
  { role: "Angel Investor",      location: "Dubai",         initials: "SC" },
  { role: "Growth Operator",     location: "Berlin",        initials: "JP" },
  { role: "Startup Studio",      location: "São Paulo",     initials: "EB" },
  { role: "Product Builder",     location: "Singapore",     initials: "TK" },
  { role: "YC Alum",             location: "New York",      initials: "AL" },
];

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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              className="mt-10 flex items-center gap-4"
            >
              <div className="flex -space-x-3">
                {["RN", "AK", "SC", "ML", "JP"].map((initials, i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border border-void bg-graphite flex items-center justify-center text-[0.6rem] font-mono text-silver tracking-wider"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm text-ivory font-mono">{t.count}</p>
                <p className="text-[0.7rem] text-mist font-mono">{t.countSub}</p>
              </div>
            </motion.div>
          </div>

          {/* Member cards */}
          <div className="grid grid-cols-2 gap-3">
            {members.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.06 }}
                className="group glass rounded-sm p-4 hover:bg-white/[0.04] transition-colors duration-500 cursor-default"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-graphite border border-white/10 flex items-center justify-center text-[0.55rem] font-mono text-silver tracking-wider shrink-0">
                    {member.initials}
                  </div>
                  <p className="text-[0.7rem] font-mono text-mist truncate">{member.location}</p>
                </div>
                <p className="text-[0.75rem] text-ivory/80 font-sans leading-snug">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
