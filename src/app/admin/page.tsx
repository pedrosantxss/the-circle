"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
type Status = "NEW" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";

interface Application {
  id: string;
  fullName: string;
  age: number;
  city: string;
  email: string;
  whatsapp: string;
  instagram: string;
  focus: string;
  whyJoin: string;
  goal12months: string;
  hasProject: boolean;
  projectDescription?: string | null;
  desiredConnections: string;
  contribution: string;
  whySelected: string;
  activeParticipation: boolean;
  dreamConversation: string;
  adminNotes?: string | null;
  status: Status;
  approvedEmailSentAt?: string | null;
  approvedWhatsappSentAt?: string | null;
  approvalNotificationError?: string | null;
  createdAt: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────
const STATUS_LABELS: Record<Status, string> = {
  NEW:          "Pendente",
  UNDER_REVIEW: "Em análise",
  APPROVED:     "Aprovado",
  REJECTED:     "Rejeitado",
};

const STATUS_COLORS: Record<Status, string> = {
  NEW:          "text-blue-400   border-blue-400/30   bg-blue-400/10",
  UNDER_REVIEW: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  APPROVED:     "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  REJECTED:     "text-red-400    border-red-400/30    bg-red-400/10",
};

const QUESTIONS: { key: keyof Application; label: string }[] = [
  { key: "focus",              label: "No que está focado agora?"              },
  { key: "whyJoin",            label: "Por que quer entrar?"                   },
  { key: "goal12months",       label: "Objetivo nos próximos 12 meses"         },
  { key: "desiredConnections", label: "Pessoas que deseja conhecer"            },
  { key: "contribution",       label: "O que pode agregar"                     },
  { key: "whySelected",        label: "Por que deveria ser selecionado?"       },
  { key: "dreamConversation",  label: "Conversa de 1h — com quem e por quê?"  },
];

const MONO = { fontFamily: "ui-monospace,monospace" };

// ─── Notes sub-component ──────────────────────────────────────────────────────
function NotesEditor({ app, onSave }: { app: Application; onSave: () => void }) {
  const [notes, setNotes]   = useState(app.adminNotes ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  async function saveNotes() {
    setSaving(true);
    await fetch(`/api/admin/applications/${app.id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ adminNotes: notes }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onSave();
  }

  return (
    <div>
      <p style={MONO} className="text-[9px] uppercase tracking-[0.2em] text-[#444] mb-2">
        Notas do admin
      </p>
      <textarea
        rows={3}
        value={notes}
        onChange={(e) => { setNotes(e.target.value); setSaved(false); }}
        placeholder="Adicionar nota privada sobre este candidato..."
        style={MONO}
        className="w-full bg-white/[0.02] border border-white/[0.06] px-4 py-3 text-[12px] text-[#bbb] placeholder-[#333] focus:outline-none focus:border-white/15 transition-colors resize-none"
      />
      <button
        onClick={saveNotes}
        disabled={saving}
        style={MONO}
        className="mt-2 px-4 py-1.5 text-[9px] uppercase tracking-[0.2em] border border-white/[0.08] text-[#555] hover:border-white/20 hover:text-[#aaa] transition-all disabled:opacity-30"
      >
        {saving ? "..." : saved ? "✓ Salvo" : "Salvar nota"}
      </button>
    </div>
  );
}

// ─── BlockLog types ───────────────────────────────────────────────────────────
interface BlockEntry {
  ip:           string;
  reason:       string;
  reasonLabel:  string;
  userAgent:    string;
  blockedAt:    number;
  blockedAtISO: string;
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter();

  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState<Status | "">("");
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating,  setUpdating]  = useState<string | null>(null);
  const [resending, setResending] = useState<string | null>(null);
  const searchTimeout             = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [blocked, setBlocked]         = useState<BlockEntry[]>([]);
  const [blockedTotal, setBlockedTotal] = useState(0);
  const [showBlocked, setShowBlocked] = useState(false);

  const fetchBlocked = useCallback(async () => {
    try {
      const res  = await fetch("/api/admin/blocked");
      const data = await res.json();
      setBlocked(Array.isArray(data.blocks) ? data.blocks : []);
      setBlockedTotal(data.total ?? 0);
    } catch {/* ignore */}
  }, []);

  const fetchApplications = useCallback(async (s: string, f: string) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (s) params.set("search", s);
    if (f) params.set("status", f);
    const res  = await fetch(`/api/admin/applications?${params.toString()}`);
    const data = await res.json();
    setApplications(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => fetchApplications(search, filter), 300);
    return () => clearTimeout(searchTimeout.current);
  }, [search, filter, fetchApplications]);

  // Load block log on mount
  useEffect(() => { fetchBlocked(); }, [fetchBlocked]);

  async function updateStatus(id: string, status: Status) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
      }
    } finally {
      setUpdating(null);
    }
  }

  async function resendNotifications(id: string) {
    setResending(id);
    try {
      const res = await fetch(`/api/admin/applications/${id}/notify`, { method: "POST" });
      if (res.ok) {
        const updated = await res.json();
        setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
      }
    } finally {
      setResending(null);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const counts = (Object.keys(STATUS_LABELS) as Status[]).map((s) => ({
    s, n: applications.filter((a) => a.status === s).length,
  }));

  return (
    <div className="min-h-screen bg-[#050505] text-[#e8e8e4]" style={MONO}>
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-10 pb-6 border-b border-white/[0.06]">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-[#333] mb-2">The Circle</p>
            <h1 className="text-2xl text-[#e8e8e4]" style={{ fontStyle: "italic", fontWeight: 400 }}>
              Painel Administrativo
            </h1>
          </div>

          <div className="flex items-center gap-8">
            {counts.map(({ s, n }) => (
              <div key={s} className="text-center">
                <p className={`text-xl font-light ${STATUS_COLORS[s].split(" ")[0]}`}>{n}</p>
                <p className="text-[8px] uppercase tracking-wider text-[#333] mt-0.5">
                  {STATUS_LABELS[s]}
                </p>
              </div>
            ))}
            <button
              onClick={logout}
              className="text-[9px] uppercase tracking-[0.2em] text-[#333] hover:text-[#888] transition-colors border border-white/[0.05] px-4 py-2 hover:border-white/10"
            >
              Sair
            </button>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Buscar por nome, e-mail, cidade, instagram..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-white/[0.02] border border-white/[0.07] px-4 py-3 text-[12px] text-[#e8e8e4] placeholder-[#333] focus:outline-none focus:border-white/15 transition-colors"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as Status | "")}
            className="bg-white/[0.02] border border-white/[0.07] px-4 py-3 text-[12px] text-[#e8e8e4] focus:outline-none focus:border-white/15 transition-colors cursor-pointer"
          >
            <option value="" style={{ background: "#050505" }}>Todos os status</option>
            {(Object.entries(STATUS_LABELS) as [Status, string][]).map(([v, l]) => (
              <option key={v} value={v} style={{ background: "#050505" }}>{l}</option>
            ))}
          </select>
        </div>

        {/* ── Table ── */}
        {loading ? (
          <div className="py-24 text-center text-[#2a2a2a] text-[11px] uppercase tracking-widest">
            Carregando...
          </div>
        ) : applications.length === 0 ? (
          <div className="py-24 text-center text-[#2a2a2a] text-[11px] uppercase tracking-widest">
            Nenhuma candidatura encontrada.
          </div>
        ) : (
          <>
            {/* Column headers */}
            <div
              className="hidden md:grid gap-4 px-4 py-3 text-[8px] uppercase tracking-[0.25em] text-[#333] border-b border-white/[0.05]"
              style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto" }}
            >
              <span>Candidato</span>
              <span>Idade · Cidade</span>
              <span>Instagram</span>
              <span>Data</span>
              <span>Status</span>
              <span />
            </div>

            <div className="divide-y divide-white/[0.03]">
              {applications.map((app) => (
                <div key={app.id}>

                  {/* ── Row ── */}
                  <div
                    className="grid gap-4 px-4 py-4 cursor-pointer hover:bg-white/[0.01] transition-colors"
                    style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto" }}
                    onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                  >
                    <div className="min-w-0">
                      <p className="text-[13px] text-[#ddd] truncate">{app.fullName}</p>
                      <p className="text-[10px] text-[#444] mt-0.5 truncate">{app.email}</p>
                    </div>
                    <p className="text-[12px] text-[#777] self-center">{app.age} · {app.city}</p>
                    <p className="text-[12px] text-[#777] self-center truncate">{app.instagram}</p>
                    <p className="text-[10px] text-[#444] self-center">
                      {new Date(app.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                    <div className="self-center">
                      <span className={`inline-block px-2 py-1 rounded-sm border text-[8px] uppercase tracking-wider ${STATUS_COLORS[app.status]}`}>
                        {STATUS_LABELS[app.status]}
                      </span>
                    </div>
                    <span className="text-[#2a2a2a] text-xs self-center select-none">
                      {expanded === app.id ? "▲" : "▼"}
                    </span>
                  </div>

                  {/* ── Expanded detail ── */}
                  {expanded === app.id && (
                    <div className="px-4 pb-8 pt-5 border-t border-white/[0.04] bg-white/[0.008]">

                      {/* Contact info */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6 pb-6 border-b border-white/[0.04]">
                        {[
                          ["WhatsApp",      app.whatsapp],
                          ["Instagram",     app.instagram],
                          ["Tem projeto?",  app.hasProject ? "Sim" : "Não"],
                          ["Participação",  app.activeParticipation ? "Ativa" : "Não confirmada"],
                        ].map(([l, v]) => (
                          <div key={l}>
                            <p className="text-[8px] uppercase tracking-[0.2em] text-[#333] mb-1.5">{l}</p>
                            <p className="text-[12px] text-[#888]">{v}</p>
                          </div>
                        ))}
                        {app.projectDescription && (
                          <div className="col-span-2 md:col-span-4">
                            <p className="text-[8px] uppercase tracking-[0.2em] text-[#333] mb-1.5">Projeto</p>
                            <p className="text-[12px] text-[#888]">{app.projectDescription}</p>
                          </div>
                        )}
                      </div>

                      {/* Questions */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-white/[0.04]">
                        {QUESTIONS.map(({ key, label }) => {
                          const val = app[key];
                          if (!val || typeof val !== "string") return null;
                          return (
                            <div key={key}>
                              <p className="text-[8px] uppercase tracking-[0.2em] text-[#333] mb-1.5">{label}</p>
                              <p className="text-[12px] text-[#777] leading-relaxed">{val}</p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Status actions */}
                      <div className="mb-6 pb-6 border-b border-white/[0.04]">
                        <p className="text-[8px] uppercase tracking-[0.2em] text-[#333] mb-3">
                          Atualizar status
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(Object.keys(STATUS_LABELS) as Status[]).map((s) => (
                            <button
                              key={s}
                              disabled={app.status === s || updating === app.id}
                              onClick={(e) => { e.stopPropagation(); updateStatus(app.id, s); }}
                              className={`px-3 py-1.5 text-[8px] uppercase tracking-wider border transition-all ${
                                app.status === s
                                  ? `${STATUS_COLORS[s]} cursor-default`
                                  : "border-white/[0.07] text-[#444] hover:border-white/20 hover:text-[#aaa] cursor-pointer"
                              } disabled:opacity-30`}
                            >
                              {updating === app.id ? "..." : STATUS_LABELS[s]}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Approval notifications */}
                      {app.status === "APPROVED" && (
                        <div className="mb-6 pb-6 border-b border-white/[0.04]">
                          <p className="text-[8px] uppercase tracking-[0.2em] text-[#333] mb-3">
                            Notificações de aprovação
                          </p>
                          <div className="flex flex-wrap gap-8 items-start mb-3">
                            <div>
                              <p className="text-[7px] uppercase tracking-[0.15em] text-[#2a2a2a] mb-1.5">E-mail</p>
                              <p className={`text-[11px] font-mono ${app.approvedEmailSentAt ? "text-emerald-400/60" : "text-red-400/40"}`}>
                                {app.approvedEmailSentAt
                                  ? `✓ ${new Date(app.approvedEmailSentAt).toLocaleString("pt-BR")}`
                                  : "✗ Não enviado"}
                              </p>
                            </div>
                            <div>
                              <p className="text-[7px] uppercase tracking-[0.15em] text-[#2a2a2a] mb-1.5">WhatsApp</p>
                              <p className={`text-[11px] font-mono ${app.approvedWhatsappSentAt ? "text-emerald-400/60" : "text-[#2a2a2a]"}`}>
                                {app.approvedWhatsappSentAt
                                  ? `✓ ${new Date(app.approvedWhatsappSentAt).toLocaleString("pt-BR")}`
                                  : "— não configurado"}
                              </p>
                            </div>
                          </div>
                          {app.approvalNotificationError && (
                            <p className="text-[9px] font-mono text-red-400/50 mb-3 break-all">
                              Erro: {app.approvalNotificationError}
                            </p>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); resendNotifications(app.id); }}
                            disabled={resending === app.id}
                            style={MONO}
                            className="px-3 py-1.5 text-[8px] uppercase tracking-wider border border-white/[0.07] text-[#444] hover:border-white/20 hover:text-[#aaa] transition-all cursor-pointer disabled:opacity-30"
                          >
                            {resending === app.id ? "Enviando..." : "Reenviar notificações"}
                          </button>
                        </div>
                      )}

                      {/* Admin notes */}
                      <NotesEditor app={app} onSave={() => fetchApplications(search, filter)} />

                    </div>
                  )}
                </div>
              ))}
            </div>

            <p className="mt-6 text-[8px] uppercase tracking-widest text-[#222] text-right">
              {applications.length} resultado{applications.length !== 1 ? "s" : ""}
            </p>
          </>
        )}
        {/* ── Blocked attempts ── */}
        <div className="mt-16 pt-8 border-t border-white/[0.04]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <p className="text-[9px] uppercase tracking-[0.25em] text-[#444]">
                Tentativas bloqueadas
              </p>
              {blockedTotal > 0 && (
                <span className="px-2 py-0.5 text-[8px] font-mono border border-red-400/20 text-red-400/60 bg-red-400/5">
                  {blockedTotal}
                </span>
              )}
              <p className="text-[8px] text-[#222]">(instância atual · memória)</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchBlocked}
                style={MONO}
                className="text-[8px] uppercase tracking-[0.15em] text-[#333] hover:text-[#777] transition-colors"
              >
                Atualizar
              </button>
              {blockedTotal > 0 && (
                <button
                  onClick={() => setShowBlocked((v) => !v)}
                  style={MONO}
                  className="text-[8px] uppercase tracking-[0.15em] text-[#333] hover:text-[#777] transition-colors"
                >
                  {showBlocked ? "Ocultar" : "Mostrar"}
                </button>
              )}
            </div>
          </div>

          {blockedTotal === 0 && (
            <p className="text-[10px] text-[#1c1c1c] font-mono">Nenhum bloqueio registrado.</p>
          )}

          {showBlocked && blocked.length > 0 && (
            <div className="space-y-0 border border-white/[0.04]">
              {/* Header */}
              <div
                className="hidden md:grid gap-4 px-4 py-2 text-[7px] uppercase tracking-[0.2em] text-[#2a2a2a] border-b border-white/[0.04]"
                style={{ gridTemplateColumns: "120px 160px 1fr 1fr" }}
              >
                <span>Motivo</span>
                <span>IP</span>
                <span>Horário</span>
                <span>User-Agent</span>
              </div>
              {blocked.map((b, i) => {
                const reasonColor =
                  b.reason === "rate_limit" ? "text-yellow-400/60 border-yellow-400/20 bg-yellow-400/5" :
                  b.reason === "honeypot"   ? "text-red-400/60 border-red-400/20 bg-red-400/5" :
                                              "text-orange-400/60 border-orange-400/20 bg-orange-400/5";
                return (
                  <div
                    key={i}
                    className="grid gap-4 px-4 py-2.5 border-b border-white/[0.02] text-[10px]"
                    style={{ gridTemplateColumns: "120px 160px 1fr 1fr" }}
                  >
                    <span className={`inline-flex items-center px-1.5 py-0.5 border text-[7px] uppercase tracking-wider w-fit ${reasonColor}`}>
                      {b.reasonLabel}
                    </span>
                    <span className="text-[#555] font-mono self-center">{b.ip}</span>
                    <span className="text-[#333] font-mono self-center">
                      {new Date(b.blockedAt).toLocaleString("pt-BR")}
                    </span>
                    <span className="text-[#2a2a2a] font-mono self-center truncate" title={b.userAgent}>
                      {b.userAgent.substring(0, 60)}{b.userAgent.length > 60 ? "…" : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
