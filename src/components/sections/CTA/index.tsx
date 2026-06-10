"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Container } from "@/components/ui/Container";

// ─── Types ────────────────────────────────────────────────────────────────────
type YesNo = "Sim" | "Não" | "";

type FormData = {
  fullName:            string;
  age:                 string;
  city:                string;
  instagram:           string;
  whatsapp:            string;
  email:               string;
  focus:               string;
  whyJoin:             string;
  goal12months:        string;
  hasProject:          YesNo;
  projectDescription:  string;
  desiredConnections:  string;
  contribution:        string;
  whySelected:         string;
  activeParticipation: YesNo;
  dreamConversation:   string;
};

const EMPTY: FormData = {
  fullName: "", age: "", city: "", instagram: "",
  whatsapp: "", email: "", focus: "", whyJoin: "",
  goal12months: "", hasProject: "", projectDescription: "",
  desiredConnections: "", contribution: "", whySelected: "",
  activeParticipation: "", dreamConversation: "",
};

// ─── Shared styles ────────────────────────────────────────────────────────────
const INPUT =
  "w-full bg-white/[0.03] border border-white/[0.08] px-5 py-4 text-[0.82rem] text-ivory placeholder-white/20 font-mono focus:outline-none focus:border-white/25 transition-colors duration-300";
const TEXTAREA =
  "w-full bg-white/[0.03] border border-white/[0.08] px-5 py-4 text-[0.82rem] text-ivory placeholder-white/20 font-mono focus:outline-none focus:border-white/25 transition-colors duration-300 resize-none leading-relaxed";

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 my-10">
      <span className="h-px flex-1 bg-white/[0.06]" />
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-white/20">{label}</span>
      <span className="h-px flex-1 bg-white/[0.06]" />
    </div>
  );
}

function Question({
  number, text, children,
}: { number: string; text: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <span className="font-mono text-[0.58rem] text-white/20 mt-1 shrink-0 tabular-nums">{number}</span>
        <label className="text-[0.82rem] text-white/55 leading-relaxed font-sans">{text}</label>
      </div>
      {children}
    </div>
  );
}

