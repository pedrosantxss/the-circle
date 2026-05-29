import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendConfirmationEmail, sendAdminNotification } from "@/lib/email";
import { z } from "zod";

const schema = z.object({
  fullName:            z.string().min(2).max(100),
  age:                 z.number().int().min(14).max(40),
  city:                z.string().min(2).max(100),
  email:               z.string().email(),
  whatsapp:            z.string().min(8).max(30),
  instagram:           z.string().min(1).max(60),
  focus:               z.string().min(5).max(2000),
  whyJoin:             z.string().min(5).max(2000),
  goal12months:        z.string().min(5).max(2000),
  hasProject:          z.boolean(),
  projectDescription:  z.string().max(2000).optional(),
  desiredConnections:  z.string().min(5).max(2000),
  contribution:        z.string().min(5).max(2000),
  whySelected:         z.string().min(5).max(2000),
  activeParticipation: z.boolean(),
  dreamConversation:   z.string().min(5).max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const application = await prisma.application.create({ data });

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
    console.error("[api] Application submission error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
