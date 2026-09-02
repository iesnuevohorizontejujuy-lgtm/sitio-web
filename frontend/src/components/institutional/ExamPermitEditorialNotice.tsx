import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { ExamPermitEditorialContent } from "@/types/exam-permit-content";

export function ExamPermitEditorialNotice({ content }: { content: ExamPermitEditorialContent }) {
  return (
    <section aria-labelledby="exam-permit-notice-title" className="overflow-hidden rounded-2xl border border-[#B8D8E8] bg-white">
      <div className="border-b border-[#C6D7E5] bg-[#EAF5FA] px-6 py-6 md:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#0A6F94]">Información del instituto</p>
        <h2 id="exam-permit-notice-title" className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-[#0A496C]">
          {content.titulo}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#52606D] md:text-base">{content.introduccion}</p>
      </div>

      {content.indicaciones.length > 0 ? (
        <ol className="grid gap-px bg-[#D8E1E8] md:grid-cols-2">
          {content.indicaciones.map((instruction, index) => (
            <li key={`${index}-${instruction}`} className="flex gap-4 bg-[#F8FAFC] px-6 py-5 md:px-8">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#E0ECF8] text-sm font-semibold text-[#0A496C]">
                {index + 1}
              </span>
              <div className="flex min-w-0 items-start gap-2 pt-1 text-sm leading-6 text-[#334A5A]">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#0A6F94]" aria-hidden="true" />
                <span>{instruction}</span>
              </div>
            </li>
          ))}
        </ol>
      ) : null}

      {content.advertencia ? (
        <div className="flex gap-4 border-t border-[#F2D6A2] bg-[#FFF9ED] px-6 py-5 text-[#6F4B17] md:px-8">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <div>
            {content.advertencia_titulo ? <h3 className="font-semibold">{content.advertencia_titulo}</h3> : null}
            <p className="mt-1 whitespace-pre-line text-sm leading-6">{content.advertencia}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
