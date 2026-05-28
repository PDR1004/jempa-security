import { getServerSession, type NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
// 1. Importamos tu cliente seguro con la Service Key
import { supabaseAdmin } from "@/app/lib/supabase/server"; 

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

      // 2. Usamos el admin para saltar el RLS de forma segura desde el backend
      const { data: dbUser, error } = await supabaseAdmin
        .from("users")
        .select("active")
        .eq("email", email)
        .single();

      if (error || !dbUser) {
        console.warn(
          `[auth] AccessDenied: no hay fila en public.users para "${email}". ` +
            "Verificá que el correo de Google coincida exactamente y que exista en Supabase.",
        );
        return false;
      }

      if (!dbUser.active) {
        console.warn(`[auth] AccessDenied: usuario inactivo "${email}"`);
        return false;
      }

      return true;
    },
    
    async jwt({ token, user }) {
      const email = user?.email ?? token.email;
      if (!email) return token;

      // 3. Traemos el rol y el estado activo directamente con la Service Key
      const { data: dbUser } = await supabaseAdmin
        .from("users")
        .select("role, active")
        .eq("email", email)
        .single();

      if (!dbUser?.active) {
        delete token.role;
        return token;
      }

      token.role = dbUser.role;
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