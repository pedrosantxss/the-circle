"use client";

import { useState, useRef, useEffect } from "react";
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

type FormErrors = Partial<Record<keyof FormData, string>>;

const EMPTY: FormData = {
  fullName: "", age: "", city: "", instagram: "",
  whatsapp: "", email: "", focus: "", whyJoin: "",
  goal12months: "", hasProject: "", projectDescription: "",
  desiredConnections: "", contribution: "", whySelected: "",
  activeParticipation: "", dreamConversation: "",
};

// ─── Validation ───────────────────────────────────────────────────────────────
function validateForm(f: FormData): FormErrors {
  const e: FormErrors = {};
  if (f.fullName.trim().length < 2)
    e.fullName = "Digite seu nome completo.";
  const ageNum = parseInt(f.age, 10);
  if (!f.age || isNaN(ageNum) || ageNum < 14 || ageNum > 40)
    e.age = "Idade deve ser entre 14 e 40 anos.";
  if (f.city.trim().length < 2)
    e.city = "Digite sua cidade.";
  if (!f.instagram.trim())
    e.instagram = "Digite seu Instagram.";
  if (f.whatsapp.replace(/\D/g, "").length < 8)
    e.whatsapp = "Digite um WhatsApp válido (mínimo 8 dígitos).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    e.email = "Digite um e-mail válido.";
  if (f.focus.trim().length < 5)
    e.focus = "Explique seu foco atual com pelo menos 5 caracteres.";
  if (f.whyJoin.trim().length < 5)
    e.whyJoin = "Explique por que deseja entrar para The Circle.";
  if (f.goal12months.trim().length < 5)
    e.goal12months = "Descreva seu objetivo para os próximos 12 meses.";
  if (!f.hasProject)
    e.hasProject = "Selecione uma opção.";
  if (f.desiredConnections.trim().length < 5)
    e.desiredConnections = "Descreva o tipo de conexão que procura.";
  if (f.contribution.trim().length < 5)
    e.contribution = "Explique como pode contribuir para a comunidade.";
  if (f.whySelected.trim().length < 5)
    e.whySelected = "Explique por que deveria ser selecionado.";
  if (!f.activeParticipation)
    e.activeParticipation = "Selecione uma opção.";
  if (f.dreamConversation.trim().length < 5)
    e.dreamConversation = "Escreva com quem gostaria de conversar e por quê.";
  return e;
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const inputCls = (err?: string) =>
  `w-full bg-white/[0.03] border ${
    err ? "border-red-500/40" : "border-white/[0.08]"
  } px-5 py-4 text-[0.82rem] text-ivory placeholder-white/20 font-mono focus:outline-none focus:border-white/25 transition-colors duration-300`;

const textareaCls = (err?: string) =>
  `w-full bg-white/[0.03] border ${
    err ? "border-red-500/40" : "border-white/[0.08]"
  } px-5 py-4 text-[0.82rem] text-ivory placeholder-white/20 font-mono focus:outline-none focus:border-white/25 transition-colors duration-300 resize-none leading-relaxed`;

// ─── Sub-components ───────────────────────────────────────────────────────────
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="text-[0.65rem] text-red-400/75 font-mono mt-1.5 tracking-wide">
      {msg}
    </p>
  );
}

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
  id, number, text, children,
}: { id: string; number: string; text: string; children: React.ReactNode }) {
  return (
    <div id={id} className="space-y-3">
      <div className="flex items-start gap-3">
        <span className="font-mono text-[0.58rem] text-white/20 mt-1 shrink-0 tabular-nums">{number}</span>
        <label className="text-[0.82rem] text-white/55 leading-relaxed font-sans">{text}</label>
      </div>
      {children}
    </div>
  );
}

