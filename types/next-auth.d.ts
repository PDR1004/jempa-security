import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role: "student" | "teacher" | "admin";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "student" | "teacher" | "admin";
  }
}
