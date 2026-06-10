import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const urlDebug = process.env.DATABASE_URL
    ? `${process.env.DATABASE_URL.substring(0, 35)}...`
    : "NOT SET";

  try {
    const count = await prisma.application.count();
    return NextResponse.json({
      status: "ok",
      db: "connected",
      applications: count,
      urlPrefix: urlDebug,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { status: "error", db: "failed", error: message, urlPrefix: urlDebug },
      { status: 500 }
    );
  }
}
