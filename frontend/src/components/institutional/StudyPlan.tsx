import { BookOpen } from "lucide-react";
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

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {[1, 2, 3].map((year) => {
        const yearSubjects = subjects.filter((subject) => subject.year === year);
        return (
          <details key={year} open={year === 1} className="group border border-[#CBD5E1] bg-white p-6">
            <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-semibold text-[#0A496C] marker:content-none">
              {year}.º año
              <span className="text-2xl font-light text-[#2CBEE7] group-open:rotate-45">+</span>
            </summary>
            <ol className="mt-6 space-y-3 border-t border-[#E2E8F0] pt-5">
              {yearSubjects.map((subject, index) => (
                <li key={subject.name} className="flex gap-3 text-sm leading-5 text-[#52606D]">
                  <span className="font-semibold text-[#2CBEE7]">{String(index + 1).padStart(2, "0")}</span>
                  <span>{subject.name}</span>
                </li>
              ))}
            </ol>
          </details>
        );
      })}
    </div>
  );
}
