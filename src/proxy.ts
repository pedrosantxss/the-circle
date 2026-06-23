import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi  = pathname.startsWith("/api/admin");

  const isPublic =
    pathname === "/admin/login"     ||
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout";

  if ((isAdminPage || isAdminApi) && !isPublic) {
    const session    = req.cookies.get("admin_session")?.value;
    const validToken = process.env.ADMIN_TOKEN;

    if (!validToken || session !== validToken) {
      if (isAdminApi) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
      }
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
