import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { formatInstitutionalDate, getInstitutionalDateParts } from "@/lib/institutional-news";
import type { InstitutionalNewsItem } from "@/types/institutional-news";

export function InstitutionalAgenda({ items }: { items: InstitutionalNewsItem[] }) {
  if (items.length === 0) {
    return <p className="mt-8 border-l-4 border-[#2CBEE7] bg-white p-6 text-[#52606D]">No hay nuevas fechas publicadas por el momento.</p>;
  }

  return (
    <div className="mt-10 divide-y divide-[#C6D7E5] border-y border-[#C6D7E5]">
      {items.map((item) => <AgendaItem key={item.id} item={item} />)}
    </div>
  );
}

function AgendaItem({ item }: { item: InstitutionalNewsItem }) {
  const date = item.fecha_evento || item.created_at;
  const parts = getInstitutionalDateParts(date);
  const status = getEventStatus(item);

  return (
    <article className="group grid gap-5 py-7 sm:grid-cols-[88px_1fr] lg:grid-cols-[104px_1fr_auto] lg:items-center lg:gap-8">
      <time dateTime={date} className="flex items-baseline gap-2 border-[#C6D7E5] sm:block sm:border-r sm:pr-6 sm:text-center">
        <span className="text-4xl font-semibold tabular-nums tracking-[-0.05em] text-[#0A496C]">{parts.day}</span>
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0A6F94] sm:mt-1 sm:block">{parts.month} {parts.year}</span>
      </time>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.12em]">
          <span className="text-[#0A6F94]">Agenda institucional</span>
          <span className={`rounded-md px-2 py-1 ${status.tone}`}>{status.label}</span>
        </div>
        <h3 className="mt-3 text-balance text-xl font-semibold leading-snug tracking-[-0.02em] text-[#0A496C]">
          <Link href={`/vida-institucional/${item.slug}`} className="hover:underline">{item.titulo}</Link>
        </h3>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#52606D]">
          <span className="inline-flex items-center gap-2"><CalendarDays className="size-4 text-[#0A6F94]" aria-hidden="true" />{formatEventRange(item)}</span>
          {item.lugar_evento ? <span className="inline-flex items-center gap-2"><MapPin className="size-4 text-[#0A6F94]" aria-hidden="true" />{item.lugar_evento}</span> : null}
        </div>
      </div>
      <Link href={`/vida-institucional/${item.slug}`} className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-semibold text-[#0A496C] underline decoration-[#2CBEE7] decoration-2 underline-offset-4">
        Ver actividad <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </Link>
    </article>
  );
}

function formatEventRange(item: InstitutionalNewsItem): string {
  if (!item.fecha_evento) return "Fecha a confirmar";
  if (!item.fecha_fin_evento || item.fecha_fin_evento === item.fecha_evento) return formatInstitutionalDate(item.fecha_evento);
  return `${formatInstitutionalDate(item.fecha_evento)} al ${formatInstitutionalDate(item.fecha_fin_evento)}`;
}

function getEventStatus(item: InstitutionalNewsItem): { label: string; tone: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = item.fecha_evento ? new Date(`${item.fecha_evento}T00:00:00`) : null;
  const end = item.fecha_fin_evento ? new Date(`${item.fecha_fin_evento}T23:59:59`) : start;

  if (start && start <= today && end && end >= today) return { label: "En curso", tone: "bg-[#E0ECF8] text-[#0A496C]" };
  if (end && end < today) return { label: "Finalizada", tone: "bg-[#EEF1F4] text-[#52606D]" };
  return { label: "Próximamente", tone: "bg-[#E7F7FC] text-[#075985]" };
}
