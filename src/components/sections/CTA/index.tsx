"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { useLang } from "@/lib/LanguageContext";
import { translations } from "@/lib/translations";

type FormData = {
  fullName:  string;
  age:       string;
  city:      string;
  email:     string;
  whatsapp:  string;
  instagram: string;
  goals:     string;
  project:   string;
};

const EMPTY: FormData = {
  fullName: "", age: "", city: "", email: "",
  whatsapp: "", instagram: "", goals: "", project: "",
};

const inputClass =
  "w-full bg-graphite/50 border border-white/10 px-5 py-4 text-body-sm text-ivory placeholder-ghost font-mono focus:outline-none focus:border-white/30 transition-colors duration-300";

export function CTASection() {
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const { lang } = useLang();
  const t        = translations[lang].cta;
  const f        = t.form;

  const [form, setForm]       = useState<FormData>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  function field(key: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          age: parseInt(form.age, 10),
          instagram: form.instagram.startsWith("@")
            ? form.instagram
            : `@${form.instagram}`,
          project: form.project || undefined,
        }),
      });

      if (res.status === 201) {
        setSuccess(true);
        setForm(EMPTY);
      } else if (res.status === 409) {
        setError(f.errorDuplicate);
      } else {
        setError(f.errorGeneric);
      }
    } catch {
      setError(f.errorGeneric);
    } finally {
      setLoading(false);
    }
  }

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

          {/* Form / Success */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.75 }}
            className="mt-12 max-w-xl mx-auto text-left"
          >
            {success ? (
              <div className="text-center py-16 border border-white/[0.08] px-8">
                <p className="font-display italic text-2xl text-ivory mb-3">{f.success}</p>
                <p className="text-body-sm text-mist">{f.successSub}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Name + Age */}
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px] gap-4">
                  <input
                    type="text"
                    required
                    placeholder={f.fullName}
                    value={form.fullName}
                    onChange={field("fullName")}
                    className={inputClass}
                  />
                  <input
                    type="number"
                    required
                    min={16}
                    max={35}
                    placeholder={f.age}
                    value={form.age}
                    onChange={field("age")}
                    className={inputClass}
                  />
                </div>

                {/* City */}
                <input
                  type="text"
                  required
                  placeholder={f.city}
                  value={form.city}
                  onChange={field("city")}
                  className={inputClass}
                />

                {/* Email */}
                <input
                  type="email"
                  required
                  placeholder={f.email}
                  value={form.email}
                  onChange={field("email")}
                  className={inputClass}
                />

                {/* WhatsApp + Instagram */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="tel"
                    required
                    placeholder={f.whatsapp}
                    value={form.whatsapp}
                    onChange={field("whatsapp")}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    required
                    placeholder={f.instagram}
                    value={form.instagram}
                    onChange={field("instagram")}
                    className={inputClass}
                  />
                </div>

                {/* Goals */}
                <textarea
                  required
                  rows={4}
                  placeholder={`${f.goals} — ${f.goalsHint}`}
                  value={form.goals}
                  onChange={field("goals")}
                  className={`${inputClass} resize-none`}
                />

                {/* Project optional */}
                <input
                  type="text"
                  placeholder={`${f.project} — ${f.projectHint}`}
                  value={form.project}
                  onChange={field("project")}
                  className={inputClass}
                />

                {error && (
                  <p className="text-red-400/80 text-[0.7rem] font-mono tracking-wide">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                >
                  {loading ? "·  ·  ·" : t.button}
                </button>
              </form>
            )}
          </motion.div>

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