function YesNoToggle({
  value, onChange,
}: { value: YesNo; onChange: (v: YesNo) => void }) {
  return (
    <div className="flex gap-3">
      {(["Sim", "Não"] as const).map((opt) => (
        <button
          type="button"
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-8 py-3 font-mono text-[0.7rem] uppercase tracking-[0.2em] border transition-all duration-300 ${
            value === opt
              ? "border-white/35 text-ivory bg-white/[0.05]"
              : "border-white/[0.08] text-white/30 hover:border-white/20 hover:text-white/55"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function CTASection() {
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const [form, setForm]       = useState<FormData>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  function set(key: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.hasProject || !form.activeParticipation) {
      setError("Por favor, responda todas as perguntas de sim/não.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          _hp:                 "",   // honeypot must be empty
          age:                 parseInt(form.age, 10),
          instagram:           form.instagram.startsWith("@") ? form.instagram : `@${form.instagram}`,
          hasProject:          form.hasProject === "Sim",
          activeParticipation: form.activeParticipation === "Sim",
          projectDescription:  form.projectDescription || undefined,
        }),
      });

      if (res.status === 201) {
        setSuccess(true); setForm(EMPTY);
      } else if (res.status === 409) {
        setError("Este e-mail já realizou uma aplicação.");
      } else if (res.status === 429) {
        setError("Muitas tentativas. Aguarde 15 minutos e tente novamente.");
      } else if (res.status === 400) {
        let detail = "";
        try { const j = await res.json(); detail = JSON.stringify(j.error ?? j); } catch {/* */}
        setError(`Dados inválidos. Verifique os campos. ${detail}`);
      } else {
        let detail = "";
        try { const j = await res.json(); detail = j.error ?? j.code ?? ""; } catch {/* */}
        setError(`Erro ao enviar candidatura. ${detail}`);
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="join" className="relative bg-void section-pad overflow-hidden">
      {/* BG */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(20,20,24,0.7) 0%, transparent 70%)" }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <Container ref={ref}>

        {/* ── Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-16">

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-3 mb-14"
          >
            <span className="h-px w-10 bg-white/15" />
            <span className="label-tag">05 — Candidatura</span>
            <span className="h-px w-10 bg-white/15" />
          </motion.div>

          <div className="overflow-hidden mb-2">
            <motion.p
              initial={{ y: "110%" }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
              className="font-display italic text-display-xl text-ivory leading-[0.88]"
            >
              Aplicação para
            </motion.p>
          </div>
          <div className="overflow-hidden mb-12">
            <motion.p
              initial={{ y: "110%" }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="font-display italic text-display-xl text-gradient-silver leading-[0.88]"
            >
              The Circle
            </motion.p>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            className="text-body-lg text-mist leading-relaxed mb-4 max-w-2xl mx-auto"
          >
            Uma comunidade para jovens ambiciosos que querem construir, aprender e crescer
            ao lado de outras pessoas com mentalidade de execução.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-mono text-[0.65rem] uppercase tracking-widest text-white/25"
          >
            Cada aplicação é analisada individualmente.
          </motion.p>
        </div>

        {/* ── Form ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          {success ? (
            /* ── Success ── */
            <div className="text-center py-20 border border-white/[0.06]">
              <p className="font-display italic text-3xl text-ivory mb-4">Aplicação enviada.</p>
              <p className="text-body-sm text-mist mb-3">
                Recebemos sua candidatura e vamos analisá-la individualmente.
              </p>
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-white/25 mt-8">
                The Circle · A próxima geração de empreendedores começa aqui.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-0">

              {/* Honeypot — hidden from humans, traps bots */}
              <input
                type="text"
                name="_hp"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}
              />

              {/* ── Informações básicas ── */}
              <SectionDivider label="Informações" />

              <div className="space-y-4">
                {/* Name + Age */}
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_90px] gap-4">
                  <input type="text" required placeholder="Nome completo"
                    value={form.fullName} onChange={set("fullName")} className={INPUT} />
                  <input type="number" required min={14} max={40} placeholder="Idade"
                    value={form.age} onChange={set("age")} className={INPUT} />
                </div>

                {/* City + Instagram */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" required placeholder="Cidade"
                    value={form.city} onChange={set("city")} className={INPUT} />
                  <input type="text" required placeholder="Instagram"
                    value={form.instagram} onChange={set("instagram")} className={INPUT} />
                </div>

                {/* WhatsApp + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="tel" required placeholder="WhatsApp"
                    value={form.whatsapp} onChange={set("whatsapp")} className={INPUT} />
                  <input type="email" required placeholder="E-mail"
                    value={form.email} onChange={set("email")} className={INPUT} />
                </div>
              </div>

              {/* ── Perguntas ── */}
              <SectionDivider label="Sobre você" />

              <div className="space-y-8">

                <Question number="01" text="No que você está focado neste momento?">
                  <textarea required rows={3} placeholder="Compartilhe o que está ocupando mais sua energia e atenção..."
                    value={form.focus} onChange={set("focus")} className={TEXTAREA} />
                </Question>

                <Question number="02" text="Por que deseja entrar para a THE CIRCLE?">
                  <textarea required rows={3} placeholder="O que te trouxe até aqui e o que espera encontrar..."
                    value={form.whyJoin} onChange={set("whyJoin")} className={TEXTAREA} />
                </Question>

                <Question number="03" text="Qual é seu principal objetivo para os próximos 12 meses?">
                  <textarea required rows={3} placeholder="Seja específico. Onde quer estar daqui a um ano?"
                    value={form.goal12months} onChange={set("goal12months")} className={TEXTAREA} />
                </Question>

                <Question number="04" text="Você possui algum projeto, startup, negócio ou ideia que deseja desenvolver?">
                  <YesNoToggle value={form.hasProject}
                    onChange={(v) => setForm((p) => ({ ...p, hasProject: v }))} />
                </Question>

                {form.hasProject === "Sim" && (
                  <Question number="04a" text="Se sim, qual?">
                    <textarea rows={2} placeholder="Descreva brevemente o que é, em que estágio está..."
                      value={form.projectDescription} onChange={set("projectDescription")} className={TEXTAREA} />
                  </Question>
                )}

                <Question number="05" text="Que tipo de pessoas você deseja conhecer dentro da THE CIRCLE?">
                  <textarea required rows={2} placeholder="Perfis, áreas, mentalidades..."
                    value={form.desiredConnections} onChange={set("desiredConnections")} className={TEXTAREA} />
                </Question>

                <Question number="06" text="O que você acredita que pode agregar para a comunidade?">
                  <textarea required rows={3} placeholder="Conhecimento, experiências, habilidades, perspectivas..."
                    value={form.contribution} onChange={set("contribution")} className={TEXTAREA} />
                </Question>

                <Question number="07" text="Por que você deveria ser selecionado?">
                  <textarea required rows={3} placeholder="Sua resposta mais honesta e direta..."
                    value={form.whySelected} onChange={set("whySelected")} className={TEXTAREA} />
                </Question>

                <Question number="08" text="Você está disposto a participar ativamente da comunidade e contribuir com outros membros?">
                  <YesNoToggle value={form.activeParticipation}
                    onChange={(v) => setForm((p) => ({ ...p, activeParticipation: v }))} />
                </Question>

              </div>

              {/* ── Última pergunta ── */}
              <SectionDivider label="Última pergunta" />

              <Question number="09"
                text="Se pudesse conversar durante uma hora com qualquer empreendedor, fundador ou líder de negócios do mundo, quem seria e por quê?">
                <textarea required rows={4}
                  placeholder="Qualquer pessoa, viva ou não. O que você aprenderia nessa conversa?"
                  value={form.dreamConversation} onChange={set("dreamConversation")}
                  className={TEXTAREA} />
              </Question>

              {/* ── Error + Submit ── */}
              <div className="pt-10 space-y-4">
                {error && (
                  <p className="font-mono text-[0.7rem] text-red-400/70 tracking-wide">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-40 disabled:cursor-not-allowed transition-opacity py-5 text-[0.72rem] tracking-[0.25em]"
                >
                  {loading ? "· · ·" : "Candidatar"}
                </button>
                <p className="font-mono text-[0.6rem] text-white/20 uppercase tracking-widest text-center pt-2">
                  Cada aplicação é analisada individualmente · Sem spam
                </p>
              </div>

              {/* ── Footer quote ── */}
              <div className="pt-16 text-center space-y-3 border-t border-white/[0.05] mt-12">
                <p className="font-display italic text-lg text-white/30 leading-snug">
                  "Você se torna parecido com as pessoas ao seu redor."
                </p>
                <p className="font-mono text-[0.58rem] uppercase tracking-[0.25em] text-white/15">
                  The Circle · A próxima geração de empreendedores começa aqui.
                </p>
              </div>

            </form>
          )}
        </motion.div>

      </Container>

      {/* Decorative rings */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full border border-white/[0.02]" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[1100px] w-[1100px] rounded-full border border-white/[0.015]" aria-hidden />
    </section>
  );
}
