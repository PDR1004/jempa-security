export type AppRole = "student" | "teacher" | "admin";

export interface RegisteredUser {
  id: number;
  name: string;
  email: string;
  role: AppRole;
  active: boolean;
}

const REGISTERED_USERS: RegisteredUser[] = [
  {
    id: 1,
    name: "Pablo Racigh",
    email: "pablodanielracigh@gmail.com",
    role: "student",
    active: true,
  },
  {
    id: 2,
    name: "Mateo Nunez",
    email: "mateenunez@gmail.com",
    role: "student",
    active: true,
  },
  {
    id: 3,
    name: "Aaron Tournoud",
    email: "carlos.lopez@example.com",
    role: "student",
    active: true,
  },
  {
    id: 4,
    name: "Ezequiel Martino",
    email: "ana.martinez@example.com",
    role: "student",
    active: true,
  },
  {
    id: 5,
    name: "Luis Fernandez",
    email: "luis.fernandez@example.com",
    role: "teacher",
    active: true,
  },
  {
    id: 6,
    name: "Juan Cruz",
    email: "juanmartincruzrap@gmail.com",
    role: "student",
    active: true,
  },
  {
    id: 7,
    name: "Diego Torres",
    email: "pepito123utn@gmail.com",
    role: "admin",
    active: true,
  },
  {
    id: 8,
    name: "Valentina Ruiz",
    email: "valentina.ruiz@example.com",
    role: "teacher",
    active: true,
  },
  {
    id: 9,
    name: "Pedro Sanchez",
    email: "pedro.sanchez@example.com",
    role: "teacher",
    active: true,
  },
  {
    id: 10,
    name: "Lucia Herrera",
    email: "lucia.herrera@example.com",
    role: "student",
    active: true,
  },
  {
    id: 11,
    name: "Miguel Castro",
    email: "miguel.castro@example.com",
    role: "student",
    active: true,
  },
  {
    id: 12,
    name: "Camila Ortiz",
    email: "camila.ortiz@example.com",
    role: "student",
    active: true,
  },
  {
    id: 13,
    name: "Jorge Diaz",
    email: "jorge.diaz@example.com",
    role: "student",
    active: true,
  },
  {
    id: 14,
    name: "Paula Morales",
    email: "paula.morales@example.com",
    role: "student",
    active: true,
  },
  {
    id: 15,
    name: "Andres Vega",
    email: "andres.vega@example.com",
    role: "student",
    active: true,
  },
];

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export const getRegisteredUsers = (): RegisteredUser[] => REGISTERED_USERS;

export const findRegisteredUserByEmail = (
  email: string | null | undefined,
): RegisteredUser | undefined => {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail) {
    return undefined;
  }

  return REGISTERED_USERS.find(
    (user) => normalizeEmail(user.email) === normalizedEmail,
  );
};
