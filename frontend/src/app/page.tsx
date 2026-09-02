import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  CalendarDays,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Newspaper,
  UsersRound,
} from "lucide-react";
import { HeroMediaCarousel, type HomeHeroSlide } from "@/components/institutional/HeroMediaCarousel";
import { HomeAcademicExperience, type HomeExperienceItem } from "@/components/institutional/HomeAcademicExperience";
import { HomeCareerDiscovery } from "@/components/institutional/HomeCareerDiscovery";
import { HomeNewsEditorial } from "@/components/institutional/HomeNewsEditorial";
import { formatAdmissionDate, getAdmissionCall } from "@/lib/admissions";
import { getCareers } from "@/lib/careers";
import { getHomepageSlides } from "@/lib/homepage-slides";
import { getInstitutionalNews } from "@/lib/institutional-news";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const quickAccesses = [
  { label: "Carreras", description: "20 tecnicaturas superiores", href: "/carreras", icon: GraduationCap },
  { label: "Ingresantes", description: "Requisitos e inscripción", href: "/ingresantes", icon: UsersRound },
  { label: "Estudiantes", description: "Permisos de examen", href: "/permisos-examen", icon: ClipboardCheck },
  { label: "Institución", description: "Conocé el Nuevo Horizonte", href: "/institucion", icon: Building2 },
  { label: "Comunidad", description: "Noticias y actividades", href: "/vida-institucional", icon: Newspaper },
  { label: "NHDocs", description: "Documentación institucional", href: "/nhdocs", icon: FileText },
] as const;

const institutionalHighlights = [
  { icon: GraduationCap, title: "Títulos oficiales", text: "Carreras superiores con respaldo normativo." },
  { icon: Building2, title: "Modalidad presencial", text: "Encuentro, práctica e intercambio en el aula." },
  { icon: BookOpenCheck, title: "Prácticas profesionalizantes", text: "Experiencias integradas a cada plan de estudios." },
  { icon: UsersRound, title: "Acompañamiento cercano", text: "Docentes comprometidos con cada trayectoria." },
] as const;

