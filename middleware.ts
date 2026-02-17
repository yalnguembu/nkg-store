import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if it's an admin route
  // The pathname might or might not include the locale at this stage
  const isAdminRoute = pathname.includes("/admin");

  if (isAdminRoute) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      // Find the locale from the pathname or use default
      const segments = pathname.split("/");
      const locale = routing.locales.includes(segments[1] as any)
        ? segments[1]
        : routing.defaultLocale;

      const loginUrl = new URL(`/${locale}/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - API routes
  // - _next (Next.js internals)
  // - _vercel (Vercel internals)
  // - Static files (e.g. /favicon.ico, /logo.png)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
