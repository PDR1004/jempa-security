"use client";

import { signIn, useSession } from "next-auth/react";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

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
    <main className={`${manrope.className} relative flex flex-1 bg-[#020813] text-white`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[380px] bg-[radial-gradient(circle_at_50%_0%,rgba(22,163,74,0.2),transparent_58%)]"
      />

      {/* Columna izquierda */}
      <div className="relative hidden md:flex w-1/2 flex-col justify-center px-16 lg:px-24">
        <h1 className="text-6xl font-extrabold leading-tight tracking-tight text-zinc-100">
          Control de Acceso 
          <span className="mt-2 block text-emerald-400">Basado en Roles</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-zinc-300">
          Protegé tu campus universitario con un asistente de inteligencia artificial que responde en tiempo real y
          ayuda a tomar mejores decisiones.
        </p>
      </div>

   
      <div className="relative flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <section className="w-full max-w-sm rounded-3xl border border-zinc-700/80 bg-zinc-900/90 p-8 shadow-[0_24px_70px_-32px_rgba(0,0,0,0.95)] backdrop-blur-md">

          
          <div className="flex justify-center mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                <path
                  d="M12 3.5 18.5 6v5.9c0 4.1-2.8 7.8-6.5 8.9-3.7-1.1-6.5-4.8-6.5-8.9V6L12 3.5Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-center text-2xl font-extrabold tracking-tight text-zinc-100">Bienvenido</h2>
          <p className="text-center text-sm text-zinc-400 mt-1 mb-6">
     
          </p>

          {showAccessDenied && (
            <div className="mb-4 rounded-lg border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-300">
              Tu correo no está autorizado. Contacta a un administrador.
            </div>
          )}

          <form>
            <div className="mb-4">
              <label className="text-xs text-zinc-400 uppercase tracking-widest mb-1 block">
                Correo Institucional
              </label>
              <div className="flex items-center rounded-lg border border-zinc-700 bg-[#111a2a] px-3 py-2 focus-within:border-emerald-500/60">
                <input
                  type="email"
                  placeholder="usuario@campus.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="scia-input flex-1 text-sm text-zinc-100 placeholder-zinc-500 outline-none"
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-zinc-400 uppercase tracking-widest">
                  Contraseña
                </label>
                <span className="text-xs text-zinc-400 cursor-pointer hover:text-white">
                  ¿Olvidaste tu contraseña?
                </span>
              </div>
              <div className="flex items-center rounded-lg border border-zinc-700 bg-[#111a2a] px-3 py-2 focus-within:border-emerald-500/60">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="scia-input flex-1 text-sm text-zinc-100 placeholder-zinc-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-zinc-500 hover:text-white text-xs ml-2"
                >
                  {showPassword ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>

           
            <button
              type="submit"
              className="mb-4 w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-[#021209] transition-colors hover:bg-emerald-400"
            >
              Entrar
            </button>
          </form>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-px bg-zinc-700" />
            <span className="text-xs text-zinc-500">o</span>
            <div className="flex-1 h-px bg-zinc-700" />
          </div>

          <button
            type="button"
            disabled={isRedirecting}
            onClick={handleLoginClick}
            className={`w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-[#111a2a] px-4 py-3 text-sm font-medium transition-colors ${
              isRedirecting
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-zinc-500 hover:bg-zinc-800"
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isRedirecting ? "Redirigiendo..." : "Continuar con Google"}
          </button>

          <p className="text-center text-xs text-zinc-500 mt-4">
            Al iniciar sesión, aceptas nuestros{" "}
            <span className="underline cursor-pointer hover:text-white">Protocolos de Seguridad</span>.
          </p>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className={`${manrope.className} flex flex-1 items-center justify-center bg-[#020813]`}>
        <p className="text-white">Cargando...</p>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}