export default async function HomePage() {
  const [careers, institutionalNews, admissionCall, managedHomepageSlides] = await Promise.all([
    getCareers(),
    getInstitutionalNews(),
    getAdmissionCall(),
    getHomepageSlides(),
  ]);
  const latestInstitutionalNews = institutionalNews.noticias.slice(0, 4);
  const fallbackHeroSlides: HomeHeroSlide[] = [
    {
      id: "instituto-frente",
      eyebrow: "IES Nuevo Horizonte · Jujuy",
      title: "Una institución para construir tu futuro",
      description: "Conocé nuestros espacios, nuestra propuesta académica y una comunidad que acompaña cada trayectoria.",
      image: "/institutional/instituto-frente.jpeg",
      imageAlt: "Frente del Instituto de Educación Superior Nuevo Horizonte en San Salvador de Jujuy",
      primaryLabel: "Conocé el instituto",
      primaryHref: "/institucion",
      secondaryLabel: "Explorar carreras",
      secondaryHref: "/carreras",
    },
    {
      id: "instituto-patio",
      eyebrow: "Espacios que acompañan",
      title: "Un lugar para aprender, encontrarse y crecer",
      description: "Aulas y espacios comunes pensados para compartir experiencias y avanzar en tu formación profesional.",
      image: "/institutional/instituto-patio.jpeg",
      imageAlt: "Patio interior y espacios comunes del IES Nuevo Horizonte",
      primaryLabel: "Recorré la institución",
      primaryHref: "/institucion",
      secondaryLabel: "Cómo llegar",
      secondaryHref: "/institucion#ubicacion",
    },
    {
      id: "comunidad-patio-uno",
      eyebrow: "Comunidad educativa",
      title: "Aprender también es encontrarse y compartir",
      description: "La vida institucional se construye con participación, acompañamiento y experiencias que van más allá del aula.",
      image: "/institutional/comunidad-patio-1.jpeg",
      imageAlt: "Estudiantes del IES Nuevo Horizonte compartiendo una actividad en el patio",
      primaryLabel: "Vida institucional",
      primaryHref: "/vida-institucional",
      secondaryLabel: "Noticias y actividades",
      secondaryHref: "/noticias",
    },
    {
      id: "comunidad-patio-dos",
      eyebrow: "Educación cercana",
      title: "Formación con acompañamiento y oportunidades reales",
      description: "Estudiantes y docentes forman una comunidad comprometida con el crecimiento profesional en Jujuy.",
      image: "/institutional/comunidad-patio-2.jpeg",
      imageAlt: "Comunidad estudiantil reunida en los espacios abiertos del IES Nuevo Horizonte",
      primaryLabel: "Conocé nuestras carreras",
      primaryHref: "/carreras",
      secondaryLabel: "Información para ingresantes",
      secondaryHref: "/ingresantes",
    },
  ];
  const heroSlides: HomeHeroSlide[] = managedHomepageSlides.length > 0
    ? managedHomepageSlides.map((slide) => ({
        id: `cms-${slide.id}`,
        eyebrow: slide.etiqueta,
        title: slide.titulo,
        description: slide.bajada,
        image: slide.imagen_escritorio,
        mobileImage: slide.imagen_movil ?? undefined,
        imageAlt: slide.imagen_alt,
        primaryLabel: slide.texto_boton,
        primaryHref: slide.url_boton,
        secondaryLabel: slide.texto_boton_secundario ?? undefined,
        secondaryHref: slide.url_boton_secundario ?? undefined,
      }))
    : fallbackHeroSlides;
  const socialExperience: HomeExperienceItem[] = careers.flatMap((career) =>
    career.socialPosts
      .filter((post) => !/(testimonio|egresad[oa]s?)/i.test(`${post.title} ${post.description ?? ""}`))
      .map((post) => ({
      id: `social-${career.slug}-${post.id}`,
      career: career.shortTitle ?? career.title.replace(/^Tecnicatura Superior en\s+/i, ""),
      title: post.title,
      description: post.description,
      image: post.previewImage,
      imageAlt: post.previewAlt,
      href: post.url,
      external: true,
      kind: "social" as const,
      })),
  );
  const experienceItems = [
    ...socialExperience.filter((item) => item.image),
    ...socialExperience.filter((item) => !item.image),
  ].slice(0, 3);

  return (
    <main className="institutional-shell text-[#121C28]">
      <HeroMediaCarousel slides={heroSlides} />

      {admissionCall && (
        <section className="border-b border-[#D8E1E8] bg-[#0A496C] text-white">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 py-7 md:flex-row md:items-center lg:px-8">
            <div className="flex items-start gap-4">
              <CalendarDays className="mt-1 size-6 shrink-0 text-[#2CBEE7]" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8CDDF3]">{admissionCall.estado === "abiertas" ? "Inscripciones abiertas" : admissionCall.estado === "cerradas" ? "Inscripciones cerradas" : "Próximo ingreso"}</p>
                <h2 className="mt-1 text-xl font-semibold">{admissionCall.titulo}</h2>
                {(admissionCall.fecha_inicio || admissionCall.fecha_fin) && <p className="mt-1 text-sm text-white/70">{admissionCall.fecha_inicio && formatAdmissionDate(admissionCall.fecha_inicio)}{admissionCall.fecha_inicio && admissionCall.fecha_fin && " — "}{admissionCall.fecha_fin && formatAdmissionDate(admissionCall.fecha_fin)}</p>}
              </div>
            </div>
            <Link href="/ingresantes" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#2CBEE7] px-5 py-3 text-sm font-semibold text-[#073A57]">Ver información de ingreso <ArrowRight className="size-4" /></Link>
          </div>
        </section>
      )}

      <section aria-labelledby="quick-access-title" className="border-b border-[#D8E1E8] bg-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-4 border-b border-[#C6D7E5] pb-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#0A6F94]">Accesos principales</p>
              <h2 id="quick-access-title" className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-[#0A496C] md:text-3xl">Encontrá la información que necesitás</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[#52606D]">Accesos directos para estudiantes, ingresantes y toda la comunidad educativa.</p>
          </div>
          <div className="mt-7 grid gap-px overflow-hidden rounded-xl border border-[#C6D7E5] bg-[#C6D7E5] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {quickAccesses.map((access) => {
            const Icon = access.icon;
            return (
              <Link key={access.href} href={access.href} className="group flex min-h-44 flex-col items-center justify-center bg-[#F4F7F9] px-4 py-6 text-center transition-colors hover:bg-[#E0ECF8] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#2CBEE7]/40">
                <span className="inline-flex size-16 items-center justify-center rounded-full bg-white text-[#0A496C] shadow-[0_4px_14px_rgba(10,73,108,0.08)] transition-transform group-hover:-translate-y-1"><Icon className="size-7" aria-hidden="true" /></span>
                <span className="mt-4 block font-semibold text-[#0A496C]">{access.label}</span>
                <span className="mt-1 block text-xs leading-5 text-[#52606D]">{access.description}</span>
              </Link>
            );
          })}
          </div>
        </div>
      </section>

      <HomeCareerDiscovery careers={careers.map((career) => ({
        title: career.title,
        slug: career.slug,
        area: career.area,
        duration: career.duration,
        modality: career.modality,
      }))} />

      <HomeAcademicExperience items={experienceItems} />

      <section id="institucion" className="scroll-mt-28 border-b border-[#D8E1E8] bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-5 border-b border-[#C6D7E5] pb-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#0A6F94]">Nuestra institución</p>
              <h2 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.035em] text-[#0A496C] md:text-5xl">Formación técnica con sentido práctico</h2>
            </div>
            <p className="max-w-xl leading-7 text-[#52606D] lg:col-span-5 lg:justify-self-end">Una propuesta educativa cercana, comprometida con las trayectorias estudiantiles y las oportunidades profesionales de Jujuy.</p>
          </div>

          <div className="group relative mt-8 min-h-[430px] overflow-hidden rounded-xl bg-[#0A496C] sm:min-h-[520px]">
            <Image src="/instituto.jpg" alt="Instalaciones del IES Nuevo Horizonte" fill sizes="(max-width: 1280px) 100vw, 1280px" className="object-cover transition-transform duration-700 group-hover:scale-[1.015]" />
            <div className="absolute inset-0 bg-[#073A57]/58" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-10 lg:max-w-3xl lg:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#8CDDF3]">San Salvador de Jujuy</p>
              <h3 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">Una institución cercana a su comunidad</h3>
              <p className="mt-4 max-w-2xl leading-7 text-white/80">Conocimientos específicos, prácticas profesionalizantes y acompañamiento docente para construir herramientas aplicables al ejercicio profesional.</p>
              <Link href="/institucion" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white underline decoration-[#2CBEE7] decoration-2 underline-offset-4">Conocé nuestra propuesta institucional <ArrowRight className="size-4" aria-hidden="true" /></Link>
            </div>
          </div>

          <div className="grid gap-px overflow-hidden rounded-b-xl border-x border-b border-[#C6D7E5] bg-[#C6D7E5] sm:grid-cols-2 lg:grid-cols-4">
            {institutionalHighlights.map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-[#F4F7F9] p-6 lg:p-7">
                <Icon className="size-7 text-[#0A6F94]" aria-hidden="true" />
                <h3 className="mt-4 font-semibold text-[#0A496C]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#52606D]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="vida-institucional" className="institutional-surface-muted scroll-mt-28 border-b border-[#D8E1E8] py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#0A496C]"><span className="h-0.5 w-8 bg-[#0A496C]" />Comunidad</p>
          <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-semibold tracking-[-0.025em] text-[#0A496C] md:text-4xl">Vida institucional</h2>
              <p className="mt-3 max-w-2xl leading-7 text-[#52606D]">Actualidad, actividades y fechas importantes de nuestra comunidad educativa.</p>
            </div>
            <Link href="/vida-institucional" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A496C]">Ver todas las novedades <ArrowRight className="size-4" /></Link>
          </div>
          {latestInstitutionalNews.length > 0 || institutionalNews.agenda.length > 0 ? (
            <HomeNewsEditorial featuredItems={institutionalNews.destacadas} newsItems={latestInstitutionalNews} agendaItems={institutionalNews.agenda} />
          ) : (
            <Link href="/vida-institucional" className="mt-10 flex items-center justify-between gap-6 border-l-4 border-[#2CBEE7] bg-[#F7F9FB] p-7 text-[#52606D]">
              <span>Las próximas noticias y actividades cargadas desde el panel institucional aparecerán acá.</span>
              <ArrowRight className="size-5 shrink-0 text-[#0A496C]" />
            </Link>
          )}
        </div>
      </section>

      <section id="inscripcion" className="institutional-surface-canvas px-5 py-20 md:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl bg-[#0A496C] px-6 py-14 text-center text-white sm:px-12 md:py-16">
          <h2 className="text-3xl font-semibold tracking-[-0.025em] md:text-4xl">¿Listo para dar el próximo paso?</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/75">Consultá la disponibilidad del próximo ciclo lectivo y recibí acompañamiento durante tu inscripción.</p>
          <Link href="/ingresantes" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#2CBEE7] px-7 py-3 text-sm font-semibold text-[#073A57] hover:bg-white">Conocé cómo inscribirte</Link>
        </div>
      </section>
    </main>
  );
}
