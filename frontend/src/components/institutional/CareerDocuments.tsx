import { Download, FileText, ShieldCheck } from "lucide-react";
import type { Career } from "@/types/career";

export function CareerDocuments({ career }: { career: Career }) {
  return (
    <section id="documentacion" aria-labelledby="documents-heading" className="institutional-surface-canvas scroll-mt-56 py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid overflow-hidden rounded-2xl border border-[#C6D7E5] bg-white lg:grid-cols-12">
          <div className="bg-[#073A57] p-8 text-white sm:p-10 lg:col-span-4">
            <ShieldCheck className="size-9 text-[#8CDDF3]" aria-hidden="true" />
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#8CDDF3]">Información académica oficial</p>
            <h2 id="documents-heading" className="mt-3 text-balance text-3xl font-semibold tracking-[-0.025em]">Título y documentación</h2>
            <p className="mt-4 text-sm leading-6 text-white/75">Consultá los documentos publicados por el Instituto de Educación Superior Nuevo Horizonte.</p>
          </div>
          <div className="grid gap-7 p-8 sm:p-10 lg:col-span-8">
            <dl className="grid gap-6 sm:grid-cols-2">
              <DocumentDatum label="Título que otorga" value={career.awardedTitle || "Título oficial"} />
              <DocumentDatum label="Resolución ministerial" value={career.resolutionCode ?? "Pendiente de publicación"} />
            </dl>
            <div className="flex flex-col gap-3 border-t border-[#D8E1E8] pt-7 sm:flex-row">
              <DocumentLink href={career.planStudyUrl} label="Descargar plan de estudios" icon={Download} />
              <DocumentLink href={career.resolutionUrl} label="Ver resolución ministerial" icon={FileText} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DocumentDatum({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.13em] text-[#52606D]">{label}</dt>
      <dd className="mt-2 text-lg font-semibold leading-7 text-[#0A496C]">{value}</dd>
    </div>
  );
}

function DocumentLink({ href, label, icon: Icon }: { href?: string | null; label: string; icon: typeof Download }) {
  if (!href) {
    return (
      <span aria-disabled="true" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#AFC4D8] bg-[#F4F7F9] px-4 py-3 text-sm font-semibold text-[#52606D]">
        <Icon className="size-4" aria-hidden="true" />
        {label} · próximamente
      </span>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#0A496C] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#073A57]">
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </a>
  );
}
