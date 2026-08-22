import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseSetCookie } from "cookie";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (accessToken) {
    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }

    return NextResponse.next();
  }

  if (refreshToken) {
    try {
      const response = await checkSession();

      const setCookie = response.headers["set-cookie"];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

        for (const cookieStr of cookieArray) {
          const parsed = parseSetCookie(cookieStr);

          if (parsed.name && parsed.value) {
            cookieStore.set(parsed.name, parsed.value, parsed);
          }
        }

        if (isPublicRoute) {
          return NextResponse.redirect(new URL("/profile", request.url));
        }

        if (isPrivateRoute) {
          return NextResponse.next();
        }
      }
    } catch {}
  }

  if (isPrivateRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/sign-in", "/sign-up"],
};
