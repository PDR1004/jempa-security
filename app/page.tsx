import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/auth";
import { ScrollReveal } from "@/app/components/ScrollReveal";

const features = [
  {
    icon: "🔒",
    title: "Control de Acceso",
    description: "Gestion de usuarios por roles (Estudiante, Docente, Admin).",
  },
  {
    icon: "💬",
    title: "Chat Inteligente",
    description: "Asistente de IA para consultas academicas.",
  },
  {
    icon: "📊",
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
    <main className="relative flex-1 w-full overflow-y-auto mc-bg-overworld text-white">
      <div className="relative mx-auto min-h-full w-full max-w-7xl px-4 sm:px-8 lg:px-12">
        <header className="sticky top-0 z-20 mc-header">
          <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-2">
            <span className="inline-flex items-center gap-2.5 mc-font-sm text-white">
              <img src="/mc-grass-block.svg" alt="" className="h-6 w-6" aria-hidden="true" />
              <span>
                SECURE CAMPUS <span className="text-[#8fdf8f]">IA</span>
              </span>
            </span>
            <Link href="/login" className="mc-btn mc-btn-green">
              Iniciar sesion
            </Link>
          </div>
        </header>

        <section className="mx-auto flex min-h-[74vh] w-full max-w-5xl flex-col items-center justify-center px-2 pt-8 text-center sm:pt-14">
          <span className="mc-badge">
            Inteligencia Artificial para tu campus
          </span>
          <h1 className="mt-7 mc-font text-balance text-2xl leading-relaxed text-white sm:text-4xl">
            Secure Campus
            <span className="block text-[#8fdf8f] mt-2">IA</span>
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-xl leading-relaxed text-white/90 sm:text-2xl">
            Interactúa con un asistente virtual. Una plataforma diseñada con altos estándares de seguridad, autenticación y acceso basado en roles.
          </p>
          <div className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <Link href="/login" className="mc-btn mc-btn-green w-full sm:w-auto text-center">
              Comenzar ahora
            </Link>
          </div>

          <article className="mt-14 w-full max-w-2xl mc-panel-dark p-4">
            <div className="mb-4 flex items-center gap-2 mc-font-sm text-[0.4rem] text-[#aaaaaa]">
              <span className="h-3 w-3 bg-[#c0392b] border border-[#922b21]" />
              <span className="h-3 w-3 bg-[#ffd700] border border-[#a08000]" />
              <span className="h-3 w-3 bg-[#5cb85c] border border-[#3d8b3d]" />
              <span className="ml-2">Secure Campus IA - Chat</span>
            </div>
            <div className="space-y-3">
              <p className="ml-auto w-fit max-w-[90%] mc-chat-user px-4 py-3 text-lg">
                ¿Cuáles son las correlativas necesarias para cursar AM2?
              </p>
              <p className="mr-auto max-w-[90%] mc-chat-ai px-4 py-3 text-lg">
                Para cursar AM2 necesitas tener cursado AM1 y Álgebra.
              </p>
            </div>
          </article>
        </section>

        <section className="py-20">
          <div className="mx-auto w-full max-w-5xl text-center">
            <h2 className="mc-font text-balance text-lg text-white sm:text-2xl">
              Todo lo que necesitas para un campus{" "}
              <span className="text-[#8fdf8f]">mas seguro</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-white/80">
              Innovación tecnológica con seguridad desde el diseño
            </p>
          </div>

          <div className="mx-auto mt-12 grid w-full max-w-5xl gap-5 md:grid-cols-3">
            {features.map((feature, index) => (
              <ScrollReveal key={feature.title} delayMs={index * 120}>
                <article className="mc-panel px-6 py-7 transition hover:translate-y-[-4px]">
                  <p className="inline-flex mc-slot p-3 text-2xl" aria-hidden="true">
                    {feature.icon}
                  </p>
                  <h3 className="mt-4 mc-font-sm text-[#1a1a1a]">{feature.title}</h3>
                  <p className="mt-2 text-lg leading-relaxed text-[#333333]">{feature.description}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto w-full max-w-3xl">
            <h2 className="mb-14 text-center mc-font text-xl text-white">
              Como <span className="text-[#8fdf8f]">funciona</span>
            </h2>
            <div className="mx-auto flex max-w-2xl flex-col gap-10">
              {steps.map((step, index) => (
                <div key={step} className="flex items-start gap-5">
                  <span className="mc-slot flex h-14 w-14 shrink-0 items-center justify-center mc-font-sm text-[0.5rem] text-white">
                    0{index + 1}
                  </span>
                  <div>
                    <p className="text-2xl font-bold text-white">{step}</p>
                    <p className="mt-2 text-xl text-white/75">
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

        <footer className="border-t-4 border-[#373737] py-12 text-center bg-[rgba(0,0,0,0.4)]">
          <p className="mc-font-sm text-white">SECURE CAMPUS IA</p>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-white/70">
            Inteligencia artificial al servicio de la universidad. Protege tu campus con tecnologia de
            vanguardia.
          </p>
          <p className="mt-7 text-base text-white/50">© 2026 Secure Campus IA. Todos los derechos reservados.</p>
        </footer>
      </div>
    </main>
  );
}
