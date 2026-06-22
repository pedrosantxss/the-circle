const PROVIDER  = process.env.WHATSAPP_PROVIDER;
const API_TOKEN = process.env.WHATSAPP_API_TOKEN;
const PHONE_ID  = process.env.WHATSAPP_PHONE_NUMBER_ID;

interface WAResult {
  success: boolean;
  skipped?: boolean;
  error?: string;
}

export async function sendApprovalWhatsapp(
  app: { fullName: string; whatsapp: string }
): Promise<WAResult> {
  if (!PROVIDER || !API_TOKEN || !PHONE_ID) {
    console.log("[whatsapp] Approval message skipped: provider not configured");
    return { success: false, skipped: true, error: "provider_not_configured" };
  }

  const firstName = app.fullName.split(" ")[0];
  const message = [
    `Fala, ${firstName}. Aqui é o time The Circle.`,
    "",
    "Sua candidatura foi aprovada.",
    "",
    "Você agora faz parte da comunidade de jovens empreendedores que querem construir, aprender e crescer com pessoas ambiciosas.",
    "",
    "Em breve vamos te enviar os próximos passos por aqui.",
    "",
    "Bem-vindo ao The Circle.",
  ].join("\n");

  const phone = app.whatsapp.replace(/\D/g, "");
  const e164  = phone.startsWith("55") ? phone : `55${phone}`;

  try {
    if (PROVIDER === "whatsapp_cloud") {
      const res = await fetch(
        `https://graph.facebook.com/v19.0/${PHONE_ID}/messages`,
        {
          method:  "POST",
          headers: { Authorization: `Bearer ${API_TOKEN}`, "Content-Type": "application/json" },
          body:    JSON.stringify({
            messaging_product: "whatsapp",
            to:   e164,
            type: "text",
            text: { body: message },
          }),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      return { success: true };
    }

    if (PROVIDER === "z-api") {
      const res = await fetch(
        `https://api.z-api.io/instances/${PHONE_ID}/token/${API_TOKEN}/send-text`,
        {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ phone: e164, message }),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      return { success: true };
    }

    if (PROVIDER === "twilio") {
      const res = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${PHONE_ID}/Messages.json`,
        {
          method:  "POST",
          headers: {
            Authorization: `Basic ${API_TOKEN}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            From: `whatsapp:+${PHONE_ID}`,
            To:   `whatsapp:+${e164}`,
            Body: message,
          }),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      return { success: true };
    }

    console.log(`[whatsapp] Unknown provider: "${PROVIDER}"`);
    return { success: false, error: `unknown_provider:${PROVIDER}` };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[whatsapp] Send failed:", msg);
    return { success: false, error: msg };
  }
}
