import { NextResponse } from "next/server";
import { getBlocks } from "@/lib/blockLog";

const REASON_LABELS: Record<string, string> = {
  rate_limit: "Limite de tentativas",
  honeypot:   "Honeypot (bot)",
  bot_ua:     "User-Agent suspeito",
};

export async function GET() {
  const blocks = getBlocks().map((b) => ({
    ...b,
    reasonLabel: REASON_LABELS[b.reason] ?? b.reason,
    blockedAtISO: new Date(b.blockedAt).toISOString(),
  }));

  return NextResponse.json({
    total: blocks.length,
    note: "Log em memória — reinicia com o servidor. Mostra bloqueios da instância atual.",
    blocks,
  });
}
