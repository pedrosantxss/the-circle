"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirect     = searchParams.get("redirect") ?? "/admin";

  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push(redirect);
      } else {
        setError("Senha incorreta. Tente novamente.");
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
      <div className="w-full max-w-[340px]">

        {/* Logo */}
        <div className="text-center mb-14">
          <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 mx-auto mb-5 opacity-40">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="0.65" />
            <circle cx="12" cy="12" r="1.4" fill="white" />
          </svg>
          <p style={{ fontFamily: "ui-monospace,monospace" }}
            className="text-[10px] uppercase tracking-[0.3em] text-white/30">
            The Circle
          </p>
          <p style={{ fontFamily: "ui-monospace,monospace" }}
            className="text-[9px] uppercase tracking-[0.2em] text-white/15 mt-1">
            Painel Administrativo
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ fontFamily: "ui-monospace,monospace" }}
            className="w-full bg-white/[0.03] border border-white/[0.08] px-5 py-4 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors"
          />

          {error && (
            <p style={{ fontFamily: "ui-monospace,monospace" }}
              className="text-[11px] text-red-400/70 tracking-wide">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ fontFamily: "ui-monospace,monospace" }}
            className="w-full border border-white/15 py-4 text-[10px] uppercase tracking-[0.25em] text-white/50 hover:border-white/30 hover:text-white/80 transition-all duration-300 disabled:opacity-30"
          >
            {loading ? "· · ·" : "Entrar"}
          </button>
        </form>

        <p style={{ fontFamily: "ui-monospace,monospace" }}
          className="text-center text-[9px] text-white/10 uppercase tracking-widest mt-10">
          Acesso restrito
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
