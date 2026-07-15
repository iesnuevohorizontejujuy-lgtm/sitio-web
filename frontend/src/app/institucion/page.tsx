import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  GraduationCap,
  HeartHandshake,
  MapPin,
  UsersRound,
} from "lucide-react";
import { InstitutionalCarousel } from "@/components/institutional/InstitutionalCarousel";
import { MotionReveal } from "@/components/institutional/MotionReveal";
import { institution, whatsappHref } from "@/config/institution";

export const metadata: Metadata = {
  title: "Institución | IES Nuevo Horizonte",
  description: "Conocé la propuesta institucional, el acompañamiento y la formación profesional del IES Nuevo Horizonte en San Salvador de Jujuy.",
};

const principles = [
  {
    icon: BookOpenCheck,
    title: "Formación situada",
    text: "Propuestas que vinculan los contenidos con las necesidades profesionales y productivas de nuestro entorno.",
  },
  {
    icon: HeartHandshake,
    title: "Acompañamiento cercano",
    text: "Una comunidad educativa que escucha, orienta y acompaña cada trayectoria formativa.",
  },
  {
    icon: GraduationCap,
    title: "Desarrollo profesional",
    text: "Herramientas técnicas y experiencias prácticas para construir oportunidades reales de trabajo.",
  },
] as const;

export default function InstitutionPage() {
  return (
    <main className="institutional-shell bg-white text-[#121C28]">
      <section className="border-b border-[#D8E1E8]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-12 lg:px-8 lg:py-24">
          <MotionReveal className="lg:col-span-5">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#0A496C]"><span className="h-0.5 w-9 bg-[#2CBEE7]" />Nuestra institución</p>
            <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-[#0A496C] sm:text-5xl lg:text-6xl">Educación cercana, oportunidades reales</h1>
            <p className="mt-7 text-lg leading-8 text-[#52606D]">Somos una comunidad educativa de San Salvador de Jujuy comprometida con la formación técnica, el acompañamiento y el crecimiento profesional de cada estudiante.</p>
            <div className="mt-8 flex items-start gap-3 border-l-4 border-[#2CBEE7] bg-[#F7F9FB] p-5 text-sm leading-6 text-[#52606D]">
              <MapPin className="mt-0.5 size-5 shrink-0 text-[#0A496C]" />
              <span>{institution.address}, {institution.city}</span>
            </div>
          </MotionReveal>
          <MotionReveal className="relative lg:col-span-7" delay={0.12}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#B7CADB] bg-[#E0ECF8]">
              <Image src="/instituto.jpg" alt="Instalaciones del IES Nuevo Horizonte" fill priority sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
            </div>
            <div className="absolute bottom-5 left-5 border-l-4 border-[#2CBEE7] bg-white px-5 py-4 shadow-[0_4px_20px_rgba(10,73,108,0.10)]">
              <p className="font-semibold text-[#0A496C]">IES Nuevo Horizonte</p>
              <p className="mt-1 text-sm text-[#52606D]">San Salvador de Jujuy</p>
            </div>
          </MotionReveal>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <MotionReveal className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A496C]">Cómo enseñamos</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.025em] text-[#0A496C] md:text-4xl">Una propuesta que acompaña cada trayectoria</h2>
            <p className="mt-5 text-lg leading-8 text-[#52606D]">La experiencia educativa combina conocimientos, práctica y vínculos cercanos para que cada estudiante pueda avanzar con confianza hacia su futuro profesional.</p>
          </MotionReveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[#CBD5E1] bg-[#CBD5E1] md:grid-cols-3">
            {principles.map((principle, index) => (
              <MotionReveal key={principle.title} className="h-full bg-white p-8 md:p-9" delay={index * 0.08}>
                <principle.icon className="size-9 text-[#0A496C]" />
                <h3 className="mt-7 text-xl font-semibold text-[#0A496C]">{principle.title}</h3>
                <p className="mt-4 leading-7 text-[#52606D]">{principle.text}</p>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0A496C] py-20 text-white md:py-24">
        <div className="mx-auto grid max-w-7xl items-start gap-12 px-5 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <MotionReveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2CBEE7]">Nuestro propósito</p>
            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.025em] md:text-4xl">Formar profesionales que puedan transformar su entorno</h2>
          </MotionReveal>
          <MotionReveal className="space-y-7 text-lg leading-8 text-white/75" delay={0.1}>
            <p>Promovemos una educación superior accesible y vinculada con Jujuy, capaz de brindar herramientas concretas para el trabajo y la participación en la comunidad.</p>
            <p>Entendemos la formación como un recorrido compartido entre estudiantes, docentes y equipos institucionales, con responsabilidad, escucha y compromiso.</p>
          </MotionReveal>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <MotionReveal className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#0A496C]"><span className="h-0.5 w-8 bg-[#2CBEE7]" />Nuestra comunidad</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.025em] text-[#0A496C] md:text-4xl">Aprender, compartir y crecer</h2>
            </div>
            <Link href="/vida-institucional" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A496C]">Conocé la vida institucional <ArrowRight className="size-4" /></Link>
          </MotionReveal>
          <MotionReveal delay={0.08}><InstitutionalCarousel /></MotionReveal>
        </div>
      </section>

      <section className="border-y border-[#D8E1E8] bg-[#F7F9FB] py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-3 lg:px-8">
          <MotionReveal className="flex items-center gap-4"><Building2 className="size-8 text-[#0A496C]" /><div><p className="font-semibold text-[#0A496C]">Entorno profesional</p><p className="mt-1 text-sm text-[#52606D]">Espacios para aprender haciendo.</p></div></MotionReveal>
          <MotionReveal className="flex items-center gap-4" delay={0.06}><UsersRound className="size-8 text-[#0A496C]" /><div><p className="font-semibold text-[#0A496C]">Comunidad cercana</p><p className="mt-1 text-sm text-[#52606D]">Acompañamiento durante el recorrido.</p></div></MotionReveal>
          <MotionReveal className="flex items-center gap-4" delay={0.12}><GraduationCap className="size-8 text-[#0A496C]" /><div><p className="font-semibold text-[#0A496C]">Formación superior</p><p className="mt-1 text-sm text-[#52606D]">Carreras orientadas al futuro profesional.</p></div></MotionReveal>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8">
        <MotionReveal className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-2xl bg-[#0A496C] px-7 py-12 text-white md:flex-row md:items-center md:px-12">
          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.025em]">¿Querés formar parte?</h2>
            <p className="mt-3 max-w-2xl leading-7 text-white/75">Conocé nuestras carreras o escribinos para recibir orientación sobre la propuesta académica.</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/carreras" className="rounded-lg bg-[#2CBEE7] px-6 py-3 text-sm font-semibold text-[#073A57]">Ver carreras</Link>
            <a href={whatsappHref("Hola, quiero conocer más sobre el IES Nuevo Horizonte.")} target="_blank" rel="noreferrer" className="rounded-lg border border-white/35 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">Contactar</a>
          </div>
        </MotionReveal>
      </section>
    </main>
  );
}
