"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const authError = searchParams.get("error");
  const showAccessDenied = authError === "AccessDenied";

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [router, status]);

  // Despertar la página si el navegador la había congelado
  useEffect(() => {
    const handleWakeUp = () => setIsRedirecting(false);
    window.addEventListener("focus", handleWakeUp);
    return () => window.removeEventListener("focus", handleWakeUp);
  }, []);

  const handleLoginClick = () => {
    setIsRedirecting(true);
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <section className="w-full max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Iniciar sesion
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Usa tu cuenta OAuth/OIDC para entrar a Secure Campus IA.
        </p>

        {showAccessDenied && (
          <div className="mt-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
            Tu correo no esta autorizado para ingresar. Contacta a un
            administrador para ser habilitado.
          </div>
        )}

        <button
          type="button"
          disabled={isRedirecting}
          onClick={handleLoginClick}
          className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
            isRedirecting
              ? "bg-zinc-500 text-zinc-200 cursor-not-allowed"
              : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          }`}
        >
          {isRedirecting ? "Redirigiendo a Google..." : "Continuar con Google"}
        </button>
      </section>
    </main>
  );
}
