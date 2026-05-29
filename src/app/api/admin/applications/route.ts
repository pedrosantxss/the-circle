import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Status } from "@/generated/prisma/enums";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") as Status | null;

  const validStatuses = ["NEW", "UNDER_REVIEW", "APPROVED", "REJECTED"] as const;
  const safeStatus = status && (validStatuses as readonly string[]).includes(status)
    ? (status as Status)
    : null;

  const where = {
    ...(safeStatus ? { status: safeStatus } : {}),
    ...(search
      ? {
          OR: [
            { fullName:  { contains: search, mode: "insensitive" as const } },
            { email:     { contains: search, mode: "insensitive" as const } },
            { city:      { contains: search, mode: "insensitive" as const } },
            { instagram: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const applications = await prisma.application.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(applications);
}
