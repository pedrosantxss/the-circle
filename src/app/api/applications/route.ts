import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendConfirmationEmail, sendAdminNotification } from "@/lib/email";
import { addBlock } from "@/lib/blockLog";
import { z } from "zod";

// ─── Rate limit config ────────────────────────────────────────────────────────
const IS_DEV     = process.env.NODE_ENV === "development";
const WINDOW_MS  = IS_DEV ? 30_000 : 15 * 60 * 1000;   // 30s dev, 15min prod
const RATE_LIMIT = IS_DEV ? 20   : 3;                   // 20 dev, 3 prod

// IP whitelist — comma-separated in RATE_LIMIT_WHITELIST env var
const WHITELIST = new Set(
  (process.env.RATE_LIMIT_WHITELIST ?? "")
    .split(",").map((s) => s.trim()).filter(Boolean)
);

// ─── Rate limiting (in-memory, per-Lambda) ────────────────────────────────────
const rateMap = new Map<string, { count: number; reset: number }>();

function checkRateLimit(ip: string): { limited: false } | { limited: true; resetAt: number } {
  if (WHITELIST.has(ip)) return { limited: false };

  const now   = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + WINDOW_MS });
    return { limited: false };
  }
  if (entry.count >= RATE_LIMIT) {
    return { limited: true, resetAt: entry.reset };
  }
  entry.count++;
  return { limited: false };
}

// ─── Schema ───────────────────────────────────────────────────────────────────
const schema = z.object({
  fullName:            z.string().min(2, "Digite seu nome completo.").max(100),
  age:                 z.number().int().min(14, "Idade mínima: 14 anos.").max(40, "Idade máxima: 40 anos."),
  city:                z.string().min(2, "Digite sua cidade.").max(100),
  email:               z.string().email("Digite um e-mail válido."),
  whatsapp:            z.string().min(8, "WhatsApp inválido.").max(30),
  instagram:           z.string().min(1, "Digite seu Instagram.").max(60),
  focus:               z.string().min(5, "Explique seu foco atual com pelo menos 5 caracteres.").max(2000),
  whyJoin:             z.string().min(5, "Explique por que deseja entrar para The Circle.").max(2000),
  goal12months:        z.string().min(5, "Descreva seu objetivo para os próximos 12 meses.").max(2000),
  hasProject:          z.boolean(),
  projectDescription:  z.string().max(2000).optional(),
  desiredConnections:  z.string().min(5, "Descreva o tipo de conexão que procura.").max(2000),
  contribution:        z.string().min(5, "Explique como pode contribuir para a comunidade.").max(2000),
  whySelected:         z.string().min(5, "Explique por que deveria ser selecionado.").max(2000),
  activeParticipation: z.boolean(),
  dreamConversation:   z.string().min(5, "Escreva com quem gostaria de conversar e por quê.").max(2000),
  _hp:                 z.string().max(0).optional(),
});

// ─── Handler ──────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const ua = req.headers.get("user-agent") ?? "";

  // Rate limit
  const rl = checkRateLimit(ip);
  if (rl.limited) {
    addBlock({ ip, reason: "rate_limit", userAgent: ua, blockedAt: Date.now() });
    const secsLeft = Math.ceil((rl.resetAt - Date.now()) / 1000);
    return NextResponse.json(
      { error: "rate_limit", secsLeft, resetAt: rl.resetAt },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    // Honeypot — bots fill hidden fields
    if (body._hp && body._hp.length > 0) {
      addBlock({ ip, reason: "honeypot", userAgent: ua, blockedAt: Date.now() });
      return NextResponse.json({ success: true }, { status: 201 }); // silent
    }

    // Bot UA detection
    const suspiciousUA = !ua || ua.length < 10 || /bot|crawl|spider|curl|wget|python|axios/i.test(ua);
    if (suspiciousUA) {
      addBlock({ ip, reason: "bot_ua", userAgent: ua || "(empty)", blockedAt: Date.now() });
      return NextResponse.json({ success: true }, { status: 201 }); // silent
    }

    const data = schema.parse(body);
    const { _hp, ...appData } = data;

    const application = await prisma.application.create({ data: appData });

    void sendConfirmationEmail(application);
    void sendAdminNotification(application);

    return NextResponse.json({ success: true, id: application.id }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    if ((err as { code?: string })?.code === "P2002") {
      return NextResponse.json({ error: "Email already submitted" }, { status: 409 });
    }
    console.error("[api] Application error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
