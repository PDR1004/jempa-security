import { AppRole } from "@/app/lib/auth/registeredUsers";

export type Permission =
    | "view:students"
    | "edit:students"
    | "delete:students"
    | "access:admin"
    | "use:ai_chat"
    | "view:academic_data";

export const ROLE_PERMISSIONS: Record<AppRole, Permission[]> = {
    admin: [
        "view:students",
        "edit:students",
        "delete:students",
        "access:admin",
        "use:ai_chat",
        "view:academic_data",
    ],
    teacher: ["view:students", "use:ai_chat", "view:academic_data"],
    student: ["use:ai_chat", "view:academic_data"],
};

/**
 * Verifica si un rol tiene un permiso específico.
 * Esta función es segura para usar tanto en Client como en Server.
 */
export const hasPermission = (
    userRole: AppRole | string | undefined,
    permission: Permission,
): boolean => {
    if (!userRole) return false;
    const permissions = ROLE_PERMISSIONS[userRole as AppRole] || [];
    return permissions.includes(permission);
};
