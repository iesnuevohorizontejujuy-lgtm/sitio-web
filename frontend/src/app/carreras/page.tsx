import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BriefcaseBusiness, GraduationCap, UsersRound } from "lucide-react";
import { CareerExplorer } from "@/components/institutional/CareerExplorer";
import { whatsappHref } from "@/config/institution";
import { getCareers } from "@/lib/careers";

export const metadata: Metadata = {
  title: "Carreras | IES Nuevo Horizonte",
  description: "Conocé las 20 tecnicaturas superiores del IES Nuevo Horizonte en San Salvador de Jujuy.",
};

export default async function CareersPage() {
  const careers = await getCareers();

  return (
    <main className="institutional-shell bg-[#F8FAFD] text-[#121C28]">
      <section className="border-b border-[#D8E1E8]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:py-20 lg:grid-cols-12 lg:px-8 lg:py-24">
          <div className="lg:col-span-5">
            <span className="inline-flex rounded-lg bg-[#E0ECF8] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#0A496C]">Oferta académica</span>
            <h1 className="mt-7 text-4xl font-bold leading-tight tracking-[-0.035em] text-[#0A496C] sm:text-5xl lg:text-6xl">Carreras para construir tu futuro</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#52606D]">Descubrí propuestas educativas diseñadas para responder a las necesidades profesionales de Jujuy, con formación humana, técnica y práctica.</p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#CBD5E1] bg-[#E0ECF8] lg:col-span-7">
            <Image src="/institutional/software-students.png" alt="Estudiantes trabajando en equipo" fill priority sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="border-b border-[#D8E1E8] bg-[#EAF2FB]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 md:grid-cols-3 lg:px-8">
          {[
            { icon: GraduationCap, title: "Títulos oficiales", text: "Validez nacional y respaldo institucional." },
            { icon: BriefcaseBusiness, title: "Formación práctica", text: "Aprendizajes conectados con el trabajo profesional." },
            { icon: UsersRound, title: "Acompañamiento cercano", text: "Docentes comprometidos con cada trayectoria." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-4">
              <span className="rounded-lg bg-white p-3 text-[#0A496C]"><Icon className="size-5" /></span>
              <div><h2 className="font-semibold text-[#0A496C]">{title}</h2><p className="mt-1 text-sm leading-5 text-[#52606D]">{text}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <CareerExplorer careers={careers} />
        </div>
      </section>

      <section className="border-t border-[#D8E1E8] bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-2 lg:px-8">
          <div className="border border-[#CBD5E1] p-8 md:p-10">
            <h2 className="text-2xl font-semibold text-[#0A496C]">¿Todavía no sabés qué carrera elegir?</h2>
            <p className="mt-4 max-w-xl leading-7 text-[#52606D]">Nuestro equipo puede orientarte para encontrar la propuesta que mejor se adapte a tus intereses.</p>
            <a href={whatsappHref("Hola, quiero recibir orientación para elegir una carrera.")} target="_blank" rel="noreferrer" className="mt-7 inline-flex rounded-lg border border-[#0A496C] px-5 py-3 text-sm font-semibold text-[#0A496C] hover:bg-[#E0ECF8]">Quiero recibir orientación</a>
          </div>
          <div className="bg-[#0A496C] p-8 text-white md:p-10">
            <h2 className="text-2xl font-semibold">Inscripciones</h2>
            <p className="mt-4 max-w-xl leading-7 text-white/75">Consultá requisitos, documentación y disponibilidad para el próximo ciclo lectivo.</p>
            <Link href="/ingresantes" className="mt-7 inline-flex rounded-lg bg-[#2CBEE7] px-5 py-3 text-sm font-semibold text-[#073A57] hover:bg-white">Cómo inscribirme</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
