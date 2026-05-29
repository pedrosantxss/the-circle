import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendConfirmationEmail, sendAdminNotification } from "@/lib/email";
import { z } from "zod";

const schema = z.object({
  fullName:  z.string().min(2).max(100),
  age:       z.number().int().min(16).max(35),
  city:      z.string().min(2).max(100),
  email:     z.string().email(),
  whatsapp:  z.string().min(8).max(30),
  instagram: z.string().min(1).max(60),
  goals:     z.string().min(20).max(2000),
  project:   z.string().max(200).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const application = await prisma.application.create({ data });

    // Fire-and-forget — don't block response on email
    void sendConfirmationEmail(application);
    void sendAdminNotification(application);

    return NextResponse.json({ success: true, id: application.id }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    // Prisma unique constraint violation (duplicate email)
    if ((err as { code?: string })?.code === "P2002") {
      return NextResponse.json({ error: "Email already submitted" }, { status: 409 });
    }
    console.error("[api] Application submission error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
