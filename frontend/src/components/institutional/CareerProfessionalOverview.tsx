import { BriefcaseBusiness, CheckCircle2 } from "lucide-react";
import type { Career } from "@/types/career";

export function CareerProfessionalOverview({ career }: { career: Career }) {
  return (
    <section id="perfil-profesional" aria-labelledby="profile-heading" className="institutional-surface-canvas scroll-mt-56 py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <article className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A6F94]">Tu formación profesional</p>
            <h2 id="profile-heading" className="mt-3 max-w-2xl text-balance text-3xl font-semibold tracking-[-0.03em] text-[#0A496C] md:text-4xl">
              Preparate para intervenir con criterio, conocimiento y responsabilidad
            </h2>
            {career.content ? (
              <div className="career-rich-text mt-7 max-w-3xl text-pretty text-base leading-8 text-[#52606D]" dangerouslySetInnerHTML={{ __html: career.content }} />
            ) : (
              <p className="mt-7 max-w-3xl text-pretty leading-8 text-[#52606D]">La carrera brinda herramientas técnicas y profesionales para desempeñarte con responsabilidad, criterio y capacidad de adaptación en su campo específico.</p>
            )}
          </article>

          <aside className="border-l-4 border-[#2CBEE7] bg-[#EAF2FB] p-7 sm:p-9 lg:col-span-5" aria-labelledby="capabilities-heading">
            <h3 id="capabilities-heading" className="text-2xl font-semibold tracking-[-0.02em] text-[#0A496C]">Al finalizar vas a poder</h3>
            {career.capabilities.length > 0 ? (
              <ol className="mt-6 divide-y divide-[#C6D7E5]">
                {career.capabilities.map((capability, index) => (
                  <li key={capability} className="flex gap-4 py-4 text-sm leading-6 text-[#425466]">
                    <span className="font-semibold tabular-nums text-[#0A6F94]">{String(index + 1).padStart(2, "0")}</span>
                    <span>{capability}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-5 text-sm leading-6 text-[#52606D]">Las capacidades profesionales específicas se publicarán desde la fuente académica oficial.</p>
            )}
          </aside>
        </div>

        <div className="mt-16 border-y border-[#C6D7E5] py-10">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <BriefcaseBusiness className="size-8 text-[#0A6F94]" aria-hidden="true" />
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.025em] text-[#0A496C]">Dónde podés desarrollarte</h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-[#52606D]">Ámbitos y funciones vinculados con el perfil profesional de la carrera.</p>
            </div>
            <div className="lg:col-span-8">
              {career.employment.length > 0 ? (
                <ul className="grid gap-x-10 sm:grid-cols-2">
                  {career.employment.map((item) => (
                    <li key={item} className="flex gap-3 border-b border-[#D8E1E8] py-4 text-sm leading-6 text-[#425466]">
                      <CheckCircle2 className="mt-1 size-4 shrink-0 text-[#0A6F94]" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="border-l border-[#C6D7E5] pl-6 leading-7 text-[#52606D]">Los alcances profesionales específicos se publicarán desde la fuente académica oficial.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
