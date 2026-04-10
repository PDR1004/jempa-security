import {
  AppRole,
  findRegisteredUserByEmail,
} from "@/app/lib/auth/registeredUsers";

export const resolveRoleByEmail = (
  email: string | null | undefined,
): AppRole => {
  const registeredUser = findRegisteredUserByEmail(email);

  if (!registeredUser) {
    return "student";
  }

  return registeredUser.role;
};
