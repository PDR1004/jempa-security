import Link from "next/link";
import { Manrope } from "next/font/google";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/auth";
import { ScrollReveal } from "@/app/components/ScrollReveal";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path d="M7 11V8a5 5 0 1 1 10 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
    title: "Control de Acceso",
    description: "Gestion de usuarios por roles (Estudiante, Docente, Admin).",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <rect x="6" y="8" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 4v2M9.5 12h.01M14.5 12h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    title: "Chat Inteligente",
    description: "Asistente de IA para consultas academicas.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path d="M5 19V6M10 19v-6M15 19v-9M20 19v-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    title: "Gestion de Estudiantes",
    description: "Visualizacion y administracion de alumnos.",
  },
];

const steps = ["Iniciar sesion", "Acceder segun tu rol", "Usar las funcionalidades"];

export default async function Home() {
  const session = await getServerAuthSession();

  if (session?.user?.email) {
    redirect("/chat");
  }

  return (
    <main className={`${manrope.className} relative flex-1 w-full overflow-y-auto bg-[#020813] text-zinc-100`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_50%_0%,rgba(22,163,74,0.22),transparent_55%)]"
      />

      <div className="relative mx-auto min-h-full w-full max-w-7xl px-4 sm:px-8 lg:px-12">
        <header className="sticky top-0 z-20 border-b border-emerald-500/15 bg-[#020813]/90 backdrop-blur-md">
          <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between">
            <span className="inline-flex items-center gap-2.5 text-sm font-extrabold tracking-tight text-zinc-100">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 text-emerald-400"
                aria-hidden="true"
              >
                <path
                  d="M12 3.5 18.5 6v5.9c0 4.1-2.8 7.8-6.5 8.9-3.7-1.1-6.5-4.8-6.5-8.9V6L12 3.5Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
              <span>
                SECURE CAMPUS <span className="text-emerald-400">IA</span>
              </span>
            </span>
            <Link
              href="/login"
              className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-[#021209] transition hover:bg-emerald-400"
            >
              Iniciar sesion
            </Link>
          </div>
        </header>

        <section className="mx-auto flex min-h-[74vh] w-full max-w-5xl flex-col items-center justify-center px-2 pt-8 text-center sm:pt-14">
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-semibold text-emerald-300">
            Inteligencia Artificial para tu campus
          </span>
          <h1 className="mt-7 text-balance text-5xl font-bold leading-tight text-zinc-100 sm:text-7xl">
            Secure Campus
            <span className="block text-emerald-400">IA</span>
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-zinc-300 sm:text-lg">
           Interactúa con un asistente virtual. Una plataforma diseñada con altos estándares de seguridad, autenticación y acceso basado en roles.
          </p>
          <div className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/login"
              className="w-full rounded-full bg-emerald-500 px-8 py-3 text-sm font-semibold text-[#021209] transition hover:-translate-y-0.5 hover:bg-emerald-400 sm:w-auto"
            >
              Comenzar ahora
            </Link>
          </div>

          <article className="mt-14 w-full max-w-2xl rounded-2xl border border-zinc-800/90 bg-[#081425]/70 p-4 shadow-[0_18px_60px_-24px_rgba(0,0,0,0.9)]">
            <div className="mb-4 flex items-center gap-2 text-[11px] text-zinc-400">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2">Secure Campus IA - Chat</span>
            </div>
            <div className="space-y-3">
              <p className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-tr-md bg-emerald-900/45 px-4 py-3 text-sm text-zinc-100">
                ¿Cuáles son las correlativas necesarias para cursar AM2?
              </p>
              <p className="mr-auto max-w-[90%] rounded-2xl rounded-tl-md bg-zinc-800/75 px-4 py-3 text-sm text-zinc-100">
                Para cursar AM2 necesitas tener cursado AM1 y Álgebra.
              </p>
            </div>
          </article>
        </section>

        <section className="border-y border-zinc-900/80 py-20">
          <div className="mx-auto w-full max-w-5xl text-center">
            <h2 className="text-balance text-3xl font-bold text-zinc-100 sm:text-5xl">
              Todo lo que necesitas para un campus <span className="text-emerald-400">mas seguro</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
              Innovación tecnológica con seguridad desde el diseño
            </p>
          </div>

          <div className="mx-auto mt-12 grid w-full max-w-5xl gap-5 md:grid-cols-3">
            {features.map((feature, index) => (
              <ScrollReveal key={feature.title} delayMs={index * 120}>
                <article className="rounded-2xl border border-zinc-800/90 bg-[#061426] px-6 py-7 transition hover:-translate-y-1 hover:border-emerald-500/50">
                  <p className="inline-flex rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-300" aria-hidden="true">
                    {feature.icon}
                  </p>
                  <h3 className="mt-4 text-xl font-semibold text-zinc-100">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{feature.description}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto w-full max-w-3xl">
            <h2 className="mb-14 text-center text-4xl font-bold text-zinc-100">
              Como <span className="text-emerald-400">funciona</span>
            </h2>
            <div className="mx-auto flex max-w-2xl flex-col gap-10">
              {steps.map((step, index) => (
                <div key={step} className="flex items-start gap-5">
                  <span className="text-4xl font-bold leading-none text-emerald-400">0{index + 1}</span>
                  <div>
                    <p className="text-2xl font-semibold text-zinc-100">{step}</p>
                    <p className="mt-2 text-zinc-400">
                      {index === 0 && "Accede con tus credenciales institucionales."}
                      {index === 1 && "El sistema te asigna permisos automaticamente."}
                      {index === 2 && "Usa chat, gestion de alumnos y mas funcionalidades."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t border-zinc-900 py-12 text-center">
          <p className="text-sm font-semibold text-zinc-200">SECURE CAMPUS IA</p>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-400">
            Inteligencia artificial al servicio de la universidad. Protege tu campus con tecnologia de
            vanguardia.
          </p>
          <p className="mt-7 text-xs text-zinc-500">© 2026 Secure Campus IA. Todos los derechos reservados.</p>
        </footer>
      </div>
    </main>
  );
}
