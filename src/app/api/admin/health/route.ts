import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const count = await prisma.application.count();
    return NextResponse.json({
      status: "ok",
      db: "connected",
      applications: count,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[health] DB error:", err);
    return NextResponse.json(
      { status: "error", db: "failed", error: message },
      { status: 500 }
    );
  }
}
