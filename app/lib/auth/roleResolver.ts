export type AppRole = "student" | "teacher" | "admin";

const parseEmailList = (value: string | undefined): Set<string> => {
  if (!value) {
    return new Set<string>();
  }

  const emails = value
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter((entry) => entry.length > 0);

  return new Set<string>(emails);
};

const adminEmails = parseEmailList(process.env.ADMIN_EMAILS);
const teacherEmails = parseEmailList(process.env.TEACHER_EMAILS);

export const resolveRoleByEmail = (
  email: string | null | undefined,
): AppRole => {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail) {
    return "student";
  }

  if (adminEmails.has(normalizedEmail)) {
    return "admin";
  }

  if (teacherEmails.has(normalizedEmail)) {
    return "teacher";
  }

  return "student";
};
