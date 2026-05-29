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
    <main className="flex flex-1 items-center justify-center mc-bg-overworld px-4">
      <section className="w-full max-w-md mc-panel p-8">
        <div className="flex justify-center mb-4">
          <img src="/mc-grass-block.svg" alt="" className="h-12 w-12" aria-hidden="true" />
        </div>
        <h1 className="mc-font-sm text-[#1a1a1a]">
          Iniciar sesion
        </h1>
        <p className="mt-2 text-lg text-[#555555]">
          Usa tu cuenta OAuth/OIDC para entrar a Secure Campus IA.
        </p>

        {showAccessDenied && (
          <div className="mt-4 mc-error text-lg">
            Tu correo no esta autorizado para ingresar. Contacta a un
            administrador para ser habilitado.
          </div>
        )}

        <button
          type="button"
          disabled={isRedirecting}
          onClick={handleLoginClick}
          className={`mt-6 w-full mc-btn mc-btn-green ${
            isRedirecting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isRedirecting ? "Redirigiendo a Google..." : "Continuar con Google"}
        </button>
      </section>
    </main>
  );
}