function YesNoToggle({
  value, onChange, error,
}: { value: YesNo; onChange: (v: YesNo) => void; error?: string }) {
  return (
    <div>
      <div className="flex gap-3">
        {(["Sim", "Não"] as const).map((opt) => (
          <button
            type="button"
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-8 py-3 font-mono text-[0.7rem] uppercase tracking-[0.2em] border transition-all duration-300 ${
              value === opt
                ? "border-white/35 text-ivory bg-white/[0.05]"
                : error
                ? "border-red-500/30 text-white/30 hover:border-white/20 hover:text-white/55"
                : "border-white/[0.08] text-white/30 hover:border-white/20 hover:text-white/55"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <FieldError msg={error} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function CTASection() {
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const [form, setForm]       = useState<FormData>(EMPTY);
  const [errors, setErrors]   = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [retryAt, setRetryAt] = useState<number | null>(null);
  const [secsLeft, setSecsLeft] = useState(0);

  useEffect(() => {
    if (!retryAt) return;
    const tick = () => {
      const s = Math.ceil((retryAt - Date.now()) / 1000);
      if (s <= 0) { setRetryAt(null); setSecsLeft(0); setError(null); return; }
      setSecsLeft(s);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [retryAt]);

  function set(key: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((p) => ({ ...p, [key]: e.target.value }));
      if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Client-side validation
    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0] as keyof FormData;
      const el = document.getElementById(`field-${firstKey}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setErrors({});
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          _hp:                 "",
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
        const j = await res.json().catch(() => ({}));
        if (j.resetAt) setRetryAt(j.resetAt);
        setError("rate_limit");
      } else {
        setError("Algo correu mal. Tente novamente.");
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

              {/* Honeypot */}
              <input
                type="text" name="_hp" tabIndex={-1} autoComplete="off" aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}
              />

              {/* ── Informações básicas ── */}
              <SectionDivider label="Informações" />

              <div className="space-y-4">
                {/* Name + Age */}
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_90px] gap-4">
                  <div id="field-fullName">
                    <input type="text" required placeholder="Nome completo"
                      value={form.fullName} onChange={set("fullName")}
                      className={inputCls(errors.fullName)} />
                    <FieldError msg={errors.fullName} />
                  </div>
                  <div id="field-age">
                    <input type="number" required min={14} max={40} placeholder="Idade"
                      value={form.age} onChange={set("age")}
                      className={inputCls(errors.age)} />
                    <FieldError msg={errors.age} />
                  </div>
                </div>

                {/* City + Instagram */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div id="field-city">
                    <input type="text" required placeholder="Cidade"
                      value={form.city} onChange={set("city")}
                      className={inputCls(errors.city)} />
                    <FieldError msg={errors.city} />
                  </div>
                  <div id="field-instagram">
                    <input type="text" required placeholder="Instagram"
                      value={form.instagram} onChange={set("instagram")}
                      className={inputCls(errors.instagram)} />
                    <FieldError msg={errors.instagram} />
                  </div>
                </div>

                {/* WhatsApp + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div id="field-whatsapp">
                    <input type="tel" required placeholder="WhatsApp"
                      value={form.whatsapp} onChange={set("whatsapp")}
                      className={inputCls(errors.whatsapp)} />
                    <FieldError msg={errors.whatsapp} />
                  </div>
                  <div id="field-email">
                    <input type="email" required placeholder="E-mail"
                      value={form.email} onChange={set("email")}
                      className={inputCls(errors.email)} />
                    <FieldError msg={errors.email} />
                  </div>
                </div>
              </div>

              {/* ── Perguntas ── */}
              <SectionDivider label="Sobre você" />

              <div className="space-y-8">

                <Question id="field-focus" number="01" text="No que você está focado neste momento?">
                  <textarea required rows={3}
                    placeholder="Compartilhe o que está ocupando mais sua energia e atenção..."
                    value={form.focus} onChange={set("focus")}
                    className={textareaCls(errors.focus)} />
                  <FieldError msg={errors.focus} />
                </Question>

                <Question id="field-whyJoin" number="02" text="Por que deseja entrar para a THE CIRCLE?">
                  <textarea required rows={3}
                    placeholder="O que te trouxe até aqui e o que espera encontrar..."
                    value={form.whyJoin} onChange={set("whyJoin")}
                    className={textareaCls(errors.whyJoin)} />
                  <FieldError msg={errors.whyJoin} />
                </Question>

                <Question id="field-goal12months" number="03" text="Qual é seu principal objetivo para os próximos 12 meses?">
                  <textarea required rows={3}
                    placeholder="Seja específico. Onde quer estar daqui a um ano?"
                    value={form.goal12months} onChange={set("goal12months")}
                    className={textareaCls(errors.goal12months)} />
                  <FieldError msg={errors.goal12months} />
                </Question>

                <Question id="field-hasProject" number="04" text="Você possui algum projeto, startup, negócio ou ideia que deseja desenvolver?">
                  <YesNoToggle
                    value={form.hasProject}
                    error={errors.hasProject}
                    onChange={(v) => {
                      setForm((p) => ({ ...p, hasProject: v }));
                      if (errors.hasProject) setErrors((p) => ({ ...p, hasProject: undefined }));
                    }}
                  />
                </Question>

                {form.hasProject === "Sim" && (
                  <Question id="field-projectDescription" number="04a" text="Se sim, qual?">
                    <textarea rows={2}
                      placeholder="Descreva brevemente o que é, em que estágio está..."
                      value={form.projectDescription} onChange={set("projectDescription")}
                      className={textareaCls()} />
                  </Question>
                )}

                <Question id="field-desiredConnections" number="05" text="Que tipo de pessoas você deseja conhecer dentro da THE CIRCLE?">
                  <textarea required rows={2}
                    placeholder="Perfis, áreas, mentalidades..."
                    value={form.desiredConnections} onChange={set("desiredConnections")}
                    className={textareaCls(errors.desiredConnections)} />
                  <FieldError msg={errors.desiredConnections} />
                </Question>

                <Question id="field-contribution" number="06" text="O que você acredita que pode agregar para a comunidade?">
                  <textarea required rows={3}
                    placeholder="Conhecimento, experiências, habilidades, perspectivas..."
                    value={form.contribution} onChange={set("contribution")}
                    className={textareaCls(errors.contribution)} />
                  <FieldError msg={errors.contribution} />
                </Question>

                <Question id="field-whySelected" number="07" text="Por que você deveria ser selecionado?">
                  <textarea required rows={3}
                    placeholder="Sua resposta mais honesta e direta..."
                    value={form.whySelected} onChange={set("whySelected")}
                    className={textareaCls(errors.whySelected)} />
                  <FieldError msg={errors.whySelected} />
                </Question>

                <Question id="field-activeParticipation" number="08" text="Você está disposto a participar ativamente da comunidade e contribuir com outros membros?">
                  <YesNoToggle
                    value={form.activeParticipation}
                    error={errors.activeParticipation}
                    onChange={(v) => {
                      setForm((p) => ({ ...p, activeParticipation: v }));
                      if (errors.activeParticipation) setErrors((p) => ({ ...p, activeParticipation: undefined }));
                    }}
                  />
                </Question>

              </div>

              {/* ── Última pergunta ── */}
              <SectionDivider label="Última pergunta" />

              <Question id="field-dreamConversation" number="09"
                text="Se pudesse conversar durante uma hora com qualquer empreendedor, fundador ou líder de negócios do mundo, quem seria e por quê?">
                <textarea required rows={4}
                  placeholder="Qualquer pessoa, viva ou não. O que você aprenderia nessa conversa?"
                  value={form.dreamConversation} onChange={set("dreamConversation")}
                  className={textareaCls(errors.dreamConversation)} />
                <FieldError msg={errors.dreamConversation} />
              </Question>

              {/* ── Error + Submit ── */}
              <div className="pt-10 space-y-4">
                {error === "rate_limit" ? (
                  <div className="border border-red-500/15 bg-red-500/[0.04] px-5 py-4">
                    <p className="font-mono text-[0.7rem] text-red-400/70 tracking-wide mb-1">
                      Muitas tentativas.
                    </p>
                    {secsLeft > 0 && (
                      <p className="font-mono text-[0.65rem] text-white/30 tracking-wide">
                        {secsLeft >= 60
                          ? `Aguarde ${Math.ceil(secsLeft / 60)} ${Math.ceil(secsLeft / 60) === 1 ? "minuto" : "minutos"} para tentar novamente.`
                          : `Aguarde ${secsLeft} ${secsLeft === 1 ? "segundo" : "segundos"} para tentar novamente.`
                        }
                      </p>
                    )}
                  </div>
                ) : error ? (
                  <p className="font-mono text-[0.7rem] text-red-400/70 tracking-wide">{error}</p>
                ) : null}
                <button
                  type="submit"
                  disabled={loading || (error === "rate_limit" && secsLeft > 0)}
                  className="w-full btn-primary disabled:opacity-40 disabled:cursor-not-allowed transition-opacity py-5 text-[0.72rem] tracking-[0.25em]"
                >
                  {loading ? "· · ·" : error === "rate_limit" && secsLeft > 0 ? `Aguarde ${secsLeft}s` : "Candidatar"}
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
