import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  BusFront,
  ExternalLink,
  GraduationCap,
  HeartHandshake,
  MapPin,
  UsersRound,
} from "lucide-react";
import { InstitutionalCarousel } from "@/components/institutional/InstitutionalCarousel";
import { InstitutionalNewsCard } from "@/components/institutional/InstitutionalNewsCard";
import { MotionReveal } from "@/components/institutional/MotionReveal";
import { institution, whatsappHref } from "@/config/institution";
import { getAuthorities } from "@/lib/authorities";
import { getInstitutionalNews } from "@/lib/institutional-news";

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

export default async function InstitutionPage() {
  const [authorities, news] = await Promise.all([getAuthorities(), getInstitutionalNews()]);
  const agreements = news.generales.filter((item) => item.categoria === "convenio").slice(0, 3);

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

      {authorities.length > 0 && (
        <section className="border-b border-[#D8E1E8] bg-[#F7F9FB] py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <MotionReveal className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A496C]">Organización institucional</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.025em] text-[#0A496C] md:text-4xl">Autoridades</h2>
              <p className="mt-5 leading-7 text-[#52606D]">Conocé al equipo responsable de conducir y acompañar el proyecto educativo del instituto.</p>
            </MotionReveal>
            <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[#CBD5E1] bg-[#CBD5E1] sm:grid-cols-2 lg:grid-cols-3">
              {authorities.map((authority, index) => (
                <MotionReveal key={authority.id} className="flex h-full gap-5 bg-white p-6" delay={index * 0.06}>
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-[#E0ECF8]">
                    {authority.imagen ? <Image src={authority.imagen} alt={`Fotografía de ${authority.nombre}`} fill unoptimized sizes="80px" className="object-cover" /> : <UsersRound className="absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 text-[#0A496C]" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0A496C]">{authority.nombre}</h3>
                    <p className="mt-1 text-sm font-medium text-[#2A718F]">{authority.cargo}</p>
                    {authority.descripcion && <p className="mt-3 text-sm leading-6 text-[#52606D]">{authority.descripcion}</p>}
                  </div>
                </MotionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

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

      {agreements.length > 0 && (
        <section className="border-y border-[#D8E1E8] bg-[#F7F9FB] py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <MotionReveal className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A496C]">Vinculación</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.025em] text-[#0A496C] md:text-4xl">Convenios institucionales</h2>
                <p className="mt-5 max-w-2xl leading-7 text-[#52606D]">Acuerdos y vínculos que amplían las experiencias formativas de nuestra comunidad.</p>
              </div>
              <Link href="/vida-institucional" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A496C]">Ver actualidad institucional <ArrowRight className="size-4" /></Link>
            </MotionReveal>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {agreements.map((agreement) => <InstitutionalNewsCard key={agreement.id} item={agreement} />)}
            </div>
          </div>
        </section>
      )}

      <section className="border-y border-[#D8E1E8] bg-[#F7F9FB] py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-3 lg:px-8">
          <MotionReveal className="flex items-center gap-4"><Building2 className="size-8 text-[#0A496C]" /><div><p className="font-semibold text-[#0A496C]">Entorno profesional</p><p className="mt-1 text-sm text-[#52606D]">Espacios para aprender haciendo.</p></div></MotionReveal>
          <MotionReveal className="flex items-center gap-4" delay={0.06}><UsersRound className="size-8 text-[#0A496C]" /><div><p className="font-semibold text-[#0A496C]">Comunidad cercana</p><p className="mt-1 text-sm text-[#52606D]">Acompañamiento durante el recorrido.</p></div></MotionReveal>
          <MotionReveal className="flex items-center gap-4" delay={0.12}><GraduationCap className="size-8 text-[#0A496C]" /><div><p className="font-semibold text-[#0A496C]">Formación superior</p><p className="mt-1 text-sm text-[#52606D]">Carreras orientadas al futuro profesional.</p></div></MotionReveal>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <MotionReveal className="mb-10 max-w-3xl">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#0A496C]"><span className="h-0.5 w-8 bg-[#2CBEE7]" />Cómo llegar</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.025em] text-[#0A496C] md:text-4xl">Encontranos en Alto Comedero</h2>
            <p className="mt-5 text-lg leading-8 text-[#52606D]">El instituto se encuentra en barrio 47 Hectáreas, con acceso mediante distintas líneas de transporte urbano.</p>
          </MotionReveal>

          <div className="grid overflow-hidden rounded-2xl border border-[#B7CADB] bg-white lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
            <MotionReveal className="relative min-h-[430px] bg-[#E0ECF8]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3637.229497413698!2d-65.23556002479582!3d-24.268713378320264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941b077739c761db%3A0x4dbcb07ad6517b37!2sInstituto%20de%20Educaci%C3%B3n%20Superior%20%22Nuevo%20Horizonte%22!5e0!3m2!1ses-419!2sar!4v1784087207149!5m2!1ses-419!2sar"
                title="Mapa del Instituto de Educación Superior Nuevo Horizonte"
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </MotionReveal>

            <MotionReveal className="flex flex-col p-7 md:p-9" delay={0.1}>
              <div className="flex gap-4 border-b border-[#D8E1E8] pb-7">
                <MapPin className="mt-1 size-6 shrink-0 text-[#0A496C]" />
                <div>
                  <h3 className="font-semibold text-[#0A496C]">Dirección</h3>
                  <p className="mt-2 text-sm leading-6 text-[#52606D]">{institution.address}, {institution.postalCode} {institution.city}</p>
                </div>
              </div>

              <div className="pt-7">
                <div className="flex items-center gap-3">
                  <BusFront className="size-6 text-[#0A496C]" />
                  <h3 className="font-semibold text-[#0A496C]">Colectivos que te acercan</h3>
                </div>
                <div className="mt-6 space-y-6">
                  <div>
                    <p className="text-sm font-semibold text-[#0A496C]">Empresa Santa Ana</p>
                    <p className="mt-2 text-sm leading-6 text-[#52606D]">Líneas 52, 20 y 30</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0A496C]">Empresa Urbano</p>
                    <p className="mt-2 text-sm leading-6 text-[#52606D]">Línea 48 Interbarrial</p>
                  </div>
                </div>
              </div>

              <a
                href="https://www.google.com/maps/dir/?api=1&destination=-24.268713378320264,-65.23556002479582"
                target="_blank"
                rel="noreferrer"
                className="mt-9 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#0A496C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#073A57]"
              >
                Ver indicaciones en Google Maps <ExternalLink className="size-4" />
              </a>
            </MotionReveal>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 lg:px-8">
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
