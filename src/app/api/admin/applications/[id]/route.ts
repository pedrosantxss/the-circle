import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Status } from "@/generated/prisma/enums";

const VALID: Status[] = ["NEW", "UNDER_REVIEW", "APPROVED", "REJECTED"];

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

    const application = await prisma.application.update({
      where: { id },
      data,
    });

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
