import { getServerAuthSession } from "@/auth";
import { NextResponse } from "next/server";
import {
  AppRole,
  findRegisteredUserByEmail,
} from "@/app/lib/auth/registeredUsers";

export interface AuthorizedSession {
  userId: string;
  email: string;
  role: AppRole;
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

  const registeredUser = await findRegisteredUserByEmail(session.user.email);
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
  userRole: AppRole,
  requiredRoles: AppRole[],
): boolean => {
  return requiredRoles.includes(userRole);
};

import { Permission, hasPermission } from "@/app/lib/auth/permissions";

// --- Sistema de Permisos Escalable ---

/**
 * Helper para usar en Server Components o Actions.
 * Lanza un error si el usuario no tiene el permiso.
 */
export const validatePermission = async (permission: Permission) => {
  const auth = await requireAuth();

  if (!auth.success) {
    throw new Error("No autenticado");
  }

  if (!hasPermission(auth.session.role, permission)) {
    throw new Error("No tienes permiso para realizar esta acción");
  }

  return auth.session;
};
