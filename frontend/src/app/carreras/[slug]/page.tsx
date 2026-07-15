import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  GraduationCap,
  MapPin,
  UsersRound,
} from "lucide-react";
import { StudyPlan } from "@/components/institutional/StudyPlan";
import { CareerGallery } from "@/components/institutional/CareerGallery";
import { CareerInquiryForm } from "@/components/institutional/CareerInquiryForm";
import { getCareer } from "@/lib/careers";
import type { CareerArea } from "@/types/career";

interface CareerDetailPageProps {
  params: Promise<{ slug: string }>;
}

const areaImages: Record<CareerArea, string> = {
  Salud: "/institutional/professor-classroom.png",
  Tecnología: "/institutional/software-students.png",
  Gestión: "/institutional/students-collaboration.png",
  "Sociedad y comunicación": "/institutional/students-collaboration.png",
  "Actividad física": "/instituto.jpg",
};

export async function generateMetadata({ params }: CareerDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const career = await getCareer(slug);
  if (!career) return { title: "Carrera no encontrada | IES Nuevo Horizonte" };
  return { title: `${career.title} | IES Nuevo Horizonte`, description: career.description };
}

export default async function CareerDetailPage({ params }: CareerDetailPageProps) {
  const { slug } = await params;
  const career = await getCareer(slug);
  if (!career) notFound();

  const shortTitle = career.title.replace("Tecnicatura Superior en ", "");

  return (
    <main className="institutional-shell bg-[#F8FAFD] text-[#121C28]">
      <section className="border-b border-[#D8E1E8] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-5 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <nav aria-label="Migas de pan" className="text-[#64748B]">
              <Link href="/" className="hover:text-[#0A496C]">Inicio</Link><span className="mx-2">/</span><Link href="/carreras" className="hover:text-[#0A496C]">Carreras</Link><span className="mx-2">/</span><span className="text-[#0A496C]">{shortTitle}</span>
            </nav>
            <Link href="/carreras" className="inline-flex items-center gap-2 font-semibold text-[#0A496C]"><ArrowLeft className="size-4" />Volver a carreras</Link>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-12 lg:px-8 lg:py-20">
          <div className="lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2CBEE7]">{career.area}</p>
            <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-[#0A496C] sm:text-5xl">{career.title}</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#52606D]">{career.description}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#consulta" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#0A496C] px-6 py-3 text-sm font-semibold text-white hover:bg-[#073A57]">Quiero inscribirme</a>
              <a href="#consulta" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#0A496C] px-6 py-3 text-sm font-semibold text-[#0A496C] hover:bg-[#E0ECF8]">Hacer una consulta</a>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#CBD5E1] bg-[#E0ECF8] lg:col-span-6">
            <Image src={career.image ?? areaImages[career.area]} alt={`Estudiantes de ${shortTitle}`} fill priority unoptimized={Boolean(career.image)} sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="border-y border-[#D8E1E8] bg-[#EAF2FB]">
        <div className="mx-auto grid max-w-7xl gap-7 px-5 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <AcademicDatum icon={Clock3} label="Duración" value={career.duration} />
          <AcademicDatum icon={MapPin} label="Modalidad" value={career.modality} />
          <AcademicDatum icon={FileText} label="Resolución" value={career.resolutionCode ?? "Consultar"} />
          <AcademicDatum icon={GraduationCap} label="Título" value="Oficial" />
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-12 lg:px-8">
          <article className="border border-[#CBD5E1] bg-white p-7 md:p-10 lg:col-span-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2CBEE7]">Tu formación</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-[#0A496C]">Perfil profesional</h2>
            {career.content ? (
              <div className="career-rich-text mt-6 leading-7 text-[#52606D]" dangerouslySetInnerHTML={{ __html: career.content }} />
            ) : (
              <p className="mt-6 leading-7 text-[#52606D]">La carrera brinda herramientas técnicas y profesionales para desempeñarte con responsabilidad, criterio y capacidad de adaptación en su campo específico.</p>
            )}
            {career.capabilities.length > 0 && (
              <div className="mt-9 border-t border-[#E2E8F0] pt-7">
                <h3 className="font-semibold text-[#0A496C]">Al finalizar vas a poder</h3>
                <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                  {career.capabilities.map((capability) => <li key={capability} className="flex gap-3 text-sm leading-6 text-[#52606D]"><CheckCircle2 className="mt-1 size-4 shrink-0 text-[#2CBEE7]" />{capability}</li>)}
                </ul>
              </div>
            )}
          </article>
          <aside className="bg-[#0A496C] p-7 text-white md:p-9 lg:col-span-4">
            <BriefcaseBusiness className="size-8 text-[#2CBEE7]" />
            <h2 className="mt-5 text-2xl font-semibold">Salida laboral</h2>
            {career.employment.length > 0 ? (
              <ul className="mt-6 divide-y divide-white/15">
                {career.employment.map((item) => <li key={item} className="py-4 text-sm leading-6 text-white/75">{item}</li>)}
              </ul>
            ) : (
              <p className="mt-5 text-sm leading-6 text-white/75">Los alcances profesionales específicos se publicarán desde la fuente académica oficial.</p>
            )}
          </aside>
        </div>
      </section>

      <section className="border-y border-[#D8E1E8] bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2CBEE7]">Trayecto académico</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-[#0A496C] md:text-4xl">Plan de estudios</h2>
            <p className="mt-4 leading-7 text-[#52606D]">Materias organizadas por año según la información académica oficial disponible.</p>
          </div>
          <StudyPlan subjects={career.subjects} />
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="rounded-2xl bg-[#E0ECF8] p-7 md:flex md:items-center md:justify-between md:gap-8 md:p-10">
            <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A496C]">Documentación</p><h2 className="mt-2 text-2xl font-semibold text-[#0A496C]">Documentación oficial de la carrera</h2><p className="mt-2 text-sm leading-6 text-[#52606D]">Consultá los archivos publicados por el instituto.</p></div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-0">
              <DocumentLink href={career.planStudyUrl} label="Plan de estudios" icon={Download} />
              <DocumentLink href={career.resolutionUrl} label="Resolución ministerial" icon={FileText} />
            </div>
          </div>
        </div>
      </section>

      {career.gallery.length > 0 && (
        <section className="border-y border-[#D8E1E8] bg-[#F7F9FB] py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2CBEE7]">Experiencias de la carrera</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-[#0A496C] md:text-4xl">Estudiantes y actividades</h2>
            <p className="mt-4 max-w-2xl leading-7 text-[#52606D]">Una selección de prácticas, proyectos y momentos compartidos por la comunidad de la carrera.</p>
            <div className="mt-10"><CareerGallery images={career.gallery} /></div>
          </div>
        </section>
      )}

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-12 lg:px-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#CBD5E1] lg:col-span-5"><Image src="/instituto.jpg" alt="Instalaciones del IES Nuevo Horizonte" fill sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover" /></div>
          <div className="lg:col-span-7 lg:pl-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2CBEE7]">Nuevo Horizonte</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-[#0A496C]">¿Por qué estudiar con nosotros?</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <Reason icon={BriefcaseBusiness} title="Formación práctica" text="Aprendizajes orientados a situaciones profesionales reales." />
              <Reason icon={UsersRound} title="Acompañamiento docente" text="Cercanía y seguimiento durante toda la trayectoria." />
              <Reason icon={GraduationCap} title="Título oficial" text="Formación superior con respaldo institucional." />
            </div>
          </div>
        </div>
      </section>

      <section id="consulta" className="scroll-mt-28 bg-[#E0ECF8] px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A496C]">Contacto</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-[#0A496C]">Consultá por {shortTitle}</h2>
            <p className="mt-5 leading-7 text-[#52606D]">Dejanos tus datos y la consulta llegará al equipo del instituto. Podrán responderte directamente por WhatsApp.</p>
          </div>
          <div className="rounded-2xl bg-white p-6 md:p-9 lg:col-span-8">
            <CareerInquiryForm careerId={career.id} careerTitle={career.title} />
          </div>
        </div>
      </section>
    </main>
  );
}

function AcademicDatum({ icon: Icon, label, value }: { icon: typeof Clock3; label: string; value: string }) {
  return <div className="flex items-center gap-4"><Icon className="size-5 shrink-0 text-[#0A496C]" /><div><p className="text-[11px] uppercase tracking-[0.12em] text-[#64748B]">{label}</p><p className="mt-1 font-semibold text-[#0A496C]">{value}</p></div></div>;
}

function DocumentLink({ href, label, icon: Icon }: { href?: string | null; label: string; icon: typeof Download }) {
  if (!href) return <span aria-disabled="true" className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#AFC4D8] bg-white/50 px-4 py-3 text-sm font-semibold text-[#64748B]"><Icon className="size-4" />{label} · próximamente</span>;
  return <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-[#0A496C] hover:ring-2 hover:ring-[#2CBEE7]"><Icon className="size-4" />{label}</a>;
}

function Reason({ icon: Icon, title, text }: { icon: typeof GraduationCap; title: string; text: string }) {
  return <div><Icon className="size-7 text-[#2CBEE7]" /><h3 className="mt-4 font-semibold text-[#0A496C]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#52606D]">{text}</p></div>;
}
