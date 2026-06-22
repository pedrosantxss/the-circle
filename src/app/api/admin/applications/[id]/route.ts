import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Status } from "@/generated/prisma/enums";
import { sendApprovalEmail } from "@/lib/email";
import { sendApprovalWhatsapp } from "@/lib/whatsapp";

const VALID: Status[] = ["NEW", "UNDER_REVIEW", "APPROVED", "REJECTED"];

type NotifUpdate = {
  approvedEmailSentAt?: Date;
  approvedWhatsappSentAt?: Date;
  approvalNotificationError: string | null;
};

async function handleApprovalNotifications(app: {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
}) {
  console.log("[approval] handleApprovalNotifications START id=%s email=%s", app.id, app.email);

  const [emailResult, waResult] = await Promise.all([
    sendApprovalEmail(app),
    sendApprovalWhatsapp(app),
  ]);

  console.log("[approval] emailResult=%j waResult=%j", emailResult, waResult);

  const update: NotifUpdate = { approvalNotificationError: null };
  if (emailResult.success) update.approvedEmailSentAt = new Date();
  if (waResult.success)    update.approvedWhatsappSentAt = new Date();

  const errors: string[] = [];
  if (!emailResult.success) errors.push(`email: ${emailResult.error}`);
  if (!waResult.success && !waResult.skipped) errors.push(`whatsapp: ${waResult.error}`);
  if (errors.length > 0) update.approvalNotificationError = errors.join("; ");

  console.log("[approval] DB update=%j", update);

  try {
    const result = await prisma.application.update({ where: { id: app.id }, data: update });
    console.log("[approval] DB save OK approvedEmailSentAt=%s", result.approvedEmailSentAt);
    return result;
  } catch (err) {
    console.error("[approval] Failed to save notification state:", err);
    return null;
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id }  = await context.params;
    const body    = await req.json();
    const data: { status?: Status; adminNotes?: string } = {};

    if (body.status !== undefined) {
      if (!VALID.includes(body.status)) {
        return NextResponse.json({ error: "Status inválido" }, { status: 400 });
      }
      data.status = body.status as Status;
    }

    if (body.adminNotes !== undefined) {
      data.adminNotes = String(body.adminNotes);
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Nenhum campo para atualizar" }, { status: 400 });
    }

    // Read current status before potentially transitioning to APPROVED
    let prevStatus: Status | null = null;
    if (data.status === "APPROVED") {
      const current = await prisma.application.findUnique({
        where: { id },
        select: { status: true },
      });
      prevStatus = (current?.status ?? null) as Status | null;
      console.log("[approval] PATCH id=%s prevStatus=%s newStatus=%s", id, prevStatus, data.status);
    }

    const application = await prisma.application.update({ where: { id }, data });

    // Send notifications only on fresh APPROVED transition (not re-approve)
    if (data.status === "APPROVED" && prevStatus !== "APPROVED") {
      console.log("[approval] Triggering notifications for id=%s", id);
      const notified = await handleApprovalNotifications(application);
      return NextResponse.json(notified ?? application);
    }

    return NextResponse.json(application);
  } catch {
    return NextResponse.json({ error: "Não encontrado ou falha na atualização" }, { status: 404 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.application.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }
}
