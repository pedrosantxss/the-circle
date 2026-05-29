import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminToken    = process.env.ADMIN_TOKEN;

    if (!adminPassword || !adminToken) {
      return NextResponse.json(
        { error: "Servidor não configurado. Defina ADMIN_PASSWORD e ADMIN_TOKEN." },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      // Small delay to mitigate brute force
      await new Promise((r) => setTimeout(r, 500));
      return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set("admin_session", adminToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge:   60 * 60 * 24 * 7, // 7 days
      path:     "/",
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
