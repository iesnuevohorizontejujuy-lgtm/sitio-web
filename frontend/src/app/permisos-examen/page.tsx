import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock3, FileCheck2, ShieldCheck } from "lucide-react";
import { ExamPermitEditorialNotice } from "@/components/institutional/ExamPermitEditorialNotice";
import { ExamPermitForm } from "@/components/institutional/ExamPermitForm";
import { InstitutionalPageMasthead } from "@/components/institutional/InstitutionalPageMasthead";
import { InstitutionalPageNav } from "@/components/institutional/InstitutionalPageNav";
import { InstitutionalSectionHeading } from "@/components/institutional/InstitutionalSectionHeading";
import { getExamPermitEditorialContent } from "@/lib/exam-permit-content";

export const metadata: Metadata = {
  title: "Permisos de examen",
  description: "Formulario público para solicitar el permiso de examen, seleccionar materias y continuar al pago del arancel.",
  alternates: { canonical: "/permisos-examen" },
};

const assurances = [
  { icon: FileCheck2, title: "Datos académicos", text: "Las carreras y materias se consultan en el sistema académico." },
  { icon: ShieldCheck, title: "Pago protegido", text: "El arancel se procesa fuera del sitio mediante Mercado Pago." },
  { icon: Clock3, title: "Confirmación", text: "La ficha se habilita cuando el sistema recibe la acreditación." },
] as const;

export default async function ExamPermitsPage() {
  const editorialContent = await getExamPermitEditorialContent();

  return (
    <main className="institutional-shell">
      <InstitutionalPageMasthead
        eyebrow="Trámite académico"
        title="Permiso de examen"
        description="Completá tus datos, elegí las materias que vas a rendir y continuá al pago del derecho de examen."
      >
        <aside className="border-l-4 border-[#2CBEE7] bg-white p-5">
          <p className="font-semibold text-[#0A496C]">Antes de comenzar</p>
          <p className="mt-2 text-sm leading-6 text-[#52606D]">Tené a mano tu DNI y verificá las fechas y llamados publicados por el instituto. Podés incluir hasta ocho materias en una misma solicitud.</p>
        </aside>
      </InstitutionalPageMasthead>

      <InstitutionalPageNav items={[{ href: "#como-funciona", label: "Cómo funciona" }, { href: "#solicitud", label: "Completar solicitud" }]} />

      <section id="como-funciona" className="institutional-surface-brand border-b border-[#C6D7E5]">
        <div className="mx-auto grid max-w-7xl gap-px bg-[#D8E1E8] md:grid-cols-3">
          {assurances.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4 bg-[#F7FAFC] px-6 py-7 lg:px-8">
              <Icon className="mt-0.5 size-5 shrink-0 text-[#0A496C]" />
              <div><p className="font-semibold text-[#123A50]">{title}</p><p className="mt-1 text-sm leading-6 text-[#64748B]">{text}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section id="solicitud" className="mx-auto max-w-5xl px-5 py-12 lg:px-8 lg:py-16">
        <InstitutionalSectionHeading
          eyebrow="Solicitud en línea"
          title="Completá el permiso paso a paso"
          description="Los datos de la convocatoria y la oferta de materias se consultan directamente en los sistemas institucionales."
        />
        {editorialContent ? (
          <div className="mt-10">
            <ExamPermitEditorialNotice content={editorialContent} />
          </div>
        ) : null}
        <Suspense fallback={<div className="mt-10 rounded-2xl border border-[#D8E1E8] bg-white p-12 text-center text-[#64748B]">Preparando el formulario…</div>}>
          <div className="mt-10">
          <ExamPermitForm hasEditorialContent={Boolean(editorialContent)} />
          </div>
        </Suspense>
      </section>
    </main>
  );
}
