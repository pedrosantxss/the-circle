import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Status } from "@/generated/prisma/enums";

const VALID: Status[] = ["NEW", "UNDER_REVIEW", "APPROVED", "REJECTED"];

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { status } = await req.json();

    if (!VALID.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const application = await prisma.application.update({
      where: { id },
      data: { status: status as Status },
    });

    return NextResponse.json(application);
  } catch {
    return NextResponse.json({ error: "Not found or update failed" }, { status: 404 });
  }
}
