import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = ["/dashboard", "/profile", "/payment/success"];
const ROLE_PREFIX: Record<string, string> = {
  "/dashboard/vendor": "vendor",
  "/dashboard/customer": "customer",
  "/dashboard/admin": "admin",
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!PROTECTED.some((p) => pathname.startsWith(p))) return NextResponse.next();
  // NOTE: JWT lives in localStorage — middleware is a first pass only.
  // Real RBAC is enforced client-side in the dashboard layout + server-side via JWT.
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile", "/payment/:path*"],
};