import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendConfirmationEmail, sendAdminNotification } from "@/lib/email";
import { z } from "zod";

// ─── Rate limiting (in-memory) ────────────────────────────────────────────────
const rateMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT  = 3;          // max submissions per window
const WINDOW_MS   = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip: string): boolean {
  const now   = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
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
  // Honeypot — must be empty/absent; bots fill it
  _hp:                 z.string().max(0).optional(),
});

// ─── Handler ──────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // IP rate limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Muitas tentativas. Aguarde 15 minutos." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    // Honeypot check — bots fill hidden fields
    if (body._hp && body._hp.length > 0) {
      return NextResponse.json({ success: true }, { status: 201 }); // silent reject
    }

    // Basic bot signals
    const ua = req.headers.get("user-agent") ?? "";
    const suspiciousUA = !ua || ua.length < 10 || /bot|crawl|spider|curl|wget|python|axios/i.test(ua);
    if (suspiciousUA) {
      return NextResponse.json({ success: true }, { status: 201 }); // silent reject
    }

    const data = schema.parse(body);
    const { _hp, ...appData } = data; // strip honeypot

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
