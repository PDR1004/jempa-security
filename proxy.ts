import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { hasPermission } from "@/app/lib/auth/permissions";

// 1. IMPORTANTE: La función debe llamarse "middleware"
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger ruta /students
  if (pathname.startsWith("/students")) {
    const token = await getToken({
      req: request,
      // Asegúrate de que esta variable esté configurada en el Dashboard de Vercel
      secret: process.env.AUTH_SECRET,
    });

    // Si no hay sesión, redirigir a login
    if (!token?.email) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const role = (token.role as "student" | "teacher" | "admin" | undefined) ?? "student";

    // Validamos permisos
    if (!hasPermission(role, "view:students")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// 2. Configuración optimizada para evitar capturar archivos JS/CSS
export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto:
     * - api/auth (necesario para NextAuth)
     * - _next/static (archivos JS y CSS críticos)
     * - _next/image (imágenes optimizadas)
     * - favicon.ico y archivos con extensión (png, svg, etc.)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};