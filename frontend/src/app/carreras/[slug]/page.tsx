import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { CareerAdmissionSection, CareerMobileAdmissionBar } from "@/components/institutional/CareerAdmissionSection";
import { CareerCard } from "@/components/institutional/CareerCard";
import { CareerDetailHero } from "@/components/institutional/CareerDetailHero";
import { CareerDocuments } from "@/components/institutional/CareerDocuments";
import { CareerExperienceSection } from "@/components/institutional/CareerExperienceSection";
import { CareerProfessionalOverview } from "@/components/institutional/CareerProfessionalOverview";
import { CareerSectionNav } from "@/components/institutional/CareerSectionNav";
import { StudyPlan } from "@/components/institutional/StudyPlan";
import { getCareer, getCareers } from "@/lib/careers";

interface CareerDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CareerDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const career = await getCareer(slug);

  if (!career) {
    return { title: "Carrera no encontrada", robots: { index: false, follow: false } };
  }

  return {
    title: career.title,
    description: career.description,
    alternates: { canonical: `/carreras/${career.slug}` },
    openGraph: {
      type: "website",
      title: career.title,
      description: career.description,
      url: `/carreras/${career.slug}`,
      images: [{
        url: career.image ?? "/instituto.jpg",
        alt: `Estudiantes de ${career.shortTitle || career.title}`,
      }],
    },
  };
}

export default async function CareerDetailPage({ params }: CareerDetailPageProps) {
  const { slug } = await params;
  const [career, careers] = await Promise.all([getCareer(slug), getCareers()]);

  if (!career) notFound();

  const shortTitle = career.shortTitle || career.title.replace("Tecnicatura Superior en ", "");
  const hasExperiences = career.socialPosts.length > 0 || career.gallery.length > 0;
  const relatedCareers = careers
    .filter((item) => item.slug !== career.slug && item.area === career.area)
    .slice(0, 3);

  return (
    <main className="institutional-shell pb-20 text-[#121C28] md:pb-0">
      <CareerDetailHero career={career} shortTitle={shortTitle} />
      <CareerSectionNav shortTitle={shortTitle} hasExperiences={hasExperiences} />

      {hasExperiences ? <CareerExperienceSection career={career} shortTitle={shortTitle} /> : null}

      <CareerProfessionalOverview career={career} />

      <section id="plan-estudios" aria-labelledby="study-plan-heading" className="institutional-surface-brand scroll-mt-56 border-y border-[#C6D7E5] py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A6F94]">Trayecto académico</p>
              <h2 id="study-plan-heading" className="mt-3 max-w-3xl text-balance text-3xl font-semibold tracking-[-0.03em] text-[#0A496C] md:text-5xl">Tu recorrido durante la carrera</h2>
              <p className="mt-5 max-w-2xl text-pretty leading-7 text-[#52606D]">Explorá las materias organizadas por año según la información académica oficial publicada por el instituto.</p>
            </div>
            {career.planStudyUrl ? (
              <div className="lg:col-span-4 lg:text-right">
                <a href={career.planStudyUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0A496C] underline decoration-[#2CBEE7] decoration-2 underline-offset-4">
                  Descargar plan completo
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              </div>
            ) : null}
          </div>
          <div className="mt-12">
            <StudyPlan subjects={career.subjects} />
          </div>
        </div>
      </section>

      <CareerDocuments career={career} />

      {relatedCareers.length > 0 ? (
        <section className="institutional-surface-muted border-t border-[#D8E1E8] py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A6F94]">También te puede interesar</p>
                <h2 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.025em] text-[#0A496C]">Otras carreras de {career.area}</h2>
              </div>
              <Link href="/carreras" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0A496C] underline decoration-[#2CBEE7] decoration-2 underline-offset-4">
                Explorar toda la oferta
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {relatedCareers.map((relatedCareer) => (
                <CareerCard key={relatedCareer.slug} career={relatedCareer} index={careers.findIndex((item) => item.slug === relatedCareer.slug)} compact />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CareerAdmissionSection career={career} shortTitle={shortTitle} />
      <CareerMobileAdmissionBar shortTitle={shortTitle} />
    </main>
  );
}
