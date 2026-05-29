"use client";

import { signIn, useSession } from "next-auth/react";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    signIn("google", { callbackUrl: "/chat" });
  };

  return (
    <main className="relative flex flex-1 mc-bg-overworld text-white">
      {/* Columna izquierda */}
      <div className="relative hidden md:flex w-1/2 flex-col justify-center px-16 lg:px-24">
        <div className="flex items-center gap-4 mb-6">
          <img src="/mc-grass-block.svg" alt="" className="h-16 w-16" aria-hidden="true" />
        </div>
        <h1 className="mc-font text-2xl xl:text-3xl leading-relaxed text-white">
          Secure Campus
          <span className="text-[#8fdf8f]"> IA</span>
        </h1>
        <p className="mt-6 max-w-xl text-2xl text-white/90">
          Interactúa con un asistente virtual. Una plataforma diseñada con altos estándares de seguridad, autenticación y acceso basado en roles.
        </p>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <section className="w-full max-w-sm mc-panel p-8">
          <div className="flex justify-center mb-6">
            <div className="mc-slot flex h-14 w-14 items-center justify-center">
              <img src="/mc-grass-block.svg" alt="" className="h-10 w-10" aria-hidden="true" />
            </div>
          </div>

          <h2 className="text-center mc-font-sm text-[#1a1a1a]">Bienvenido</h2>
          <p className="text-center text-lg text-[#555555] mt-2 mb-6">
            Accede con tu cuenta institucional para continuar.
          </p>

          {showAccessDenied && (
            <div className="mb-4 mc-error text-lg">
              Tu correo no está autorizado. Contacta a un administrador.
            </div>
          )}

          <form>
            <div className="mb-4">
              <label className="mc-font-sm text-[0.4rem] text-[#555555] mb-2 block">
                Correo Institucional
              </label>
              <input
                type="email"
                placeholder="usuario@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="scia-input w-full"
              />
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="mc-font-sm text-[0.4rem] text-[#555555]">
                  Contraseña
                </label>
                <span className="text-base text-[#777777] cursor-pointer hover:text-[#1a1a1a]">
                  ¿Olvidaste tu contraseña?
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="scia-input flex-1"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="mc-btn text-[0.45rem] px-2 py-2"
                >
                  {showPassword ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mb-4 w-full mc-btn mc-btn-green"
            >
              Entrar
            </button>
          </form>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-[3px] bg-[#555555]" />
            <span className="text-base text-[#777777]">o</span>
            <div className="flex-1 h-[3px] bg-[#555555]" />
          </div>

          <button
            type="button"
            disabled={isRedirecting}
            onClick={handleLoginClick}
            className={`w-full flex items-center justify-center gap-2 mc-btn ${
              isRedirecting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {isRedirecting ? "Redirigiendo..." : "Continuar con Google"}
          </button>

          <p className="text-center text-base text-[#777777] mt-4">
            Al iniciar sesión, aceptas nuestros{" "}
            <span className="underline cursor-pointer hover:text-[#1a1a1a]">Protocolos de Seguridad</span>.
          </p>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-1 items-center justify-center mc-bg-cave">
        <p className="mc-font-sm text-white">Cargando...</p>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
