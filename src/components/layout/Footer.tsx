"use client";

import { Container } from "@/components/ui/Container";
import { useLang } from "@/lib/LanguageContext";
import { translations } from "@/lib/translations";

const socialLinks = [
  { label: "Twitter",   href: "#" },
  { label: "Instagram", href: "#" },
  { label: "LinkedIn",  href: "#" },
];

export function Footer() {
  const { lang } = useLang();
  const t        = translations[lang].footer;

  return (
    <footer className="border-t border-white/[0.05] bg-void py-10">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="0.65" opacity="0.35" />
              <circle cx="12" cy="12" r="1.4"  fill="white"  opacity="0.35" />
            </svg>
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-ghost">
              {t.copyright}
            </span>
          </div>

          <div className="flex items-center gap-8">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-mono text-[0.6rem] uppercase tracking-widest text-ghost hover:text-silver transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          <span className="font-mono text-[0.6rem] uppercase tracking-widest text-ghost/35">
            {t.rights}
          </span>
        </div>
      </Container>
    </footer>
  );
}
