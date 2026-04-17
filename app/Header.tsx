"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Manrope } from "next/font/google";
import { hasPermission } from "@/app/lib/auth/permissions";

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
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
          ? "bg-emerald-500/10 text-emerald-400"
          : "text-zinc-400 hover:text-zinc-100"
        }`}
    >
      {children}
    </Link>
  );
};

export function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const hideHeader = pathname === "/" || pathname === "/login";

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

  if (hideHeader) {
    return null;
  }

  return (
    <header className={`${manrope.className} flex items-center justify-between px-4 sm:px-6 h-16 border-b border-emerald-500/15 bg-[#020813]/90 backdrop-blur-md shrink-0 z-20 w-full`}>
      <div className="flex items-center gap-6">
        <h1 translate="no" className="notranslate inline-flex items-center gap-2.5 text-sm font-extrabold tracking-tight text-zinc-100">
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-emerald-400" aria-hidden="true">
            <path d="M12 3.5 18.5 6v5.9c0 4.1-2.8 7.8-6.5 8.9-3.7-1.1-6.5-4.8-6.5-8.9V6L12 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
          <Link href="/" className="hover:text-emerald-400 transition-colors">
            SECURE CAMPUS <span className="text-emerald-400">IA</span>
          </Link>
        </h1>
        <nav className="flex items-center gap-2">
          <NavLink href="/chat">Chat</NavLink>
          {status === "authenticated" &&
            hasPermission(session?.user?.role, "view:students") && (
              <NavLink href="/students">Estudiantes</NavLink>
            )}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {status === "authenticated" && session?.user ? (
          <>
            <div className="hidden sm:flex flex-col text-right leading-tight">
              <span className="text-xs font-semibold text-zinc-200">{session.user.email}</span>
              <span className="text-[10px] uppercase tracking-wide text-emerald-400">{session.user.role}</span>
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-full border border-zinc-700 bg-[#081426] px-4 py-1.5 text-sm font-semibold text-zinc-100 transition hover:border-zinc-500"
            >
              Cerrar sesion
            </button>
          </>
        ) : (
          <button
            type="button"
            disabled={isRedirecting}
            onClick={handleLoginClick}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${isRedirecting
                ? "bg-emerald-500/50 text-[#021209] cursor-not-allowed"
                : "bg-emerald-500 text-[#021209] hover:-translate-y-0.5 hover:bg-emerald-400"
              }`}
          >
            {isRedirecting ? "Cargando..." : "Iniciar sesion"}
          </button>
        )}
      </div>
    </header>
  );
}