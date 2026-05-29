import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "missing");
}

interface ApplicationData {
  id: string;
  fullName: string;
  email: string;
  age: number;
  city: string;
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
}

// ─── Confirmation to applicant ────────────────────────────────────────────────
export async function sendConfirmationEmail(app: ApplicationData) {
  try {
    await getResend().emails.send({
      from:    "The Circle <noreply@thecirclejr.com>",
      to:      app.email,
      subject: "Aplicação recebida — The Circle",
      html: `
        <div style="font-family:ui-monospace,monospace;max-width:560px;margin:0 auto;background:#050505;color:#e8e8e4;padding:48px 40px;">
          <p style="font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#444;margin:0 0 40px;">
            The Circle
          </p>
          <h1 style="font-size:26px;font-style:italic;color:#e8e8e4;margin:0 0 28px;line-height:1.15;font-weight:400;">
            Aplicação recebida.
          </h1>
          <p style="color:#888;line-height:1.85;font-size:14px;margin:0 0 12px;">
            Olá, <strong style="color:#ccc;">${app.fullName}</strong>.
          </p>
          <p style="color:#888;line-height:1.85;font-size:14px;margin:0 0 36px;">
            Recebemos sua aplicação para The Circle. Cada candidatura é analisada individualmente —
            entraremos em contato em breve com nossa decisão.
          </p>
          <div style="border:1px solid #1a1a1a;padding:20px 24px;margin-bottom:36px;">
            <p style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 6px;">
              Próximos passos
            </p>
            <p style="font-size:13px;color:#888;line-height:1.7;margin:0;">
              Nossa equipe revisará sua candidatura. Você receberá um e-mail com nossa decisão.
            </p>
          </div>
          <div style="border-top:1px solid #111;padding-top:28px;">
            <p style="font-size:11px;color:#555;font-style:italic;margin:0 0 14px;">
              "Você se torna parecido com as pessoas ao seu redor."
            </p>
            <p style="font-size:9px;color:#2a2a2a;letter-spacing:0.2em;text-transform:uppercase;margin:0;">
              © 2026 The Circle · A próxima geração de empreendedores começa aqui.
            </p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("[email] Confirmação falhou:", err);
  }
}

// ─── Notification to admin ────────────────────────────────────────────────────
export async function sendAdminNotification(app: ApplicationData) {
  try {
    await getResend().emails.send({
      from:    "The Circle <noreply@thecirclejr.com>",
      to:      "contato@thecirclejr.com",
      subject: `Nova aplicação: ${app.fullName} · ${app.city}`,
      html: `
        <div style="font-family:ui-monospace,monospace;max-width:640px;margin:0 auto;background:#050505;color:#e8e8e4;padding:48px 40px;">
          <p style="font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#444;margin:0 0 28px;">
            The Circle — Admin
          </p>
          <h1 style="font-size:20px;font-style:italic;color:#e8e8e4;margin:0 0 32px;font-weight:400;">
            Nova candidatura recebida
          </h1>

          <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:32px;">
            ${row("Nome",              app.fullName)}
            ${row("Email",             app.email)}
            ${row("Idade",             String(app.age))}
            ${row("Cidade",            app.city)}
            ${row("WhatsApp",          app.whatsapp)}
            ${row("Instagram",         app.instagram)}
            ${row("Tem projeto?",      app.hasProject ? "Sim" : "Não")}
            ${app.projectDescription ? row("Projeto", app.projectDescription) : ""}
            ${row("Participação ativa?", app.activeParticipation ? "Sim" : "Não")}
          </table>

          ${block("No que está focado agora?",             app.focus)}
          ${block("Por que quer entrar?",                  app.whyJoin)}
          ${block("Objetivo nos próximos 12 meses",        app.goal12months)}
          ${block("Pessoas que deseja conhecer",           app.desiredConnections)}
          ${block("O que pode agregar",                    app.contribution)}
          ${block("Por que deveria ser selecionado?",      app.whySelected)}
          ${block("Conversa de 1h — com quem e por quê?", app.dreamConversation)}

          <div style="margin-top:36px;padding-top:24px;border-top:1px solid #111;">
            <a href="https://thecirclejr.com/admin"
               style="font-size:10px;color:#e8e8e4;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;">
              Ver no painel →
            </a>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("[email] Notificação admin falhou:", err);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #0f0f0f;color:#555;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;width:170px;vertical-align:top;">${label}</td>
      <td style="padding:8px 0;border-bottom:1px solid #0f0f0f;color:#ccc;font-size:13px;">${value}</td>
    </tr>`;
}

function block(label: string, value: string) {
  return `
    <div style="margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid #0f0f0f;">
      <p style="font-size:10px;color:#555;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 8px;">${label}</p>
      <p style="color:#999;line-height:1.75;font-size:13px;margin:0;">${value}</p>
    </div>`;
}
