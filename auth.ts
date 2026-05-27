import { getServerSession, type NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import { resolveRoleByEmail } from "@/app/lib/auth/roleResolver";
import { findRegisteredUserByEmail } from "@/app/lib/auth/registeredUsers";

const requireEnv = (name: "AUTH_GOOGLE_ID" | "AUTH_GOOGLE_SECRET"): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Falta configurar ${name} en .env.local`);
  }

  return value;
};

const googleClientId = requireEnv("AUTH_GOOGLE_ID");
const googleClientSecret = requireEnv("AUTH_GOOGLE_SECRET");

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.trim().toLowerCase();
      if (!email) {
        return false;
      }

      const registeredUser = await findRegisteredUserByEmail(email);

      if (!registeredUser) {
        console.warn(
          `[auth] AccessDenied: no hay fila en public.users para "${email}". ` +
            "Verificá que el correo de Google coincida exactamente y que exista en Supabase.",
        );
        return false;
      }

      if (!registeredUser.active) {
        console.warn(`[auth] AccessDenied: usuario inactivo "${email}"`);
        return false;
      }

      return true;
    },
    async jwt({ token, user }) {
      const email = user?.email ?? token.email;
      const registeredUser = await findRegisteredUserByEmail(email);

      if (!registeredUser?.active) {
        delete token.role;
        return token;
      }

      token.role = await resolveRoleByEmail(email);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role =
          (token.role as "student" | "teacher" | "admin") ?? "student";
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
