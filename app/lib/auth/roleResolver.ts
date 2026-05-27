import {
  AppRole,
  findRegisteredUserByEmail,
} from "@/app/lib/auth/registeredUsers";

export const resolveRoleByEmail = async (
  email: string | null | undefined,
): Promise<AppRole> => {
  const registeredUser = await findRegisteredUserByEmail(email);

  if (!registeredUser) {
    return "student";
  }

  return registeredUser.role;
};
