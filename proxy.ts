import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/chat")) {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    if (!token?.email) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Proteger ruta /students - solo teacher y admin
  if (pathname.startsWith("/students")) {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    // Si no hay sesión, redirigir a login
    if (!token?.email) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const role =
      (token.role as "student" | "teacher" | "admin" | undefined) ?? "student";

    // Si el usuario es student, redirigir a home
    if (role === "student") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!_next|.*\\..*|api/auth).*)"],
};
