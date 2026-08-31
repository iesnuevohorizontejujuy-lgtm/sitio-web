import { BookOpen, ChevronDown } from "lucide-react";
import type { CareerSubject } from "@/types/career";

interface StudyPlanProps {
  subjects: CareerSubject[];
}

export function StudyPlan({ subjects }: StudyPlanProps) {
  if (subjects.length === 0) {
    return (
      <div className="border border-[#CBD5E1] bg-[#F8FAFD] px-6 py-10 text-center">
        <BookOpen className="mx-auto size-8 text-[#0A496C]" />
        <h3 className="mt-4 text-lg font-semibold text-[#0A496C]">Plan académico disponible en la documentación oficial</h3>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[#52606D]">La API todavía no publica las materias estructuradas de esta carrera. Para evitar información incorrecta, podés consultar el plan oficial cuando el documento esté disponible.</p>
      </div>
    );
  }

  const years = [...new Set(subjects.map((subject) => subject.year))].sort((a, b) => a - b);

  return (
    <div>
      <ol className="relative grid gap-3 sm:grid-cols-3" aria-label="Recorrido por año">
        {years.map((year, index) => {
          const subjectCount = subjects.filter((subject) => subject.year === year).length;
          return (
            <li key={year} className="relative border-t-2 border-[#2CBEE7] bg-[#EAF2FB] px-5 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0A6F94]">Etapa {index + 1}</p>
              <p className="mt-2 text-xl font-semibold text-[#0A496C]">{year}.º año</p>
              <p className="mt-1 text-sm text-[#52606D]">{subjectCount} {subjectCount === 1 ? "materia" : "materias"}</p>
            </li>
          );
        })}
      </ol>

      <div className="mt-7 grid gap-4">
        {years.map((year) => {
          const yearSubjects = subjects.filter((subject) => subject.year === year);
          return (
            <details key={year} open={year === years[0]} className="group overflow-hidden rounded-xl border border-[#C6D7E5] bg-white">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 px-5 py-4 marker:content-none sm:px-7">
                <span>
                  <span className="block text-lg font-semibold text-[#0A496C]">Materias de {year}.º año</span>
                  <span className="mt-1 block text-xs font-medium text-[#52606D]">{yearSubjects.length} espacios curriculares</span>
                </span>
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#E0ECF8] text-[#0A496C] transition-transform group-open:rotate-180">
                  <ChevronDown className="size-5" aria-hidden="true" />
                </span>
              </summary>
              <ol className="grid border-t border-[#D8E1E8] bg-[#F8FAFD] sm:grid-cols-2 lg:grid-cols-3">
                {yearSubjects.map((subject, index) => (
                  <li key={`${year}-${subject.name}`} className="flex gap-3 border-b border-[#E2E8F0] px-5 py-4 text-sm leading-6 text-[#425466] sm:px-7 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:[&:nth-last-child(-n+3)]:border-b-0">
                    <span className="shrink-0 font-semibold tabular-nums text-[#0A6F94]">{String(index + 1).padStart(2, "0")}</span>
                    <span>{subject.name}</span>
                  </li>
                ))}
              </ol>
            </details>
          );
        })}
      </div>
    </div>
  );
}
