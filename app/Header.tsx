"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { hasPermission } from "@/app/lib/auth/permissions";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`mc-hotbar-slot ${isActive ? "mc-hotbar-slot-active" : ""}`}
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

  useEffect(() => {
    const handleWakeUp = () => {
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
    setIsRedirecting(true);
    signIn("google", { callbackUrl: "/chat" });
  };

  if (hideHeader) {
    return null;
  }

  return (
    <header className="mc-header flex items-center justify-between px-4 sm:px-6 h-16 shrink-0 z-20 w-full">
      <div className="flex items-center gap-4 sm:gap-6">
        <h1 translate="no" className="notranslate inline-flex items-center gap-2.5 mc-font-sm text-white">
          <img src="/mc-grass-block.svg" alt="" className="h-6 w-6" aria-hidden="true" />
          <Link href="/" className="hover:text-[#8fdf8f] transition-colors">
            SECURE CAMPUS <span className="text-[#8fdf8f]">IA</span>
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

      <div className="flex items-center gap-3 sm:gap-4">
        {status === "authenticated" && session?.user ? (
          <>
            <div className="hidden sm:flex flex-col text-right leading-tight">
              <span className="text-base text-white">{session.user.email}</span>
              <span className="mc-font-sm text-[0.4rem] text-[#8fdf8f] uppercase">{session.user.role}</span>
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="mc-btn"
            >
              Cerrar sesion
            </button>
          </>
        ) : (
          <button
            type="button"
            disabled={isRedirecting}
            onClick={handleLoginClick}
            className={`mc-btn mc-btn-green ${isRedirecting ? "cursor-not-allowed" : ""}`}
          >
            {isRedirecting ? "Cargando..." : "Iniciar sesion"}
          </button>
        )}
      </div>
    </header>
  );
}
