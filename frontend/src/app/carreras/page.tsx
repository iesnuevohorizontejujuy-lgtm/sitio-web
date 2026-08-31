import type { Metadata } from "next";
import Link from "next/link";
import { BriefcaseBusiness, GraduationCap, UsersRound } from "lucide-react";
import { CareerExplorer } from "@/components/institutional/CareerExplorer";
import { InstitutionalPageMasthead } from "@/components/institutional/InstitutionalPageMasthead";
import { whatsappHref } from "@/config/institution";
import { careerAreas } from "@/data/career-catalog";
import { getCareers } from "@/lib/careers";

export const metadata: Metadata = {
  title: "Carreras",
  description: "Conocé las 20 tecnicaturas superiores del IES Nuevo Horizonte en San Salvador de Jujuy.",
  alternates: { canonical: "/carreras" },
};

type CareersPageProps = {
  searchParams: Promise<{ area?: string; q?: string }>;
};

export default async function CareersPage({ searchParams }: CareersPageProps) {
  const careersPromise = getCareers();
  const params = await searchParams;
  const careers = await careersPromise;
  const initialArea = careerAreas.includes(params.area as (typeof careerAreas)[number])
    ? params.area as (typeof careerAreas)[number]
    : "Todas";
  const initialQuery = params.q?.trim().slice(0, 100) ?? "";

  return (
    <main className="institutional-shell text-[#121C28]">
      <InstitutionalPageMasthead
        eyebrow="Oferta académica"
        title="Carreras para construir tu futuro"
        description="Descubrí propuestas educativas diseñadas para responder a las necesidades profesionales de Jujuy, con formación humana, técnica y práctica."
        image="/instituto.jpg"
        imageAlt="Instalaciones del IES Nuevo Horizonte"
        caption={{ eyebrow: `${careers.length} carreras presenciales`, title: "Formación superior conectada con las oportunidades de Jujuy" }}
        priority
      >
        <Link href="#oferta" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0A496C] underline decoration-[#2CBEE7] decoration-2 underline-offset-4">Explorar la oferta <span aria-hidden="true">↓</span></Link>
      </InstitutionalPageMasthead>

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

      <section id="oferta" className="institutional-surface-canvas scroll-mt-32 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <CareerExplorer careers={careers} initialArea={initialArea} initialQuery={initialQuery} />
        </div>
      </section>

      <section className="institutional-surface-muted border-t border-[#D8E1E8] py-20">
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
