import { ArrowRight } from "lucide-react";
import { CareerGallery } from "@/components/institutional/CareerGallery";
import { CareerSocialShowcase } from "@/components/institutional/CareerSocialShowcase";
import type { Career } from "@/types/career";

export function CareerExperienceSection({ career, shortTitle }: { career: Career; shortTitle: string }) {
  const hasSocialPosts = career.socialPosts.length > 0;
  const hasGallery = career.gallery.length > 0;

  if (!hasSocialPosts && !hasGallery) return null;

  return (
    <section id="experiencias" aria-labelledby="experiences-heading" className="institutional-surface-muted scroll-mt-56 border-y border-[#D8E1E8] py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A6F94]">La carrera desde adentro</p>
            <h2 id="experiences-heading" className="mt-3 max-w-3xl text-balance text-3xl font-semibold tracking-[-0.03em] text-[#0A496C] md:text-5xl">Aprender también es hacer</h2>
            <p className="mt-5 max-w-2xl text-pretty leading-7 text-[#52606D]">Conocé prácticas, proyectos y actividades que forman parte de la experiencia cotidiana de {shortTitle}.</p>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <a href="#perfil-profesional" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0A496C] underline decoration-[#2CBEE7] decoration-2 underline-offset-4">
              Conocer el perfil profesional
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        {hasSocialPosts ? <div className="mt-12"><CareerSocialShowcase posts={career.socialPosts} fallbackImage={career.gallery[0]?.url ?? career.image} /></div> : null}

        {hasGallery ? (
          <div className={hasSocialPosts ? "mt-16 border-t border-[#C6D7E5] pt-12" : "mt-12"}>
            <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0A6F94]">Registro institucional</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-[#0A496C]">Prácticas y actividades</h3>
              </div>
              <p className="max-w-md text-sm leading-6 text-[#52606D]">Fotografías publicadas por el instituto y ordenadas desde el CMS.</p>
            </div>
            <CareerGallery images={career.gallery} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
