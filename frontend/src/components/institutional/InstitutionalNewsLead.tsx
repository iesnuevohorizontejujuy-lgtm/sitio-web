import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Newspaper } from "lucide-react";
import {
  formatInstitutionalDate,
  getInstitutionalExcerpt,
  getInstitutionalItemDate,
  institutionalCategoryLabels,
  isInstitutionalEvent,
} from "@/lib/institutional-news";
import type { InstitutionalNewsItem } from "@/types/institutional-news";

export function InstitutionalNewsLead({ featured, secondary }: { featured: InstitutionalNewsItem; secondary: InstitutionalNewsItem[] }) {
  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <article className="group min-w-0 border-b border-[#C6D7E5] pb-8 lg:col-span-8">
        <Link href={`/vida-institucional/${featured.slug}`} className="relative block aspect-[16/9] overflow-hidden rounded-lg bg-[#E0ECF8] sm:aspect-[16/8]">
          {featured.imagen_principal ? (
            <Image src={featured.imagen_principal} alt={featured.titulo} fill priority sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
          ) : (
            <span className="grid h-full place-items-center text-[#0A496C]"><Newspaper className="size-16" aria-hidden="true" /></span>
          )}
        </Link>
        <div className="pt-6">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#0A6F94]">
            <span>{institutionalCategoryLabels[featured.categoria]}</span>
            <span className="size-1 rounded-full bg-[#2CBEE7]" aria-hidden="true" />
            <time dateTime={getInstitutionalItemDate(featured)}>{formatInstitutionalDate(getInstitutionalItemDate(featured))}</time>
          </div>
          <h2 className="mt-4 max-w-4xl text-balance text-3xl font-semibold leading-[1.12] tracking-[-0.03em] text-[#0A496C] sm:text-4xl">{featured.titulo}</h2>
          <p className="mt-4 max-w-3xl line-clamp-3 text-pretty leading-7 text-[#52606D]">{getInstitutionalExcerpt(featured, 260)}</p>
          <Link href={`/vida-institucional/${featured.slug}`} className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-[#0A496C] underline decoration-[#2CBEE7] decoration-2 underline-offset-4">
            Leer publicación destacada
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </article>

      {secondary.length > 0 ? (
        <aside className="grid min-w-0 self-start gap-0 border-t border-[#C6D7E5] sm:grid-cols-2 sm:gap-6 sm:border-t-0 lg:col-span-4 lg:grid-cols-1 lg:gap-0 lg:border-t" aria-label="Otras publicaciones destacadas">
          {secondary.map((item) => <SecondaryStory key={item.id} item={item} />)}
        </aside>
      ) : null}
    </div>
  );
}

function SecondaryStory({ item }: { item: InstitutionalNewsItem }) {
  const href = `/vida-institucional/${item.slug}`;
  return (
    <article className="group grid min-w-0 gap-5 border-b border-[#C6D7E5] py-6 sm:grid-rows-[150px_1fr] lg:grid-cols-[150px_1fr] lg:grid-rows-1">
      <Link href={href} tabIndex={-1} aria-hidden="true" className="relative min-h-32 overflow-hidden rounded-md bg-[#E0ECF8]">
        {item.imagen_thumb || item.imagen_principal ? (
          <Image src={item.imagen_thumb || item.imagen_principal || ""} alt="" fill sizes="(max-width: 1024px) 50vw, 132px" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        ) : (
          <span className="grid h-full place-items-center text-[#0A496C]">{isInstitutionalEvent(item) ? <CalendarDays className="size-8" aria-hidden="true" /> : <Newspaper className="size-8" aria-hidden="true" />}</span>
        )}
      </Link>
      <div className="min-w-0 py-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#0A6F94]">{institutionalCategoryLabels[item.categoria]}</p>
        <h3 className="mt-2 line-clamp-3 text-balance text-lg font-semibold leading-snug tracking-[-0.015em] text-[#0A496C]">
          <Link href={href} className="hover:underline">{item.titulo}</Link>
        </h3>
        <time dateTime={getInstitutionalItemDate(item)} className="mt-3 block text-xs text-[#52606D]">{formatInstitutionalDate(getInstitutionalItemDate(item))}</time>
      </div>
    </article>
  );
}
