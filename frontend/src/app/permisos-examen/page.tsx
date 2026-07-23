import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock3, FileCheck2, ShieldCheck } from "lucide-react";
import { ExamPermitForm } from "@/components/institutional/ExamPermitForm";

export const metadata: Metadata = {
  title: "Permisos de examen | IES Nuevo Horizonte",
  description: "Formulario público para solicitar el permiso de examen, seleccionar materias y continuar al pago del arancel.",
};

const assurances = [
  { icon: FileCheck2, title: "Datos académicos", text: "Las carreras y materias se consultan en el sistema académico." },
  { icon: ShieldCheck, title: "Pago protegido", text: "El arancel se procesa fuera del sitio mediante Mercado Pago." },
  { icon: Clock3, title: "Confirmación", text: "La ficha se habilita cuando el sistema recibe la acreditación." },
] as const;

export default function ExamPermitsPage() {
  return (
    <main className="bg-[#F7FAFC]">
      <section className="border-b border-[#D8E1E8] bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1fr_0.8fr] lg:px-8 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0A496C]">Trámite académico</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-[#123A50] sm:text-5xl">Permiso de examen</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#52606D]">
              Completá tus datos, elegí las materias que vas a rendir y continuá al pago del derecho de examen.
            </p>
          </div>
          <aside className="border-l-4 border-[#2CBEE7] bg-[#E0ECF8]/55 p-6">
            <p className="font-semibold text-[#123A50]">Antes de comenzar</p>
            <p className="mt-3 text-sm leading-6 text-[#52606D]">
              Tené a mano tu DNI y verificá las fechas y llamados publicados por el instituto. Podés incluir hasta ocho materias en una misma solicitud.
            </p>
          </aside>
        </div>
      </section>

      <section className="border-b border-[#D8E1E8] bg-white">
        <div className="mx-auto grid max-w-7xl gap-px bg-[#D8E1E8] md:grid-cols-3">
          {assurances.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4 bg-white px-6 py-7 lg:px-8">
              <Icon className="mt-0.5 size-5 shrink-0 text-[#0A496C]" />
              <div><p className="font-semibold text-[#123A50]">{title}</p><p className="mt-1 text-sm leading-6 text-[#64748B]">{text}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-12 lg:px-8 lg:py-16">
        <Suspense fallback={<div className="rounded-2xl border border-[#D8E1E8] bg-white p-12 text-center text-[#64748B]">Preparando el formulario…</div>}>
          <ExamPermitForm />
        </Suspense>
      </section>
    </main>
  );
}
