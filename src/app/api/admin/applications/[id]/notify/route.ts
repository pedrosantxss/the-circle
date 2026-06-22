import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendApprovalEmail } from "@/lib/email";
import { sendApprovalWhatsapp } from "@/lib/whatsapp";

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const app    = await prisma.application.findUnique({ where: { id } });

    if (!app) {
      return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    }
    if (app.status !== "APPROVED") {
      return NextResponse.json({ error: "Apenas candidatos aprovados" }, { status: 400 });
    }

    const [emailResult, waResult] = await Promise.all([
      sendApprovalEmail(app),
      sendApprovalWhatsapp(app),
    ]);

    const update: {
      approvedEmailSentAt?: Date;
      approvedWhatsappSentAt?: Date;
      approvalNotificationError: string | null;
    } = { approvalNotificationError: null };

    if (emailResult.success) update.approvedEmailSentAt = new Date();
    if (waResult.success)    update.approvedWhatsappSentAt = new Date();

    const errors: string[] = [];
    if (!emailResult.success) errors.push(`email: ${emailResult.error}`);
    if (!waResult.success && !waResult.skipped) errors.push(`whatsapp: ${waResult.error}`);
    if (errors.length > 0) update.approvalNotificationError = errors.join("; ");

    const updated = await prisma.application.update({ where: { id }, data: update });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Erro ao reenviar notificações" }, { status: 500 });
  }
}
