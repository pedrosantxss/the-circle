// ─── In-memory block log (shared via globalThis) ──────────────────────────────
// Per-Lambda ephemeral. Shows recent blocks for the current function instance.
// Sufficient for abuse monitoring on a low-traffic application.

export type BlockReason = "rate_limit" | "honeypot" | "bot_ua";

export type BlockEntry = {
  ip:        string;
  reason:    BlockReason;
  userAgent: string;
  blockedAt: number; // epoch ms
};

const g = globalThis as { _blockLog?: BlockEntry[] };
if (!g._blockLog) g._blockLog = [];

const MAX = 500;

export function addBlock(entry: BlockEntry): void {
  if (g._blockLog!.length >= MAX) g._blockLog!.shift();
  g._blockLog!.push(entry);
}

export function getBlocks(): BlockEntry[] {
  return [...(g._blockLog ?? [])].reverse(); // newest first
}

export function clearBlocks(): void {
  g._blockLog = [];
}
