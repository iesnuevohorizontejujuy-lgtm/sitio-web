import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  GraduationCap,
  UsersRound,
} from "lucide-react";
import { CareerCarousel } from "@/components/institutional/CareerCarousel";
import { HeroMediaCarousel } from "@/components/institutional/HeroMediaCarousel";
import { InstitutionalNewsCard } from "@/components/institutional/InstitutionalNewsCard";
import { MotionReveal } from "@/components/institutional/MotionReveal";
import { whatsappHref } from "@/config/institution";
import { getCareers } from "@/lib/careers";
import { getInstitutionalNews } from "@/lib/institutional-news";

export default async function HomePage() {
  const [careers, institutionalNews] = await Promise.all([
    getCareers(),
    getInstitutionalNews(),
  ]);
  const featuredSlugs = [
    "desarrollo-de-software",
    "enfermeria",
    "administracion-financiera",
    "actividad-fisica-y-fitness",
  ];
  const featuredCareers = featuredSlugs
    .map((slug) => careers.find((career) => career.slug === slug))
    .filter((career) => career !== undefined);
  const latestInstitutionalNews = [
    ...institutionalNews.generales,
    ...institutionalNews.fechas_importantes,
  ]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  return (
    <main className="institutional-shell bg-white text-[#121C28]">
      <section className="border-b border-[#D8E1E8]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:py-20 lg:grid-cols-12 lg:px-8 lg:py-24">
          <MotionReveal className="lg:col-span-5">
            <div className="mb-6 h-0.5 w-10 bg-[#2CBEE7]" />
            <h1 className="max-w-xl text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-[#0A496C] sm:text-5xl lg:text-6xl">
              Tu futuro profesional comienza acá
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-[#52606D] md:text-lg">
              Formación superior cercana, práctica y comprometida con las oportunidades profesionales de Jujuy.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/carreras" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#2CBEE7] px-6 py-3 text-sm font-semibold text-[#073A57] transition hover:bg-[#51D5FF]">
                Conocé nuestras carreras
              </Link>
              <a href={whatsappHref("Hola, quiero saber cómo inscribirme en el IES Nuevo Horizonte.")} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#0A496C] px-6 py-3 text-sm font-semibold text-[#0A496C] transition hover:bg-[#E0ECF8]">
                Cómo inscribirme
              </a>
            </div>
            <div className="mt-9 grid grid-cols-3 gap-4 border-t border-[#D8E1E8] pt-6">
              <div><p className="text-xl font-semibold text-[#0A496C]">20</p><p className="mt-1 text-xs leading-5 text-[#64748B]">Carreras</p></div>
              <div><p className="text-sm font-semibold text-[#0A496C]">Oficiales</p><p className="mt-1 text-xs leading-5 text-[#64748B]">Títulos</p></div>
              <div><p className="text-sm font-semibold text-[#0A496C]">Presencial</p><p className="mt-1 text-xs leading-5 text-[#64748B]">Modalidad</p></div>
            </div>
          </MotionReveal>

          <MotionReveal className="relative lg:col-span-7" delay={0.12}>
            <HeroMediaCarousel />
          </MotionReveal>
        </div>
      </section>

      <section className="border-b border-[#D8E1E8] py-16">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 md:grid-cols-2 lg:px-8">
          <Link href="/carreras" className="group border border-[#CBD5E1] bg-white p-8 transition-colors hover:border-[#0A496C] md:p-10">
            <div className="flex items-start justify-between">
              <GraduationCap className="size-10 text-[#0A496C]" />
              <ArrowRight className="size-5 text-[#64748B] transition-transform group-hover:translate-x-1" />
            </div>
            <h2 className="mt-8 text-2xl font-semibold text-[#0A496C]">Quiero estudiar</h2>
            <p className="mt-3 max-w-lg leading-6 text-[#52606D]">Descubrí la oferta académica, modalidades y documentación de cada carrera.</p>
          </Link>
          <Link href="/campus" className="group bg-[#0A496C] p-8 text-white transition-colors hover:bg-[#073A57] md:p-10">
            <div className="flex items-start justify-between">
              <UsersRound className="size-10 text-[#2CBEE7]" />
              <ArrowRight className="size-5 text-white/70 transition-transform group-hover:translate-x-1" />
            </div>
            <h2 className="mt-8 text-2xl font-semibold">Soy parte de la comunidad</h2>
            <p className="mt-3 max-w-lg leading-6 text-white/70">Accedé al Campus Virtual y a las herramientas para estudiantes y docentes.</p>
          </Link>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#0A496C]"><span className="h-0.5 w-8 bg-[#2CBEE7]" />Nuestra oferta académica</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.025em] text-[#0A496C] md:text-4xl">Elegí tu camino profesional</h2>
            </div>
            <Link href="/carreras" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A496C] underline underline-offset-4">Ver las 20 carreras <ArrowRight className="size-4" /></Link>
          </div>
          <CareerCarousel careers={featuredCareers} />
        </div>
      </section>

      <section id="institucion" className="scroll-mt-28 bg-[#0A496C] py-20 text-white md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/15">
            <Image src="/institutional/students-collaboration.png" alt="Estudiantes trabajando en una actividad académica" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
          <div>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#2CBEE7]"><span className="h-0.5 w-10 bg-[#2CBEE7]" />Nuestra institución</p>
            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.025em] md:text-5xl">Educación cercana, oportunidades reales</h2>
            <p className="mt-7 text-lg leading-8 text-white/75">Acompañamos cada trayectoria con formación técnica, práctica profesional y docentes comprometidos con el desarrollo de sus estudiantes.</p>
            <div className="mt-10 grid gap-6 border-t border-white/15 pt-8 sm:grid-cols-3">
              <div><BookOpenCheck className="size-7 text-[#2CBEE7]" /><p className="mt-3 font-semibold">Formación práctica</p></div>
              <div><UsersRound className="size-7 text-[#2CBEE7]" /><p className="mt-3 font-semibold">Acompañamiento</p></div>
              <div><Building2 className="size-7 text-[#2CBEE7]" /><p className="mt-3 font-semibold">Entorno profesional</p></div>
            </div>
            <Link href="/institucion" className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-[#2CBEE7]">Conocé nuestra institución <ArrowRight className="size-4" /></Link>
          </div>
        </div>
      </section>

      <section id="vida-institucional" className="scroll-mt-28 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#0A496C]"><span className="h-0.5 w-8 bg-[#0A496C]" />Comunidad</p>
          <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className="text-3xl font-semibold tracking-[-0.025em] text-[#0A496C] md:text-4xl">Vida institucional</h2>
            <Link href="/vida-institucional" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A496C]">Ver todas las novedades <ArrowRight className="size-4" /></Link>
          </div>
          {latestInstitutionalNews.length > 0 ? (
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {latestInstitutionalNews.map((item) => <InstitutionalNewsCard key={item.id} item={item} />)}
            </div>
          ) : (
            <Link href="/vida-institucional" className="mt-10 flex items-center justify-between gap-6 border-l-4 border-[#2CBEE7] bg-[#F7F9FB] p-7 text-[#52606D]">
              <span>Las próximas noticias y actividades cargadas desde el panel institucional aparecerán acá.</span>
              <ArrowRight className="size-5 shrink-0 text-[#0A496C]" />
            </Link>
          )}
        </div>
      </section>

      <section id="inscripcion" className="px-5 pb-20 md:pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl bg-[#0A496C] px-6 py-14 text-center text-white sm:px-12 md:py-16">
          <h2 className="text-3xl font-semibold tracking-[-0.025em] md:text-4xl">¿Listo para dar el próximo paso?</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/75">Consultá la disponibilidad del próximo ciclo lectivo y recibí acompañamiento durante tu inscripción.</p>
          <a href={whatsappHref("Hola, quiero iniciar mi inscripción en el IES Nuevo Horizonte.")} target="_blank" rel="noreferrer" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#2CBEE7] px-7 py-3 text-sm font-semibold text-[#073A57] hover:bg-white">Iniciá tu inscripción</a>
        </div>
      </section>
    </main>
  );
}
