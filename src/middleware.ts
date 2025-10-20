import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export default async function middleware(req: Request & { nextUrl: URL; url: string }) {
  const url = (req as any).nextUrl as URL;
  const pathname = url.pathname;

  // Read JWT in edge-safe way; requires NEXTAUTH_SECRET set
  const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET });
  const isLoggedIn = !!token;
  const userRole = (token as any)?.role as string | undefined;

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", (req as any).url));
    }
    if (userRole !== "ADMIN" && userRole !== "STAFF") {
      return NextResponse.redirect(new URL("/", (req as any).url));
    }
  }

  if (pathname.startsWith("/bookings") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", (req as any).url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
