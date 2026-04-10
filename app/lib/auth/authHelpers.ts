import { getServerAuthSession } from "@/auth";
import { NextResponse } from "next/server";
import { findRegisteredUserByEmail } from "@/app/lib/auth/registeredUsers";

export interface AuthorizedSession {
  userId: string;
  email: string;
  role: "student" | "teacher" | "admin";
}

export const requireAuth = async (): Promise<
  | { success: true; session: AuthorizedSession }
  | { success: false; response: NextResponse }
> => {
  const session = await getServerAuthSession();

  if (!session?.user?.email) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "No autorizado. Inicia sesión para continuar." },
        { status: 401 },
      ),
    };
  }

  const registeredUser = findRegisteredUserByEmail(session.user.email);
  if (!registeredUser?.active) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Usuario no registrado o inactivo." },
        { status: 403 },
      ),
    };
  }

  const role = registeredUser.role;

  return {
    success: true,
    session: {
      userId: session.user.email,
      email: session.user.email,
      role,
    },
  };
};

export const requireRole = (
  userRole: string,
  requiredRoles: ("student" | "teacher" | "admin")[],
): boolean => {
  return requiredRoles.includes(userRole as "student" | "teacher" | "admin");
};
