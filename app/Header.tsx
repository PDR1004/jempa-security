"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
          : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      }`}
    >
      {children}
    </Link>
  );
};

export function Header() {
  const { data: session, status } = useSession();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // PLAN B: Forzar el "despertar" de la página si el usuario vuelve de Google
  useEffect(() => {
    const handleWakeUp = () => {
      // Si el usuario vuelve a hacer foco en la pestaña, reactivamos los botones
      setIsRedirecting(false);
    };

    window.addEventListener("focus", handleWakeUp);
    document.addEventListener("visibilitychange", handleWakeUp);
    
    return () => {
      window.removeEventListener("focus", handleWakeUp);
      document.removeEventListener("visibilitychange", handleWakeUp);
    };
  }, []);

  const handleLoginClick = () => {
    setIsRedirecting(true); // Deshabilita el botón temporalmente para evitar doble clic
    signIn("google", { callbackUrl: "/chat" });
  };

  return (
    <header className={`${manrope.className} flex items-center justify-between px-4 sm:px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md shrink-0 z-20 w-full`}>
      <div className="flex items-center gap-4">
        <h1
          translate="no"
          className="notranslate text-sm font-semibold tracking-wide text-zinc-800 dark:text-zinc-200 uppercase"
        >
          Secure Campus IA
        </h1>
        <nav className="flex items-center gap-2">
          <NavLink href="/chat">Chat</NavLink>
            {status === "authenticated" && (session?.user?.role === "teacher" || session?.user?.role === "admin") && (
              <NavLink href="/students">Estudiantes</NavLink>
            )}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {status === "authenticated" && session?.user ? (
          <>
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-200">{session.user.email}</span>
              <span className="text-[11px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{session.user.role}</span>
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-3 py-2 rounded-md text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 dark:text-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
            >
              Cerrar sesion
            </button>
          </>
        ) : (
          <button
            type="button"
            disabled={isRedirecting}
            onClick={handleLoginClick}
            className={`px-3 py-2 rounded-md text-sm font-medium text-white transition-colors ${
              isRedirecting 
                ? "bg-zinc-500 cursor-not-allowed" 
                : "bg-zinc-900 hover:bg-zinc-800 dark:text-zinc-900 dark:bg-zinc-100 dark:hover:bg-zinc-200"
            }`}
          >
            {isRedirecting ? "Cargando..." : "Iniciar sesion"}
          </button>
        )}
      </div>
    </header>
  );
}