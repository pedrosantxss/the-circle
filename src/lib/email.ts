import { Resend } from "resend";

// Lazy init — avoid throwing at build time when env var is absent
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
  goals: string;
  project?: string | null;
}

export async function sendConfirmationEmail(app: ApplicationData) {
  try {
    await getResend().emails.send({
      from: "The Circle <noreply@thecirclejr.com>",
      to: app.email,
      subject: "Candidatura recebida — The Circle",
      html: `
        <div style="font-family:ui-monospace,monospace;max-width:600px;margin:0 auto;background:#050505;color:#e8e8e4;padding:48px 40px;">
          <p style="font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#444;margin:0 0 40px;">The Circle</p>
          <h1 style="font-size:28px;font-style:italic;color:#e8e8e4;margin:0 0 24px;line-height:1.1;font-weight:400;">
            Candidatura recebida.
          </h1>
          <p style="color:#888;line-height:1.8;margin:0 0 12px;font-size:14px;">
            Olá ${app.fullName},
          </p>
          <p style="color:#888;line-height:1.8;margin:0 0 40px;font-size:14px;">
            Recebemos a tua candidatura para The Circle. A nossa equipa irá analisá-la em breve e dar-te resposta nas próximas 48 horas.
          </p>
          <div style="border-top:1px solid #1a1a1a;padding-top:28px;margin-top:28px;">
            <p style="font-size:10px;color:#333;letter-spacing:0.2em;text-transform:uppercase;margin:0;">
              © 2026 The Circle · Todos os direitos reservados
            </p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("[email] Confirmation failed:", err);
  }
}

export async function sendAdminNotification(app: ApplicationData) {
  try {
    await getResend().emails.send({
      from: "The Circle <noreply@thecirclejr.com>",
      to: "contact@thecirclejr.com",
      subject: `Nova candidatura: ${app.fullName} (${app.city})`,
      html: `
        <div style="font-family:ui-monospace,monospace;max-width:600px;margin:0 auto;background:#050505;color:#e8e8e4;padding:48px 40px;">
          <p style="font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#444;margin:0 0 40px;">The Circle — Admin</p>
          <h1 style="font-size:22px;font-style:italic;color:#e8e8e4;margin:0 0 32px;line-height:1.1;font-weight:400;">
            Nova candidatura recebida
          </h1>
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            ${row("Nome", app.fullName)}
            ${row("Email", app.email)}
            ${row("Idade", String(app.age))}
            ${row("Cidade", app.city)}
            ${row("WhatsApp", app.whatsapp)}
            ${row("Instagram", app.instagram)}
            ${app.project ? row("Projeto", app.project) : ""}
          </table>
          <div style="margin-top:24px;padding-top:20px;border-top:1px solid #1a1a1a;">
            <p style="font-size:10px;color:#555;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 12px;">Objetivos</p>
            <p style="color:#999;line-height:1.7;font-size:13px;margin:0;">${app.goals}</p>
          </div>
          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #1a1a1a;">
            <a href="https://the-circle.vercel.app/admin"
               style="font-size:10px;color:#e8e8e4;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;">
              Ver no painel →
            </a>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("[email] Admin notification failed:", err);
  }
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #111;color:#555;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;width:120px;vertical-align:top;">${label}</td>
      <td style="padding:8px 0;border-bottom:1px solid #111;color:#ccc;">${value}</td>
    </tr>
  `;
}
