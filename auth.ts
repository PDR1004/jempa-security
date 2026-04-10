import { getServerSession, type NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import { resolveRoleByEmail } from "@/app/lib/auth/roleResolver";

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
    async jwt({ token, user }) {
      const email = user?.email ?? token.email;
      token.role = resolveRoleByEmail(email);
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
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
