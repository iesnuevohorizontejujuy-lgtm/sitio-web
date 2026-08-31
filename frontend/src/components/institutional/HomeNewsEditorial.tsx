import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Newspaper } from "lucide-react";
import { formatInstitutionalDate, getInstitutionalDateParts, stripInstitutionalHtml } from "@/lib/institutional-news";
import type { InstitutionalNewsItem } from "@/types/institutional-news";

interface HomeNewsEditorialProps {
  featuredItems: InstitutionalNewsItem[];
  newsItems: InstitutionalNewsItem[];
  agendaItems: InstitutionalNewsItem[];
}

const categoryLabels: Record<InstitutionalNewsItem["categoria"], string> = {
  general: "Actualidad",
  actividad: "Actividad",
  jornada: "Jornada",
  practica: "Práctica profesional",
  convenio: "Convenio",
  fecha_importante: "Agenda",
};

const agendaTones = ["bg-[#0A496C]", "bg-[#123D68]", "bg-[#0A6F94]", "bg-[#2B789A]"] as const;

export function HomeNewsEditorial({ featuredItems, newsItems, agendaItems }: HomeNewsEditorialProps) {
  const lead = featuredItems[0] ?? newsItems[0];
  const secondary = [...featuredItems.slice(1), ...newsItems]
    .filter((item, index, items) => item.id !== lead?.id && items.findIndex((candidate) => candidate.id === item.id) === index)
    .slice(0, 4);
  const agenda = agendaItems.slice(0, 4);

  if (!lead && agenda.length === 0) return null;

  return (
    <div className="mt-10 min-w-0">
      <section aria-labelledby="home-agenda-title">
        <div className="flex items-end justify-between gap-5 border-b border-[#C6D7E5] pb-4">
          <h3 id="home-agenda-title" className="flex items-center gap-3 text-2xl font-semibold tracking-[-0.02em] text-[#0A496C]"><CalendarDays className="size-6 text-[#0A6F94]" aria-hidden="true" />Agenda</h3>
          <Link href="/vida-institucional#agenda" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0A496C]">Ver todos los eventos <ArrowRight className="size-4" aria-hidden="true" /></Link>
        </div>
        {agenda.length > 0 ? (
          <div className={`mt-6 grid gap-5 sm:grid-cols-2 ${agenda.length > 2 ? "lg:grid-cols-4" : ""}`}>
            {agenda.map((item, index) => <AgendaCard key={item.id} item={item} tone={agendaTones[index % agendaTones.length]} />)}
          </div>
        ) : (
          <p className="mt-6 border-l-4 border-[#2CBEE7] bg-white p-6 text-sm leading-6 text-[#52606D]">No hay próximas fechas publicadas por el momento.</p>
        )}
      </section>

      {lead ? (
        <section className="mt-14" aria-labelledby="home-news-title">
          <div className="flex items-end justify-between gap-5 border-b border-[#C6D7E5] pb-4">
            <h3 id="home-news-title" className="flex items-center gap-3 text-2xl font-semibold tracking-[-0.02em] text-[#0A496C]"><Newspaper className="size-6 text-[#0A6F94]" aria-hidden="true" />Noticias</h3>
            <Link href="/vida-institucional" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0A496C]">Ver todas las noticias <ArrowRight className="size-4" aria-hidden="true" /></Link>
          </div>

          <div className="mt-6 grid items-start gap-6 lg:grid-cols-12">
            <article className="group overflow-hidden rounded-xl border border-[#C6D7E5] bg-white lg:col-span-8">
              <Link href={`/vida-institucional/${lead.slug}`} className="relative block aspect-[16/8] overflow-hidden bg-[#E0ECF8]">
                {lead.imagen_principal ? <Image src={lead.imagen_principal} alt={lead.titulo} fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" /> : <span className="grid h-full place-items-center text-[#0A496C]"><Newspaper className="size-14" aria-hidden="true" /></span>}
                <span className="absolute bottom-0 left-0 bg-[#0A496C] px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white">{categoryLabels[lead.categoria]}</span>
              </Link>
              <div className="p-6 sm:p-8">
                <NewsMeta item={lead} hideCategory />
                <h4 className="mt-3 text-balance text-2xl font-semibold leading-tight tracking-[-0.025em] text-[#0A496C] sm:text-3xl"><Link href={`/vida-institucional/${lead.slug}`} className="hover:underline">{lead.titulo}</Link></h4>
                <p className="mt-4 line-clamp-3 max-w-4xl leading-7 text-[#52606D]">{stripInstitutionalHtml(lead.contenido)}</p>
              </div>
            </article>

            {secondary.length > 0 ? (
              <div className="grid self-start gap-5 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
                {secondary.slice(0, 2).map((item) => <NewsCard key={item.id} item={item} />)}
              </div>
            ) : null}
          </div>

          {secondary.length > 2 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {secondary.slice(2).map((item) => <NewsCard key={item.id} item={item} horizontal />)}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

function AgendaCard({ item, tone }: { item: InstitutionalNewsItem; tone: string }) {
  const parts = item.fecha_evento ? getInstitutionalDateParts(item.fecha_evento) : null;
  return (
    <article className="group flex min-h-80 flex-col overflow-hidden rounded-lg border border-[#C6D7E5] bg-white shadow-[0_6px_18px_rgba(10,73,108,0.07)]">
      <div className={`${tone} min-h-28 px-5 py-5 text-white`}>
        {parts ? <time dateTime={item.fecha_evento ?? undefined}><span className="block text-5xl font-light leading-none tracking-[-0.05em]">{parts.day}</span><span className="mt-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/80">{parts.month} {parts.year}</span></time> : <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/85">Fecha a confirmar</p>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h4 className="text-lg font-semibold leading-snug text-[#0A496C]"><Link href={`/vida-institucional/${item.slug}`} className="hover:underline">{item.titulo}</Link></h4>
        {item.lugar_evento ? <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-[#52606D]"><MapPin className="mt-1 size-4 shrink-0 text-[#0A6F94]" aria-hidden="true" />{item.lugar_evento}</p> : null}
        <Link href={`/vida-institucional/${item.slug}`} className="mt-auto inline-flex min-h-11 items-end gap-2 pt-5 text-sm font-semibold text-[#0A496C]">Ver actividad <ArrowRight className="mb-0.5 size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></Link>
      </div>
    </article>
  );
}

function NewsCard({ item, horizontal = false }: { item: InstitutionalNewsItem; horizontal?: boolean }) {
  return (
    <article className={`group overflow-hidden rounded-lg border border-[#C6D7E5] bg-white ${horizontal ? "sm:grid sm:grid-cols-[180px_1fr]" : "grid grid-cols-[132px_1fr]"}`}>
      <Link href={`/vida-institucional/${item.slug}`} className="relative min-h-36 overflow-hidden bg-[#E0ECF8]">
        {item.imagen_thumb || item.imagen_principal ? <Image src={item.imagen_thumb || item.imagen_principal || ""} alt={item.titulo} fill sizes={horizontal ? "180px" : "132px"} className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" /> : <span className="grid h-full place-items-center text-[#0A496C]"><Newspaper className="size-8" aria-hidden="true" /></span>}
      </Link>
      <div className="min-w-0 p-5"><NewsMeta item={item} /><h4 className="mt-2 line-clamp-3 text-balance font-semibold leading-snug text-[#0A496C]"><Link href={`/vida-institucional/${item.slug}`} className="hover:underline">{item.titulo}</Link></h4></div>
    </article>
  );
}

function NewsMeta({ item, hideCategory = false }: { item: InstitutionalNewsItem; hideCategory?: boolean }) {
  const date = item.publicada_at ?? item.created_at;
  return <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#64748B]">{hideCategory ? null : <><span className="text-[#0A6F94]">{categoryLabels[item.categoria]}</span><span className="px-2 text-[#2CBEE7]">/</span></>}<time dateTime={date}>{formatInstitutionalDate(date)}</time></p>;
}
