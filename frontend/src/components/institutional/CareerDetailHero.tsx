import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock3, FileText, GraduationCap, MapPin } from "lucide-react";
import type { Career } from "@/types/career";

const areaImages: Record<Career["area"], string> = {
  Salud: "/instituto.jpg",
  Tecnología: "/instituto.jpg",
  Gestión: "/instituto.jpg",
  "Sociedad y comunicación": "/instituto.jpg",
  "Actividad física": "/instituto.jpg",
};

export function CareerDetailHero({ career, shortTitle }: { career: Career; shortTitle: string }) {
  const image = career.image ?? areaImages[career.area];

  return (
    <>
      <div className="institutional-surface-muted border-b border-[#D8E1E8]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm lg:px-8">
          <nav aria-label="Migas de pan" className="min-w-0 text-[#52606D]">
            <Link href="/" className="hover:text-[#0A496C]">Inicio</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <Link href="/carreras" className="hover:text-[#0A496C]">Carreras</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-[#0A496C]" aria-current="page">{shortTitle}</span>
          </nav>
          <Link href="/carreras" className="inline-flex min-h-11 items-center gap-2 font-semibold text-[#0A496C] hover:text-[#073A57]">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Volver a carreras
          </Link>
        </div>
      </div>

      <section id="presentacion" aria-labelledby="career-title" className="institutional-surface-canvas scroll-mt-40 px-5 py-8 lg:px-8 lg:py-12">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-2xl bg-[#073A57] lg:min-h-[570px] lg:grid-cols-12">
          <div className="flex flex-col justify-center px-7 py-12 text-white sm:px-10 lg:col-span-6 lg:px-14 lg:py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8CDDF3]">{career.area} · Carrera de nivel superior</p>
            <h1 id="career-title" className="mt-5 max-w-3xl text-balance text-4xl font-bold leading-[1.04] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {career.title}
            </h1>
            <p className="mt-7 max-w-xl text-pretty text-base leading-7 text-white/78 sm:text-lg sm:leading-8">{career.description}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#inscripcion" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#2CBEE7] px-6 py-3 text-sm font-semibold text-[#073A57] transition-colors hover:bg-white">
                Inscribirme en {shortTitle}
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              <a href="#plan-estudios" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/45 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-[#073A57]">
                Ver plan de estudios
              </a>
            </div>
          </div>

          <div className="relative min-h-[360px] bg-[#E0ECF8] sm:min-h-[460px] lg:col-span-6 lg:min-h-full">
            <Image
              src={image}
              alt={`Estudiantes y actividades de ${shortTitle}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 border-t border-white/20 bg-[#031D2C]/88 px-6 py-5 text-white lg:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8CDDF3]">Formación cercana y práctica</p>
              <p className="mt-1 text-sm text-white/80">Estudiá en San Salvador de Jujuy.</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Datos académicos principales" className="institutional-surface-canvas px-5 pb-8 lg:px-8 lg:pb-12">
        <div className="mx-auto grid max-w-7xl divide-y divide-[#D8E1E8] overflow-hidden rounded-xl border border-[#C6D7E5] bg-white sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          <AcademicDatum icon={Clock3} label="Duración" value={career.duration} />
          <AcademicDatum icon={MapPin} label="Modalidad" value={career.modality} />
          <AcademicDatum icon={GraduationCap} label="Título que otorga" value={career.awardedTitle || "Título oficial"} />
          <AcademicDatum icon={FileText} label="Resolución" value={career.resolutionCode ?? "Consultar"} />
        </div>
      </section>
    </>
  );
}

function AcademicDatum({ icon: Icon, label, value }: { icon: typeof Clock3; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-start gap-4 px-5 py-5 lg:px-6">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#E0ECF8] text-[#0A496C]">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#52606D]">{label}</p>
        <p className="mt-1 break-words font-semibold leading-6 text-[#0A496C]">{value}</p>
      </div>
    </div>
  );
}
