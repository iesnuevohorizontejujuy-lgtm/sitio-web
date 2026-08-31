import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Newspaper } from "lucide-react";
import {
  formatInstitutionalDate,
  getInstitutionalDateParts,
  getInstitutionalExcerpt,
  getInstitutionalItemDate,
  institutionalCategoryLabels,
  isInstitutionalEvent,
} from "@/lib/institutional-news";
import type { InstitutionalNewsItem } from "@/types/institutional-news";

interface InstitutionalNewsCardProps {
  item: InstitutionalNewsItem;
  featured?: boolean;
  variant?: "card" | "row";
}

export function InstitutionalNewsCard({ item, featured = false, variant = "card" }: InstitutionalNewsCardProps) {
  const isEvent = isInstitutionalEvent(item);
  const date = getInstitutionalItemDate(item);
  const excerpt = getInstitutionalExcerpt(item, featured ? 260 : 175);
  const href = `/vida-institucional/${item.slug}`;

  if (variant === "row") {
    const dateParts = getInstitutionalDateParts(date);
    return (
      <article className="group grid min-w-0 gap-5 border-t border-[#C6D7E5] py-6 sm:grid-cols-[72px_1fr] lg:grid-cols-[72px_1fr_190px] lg:items-center">
        <time dateTime={date} className="hidden border-r border-[#C6D7E5] pr-5 text-center sm:block">
          <span className="block text-3xl font-semibold tabular-nums tracking-[-0.04em] text-[#0A496C]">{dateParts.day}</span>
          <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0A6F94]">{dateParts.month} {dateParts.year}</span>
        </time>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#0A6F94]">
            <span>{institutionalCategoryLabels[item.categoria]}</span>
            <span className="sm:hidden">· {formatInstitutionalDate(date)}</span>
          </div>
          <h3 className="mt-2 text-balance text-xl font-semibold leading-snug tracking-[-0.02em] text-[#0A496C]">
            <Link href={href} className="hover:underline">{item.titulo}</Link>
          </h3>
          {excerpt ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#52606D]">{excerpt}</p> : null}
          <Link href={href} className="mt-3 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#0A496C] underline decoration-[#2CBEE7] decoration-2 underline-offset-4">
            Leer publicación <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
        <Link href={href} tabIndex={-1} aria-hidden="true" className="relative hidden aspect-[16/10] overflow-hidden rounded-lg bg-[#E0ECF8] lg:block">
          {item.imagen_thumb || item.imagen_principal ? (
            <Image src={item.imagen_thumb || item.imagen_principal || ""} alt="" fill sizes="190px" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
          ) : (
            <span className="grid h-full place-items-center text-[#0A496C]">{isEvent ? <CalendarDays className="size-8" aria-hidden="true" /> : <Newspaper className="size-8" aria-hidden="true" />}</span>
          )}
        </Link>
      </article>
    );
  }

  return (
    <article className={`group flex h-full min-w-0 flex-col border-t-[3px] border-[#0A496C] pt-4 ${featured ? "md:grid md:grid-cols-2" : ""}`}>
      <Link href={href} className={`relative block overflow-hidden rounded-md bg-[#E0ECF8] ${featured ? "min-h-72" : "aspect-[16/9]"}`}>
        {item.imagen_principal ? (
          <Image src={item.imagen_principal} alt={item.titulo} fill sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"} className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        ) : (
          <span className="flex h-full items-center justify-center text-[#0A496C]">{isEvent ? <CalendarDays className="size-12" aria-hidden="true" /> : <Newspaper className="size-12" aria-hidden="true" />}</span>
        )}
      </Link>

      <div className={`flex flex-1 flex-col ${featured ? "py-7 md:px-8 md:py-2" : "pt-5"}`}>
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.12em]">
          <span className="text-[#0A6F94]">{institutionalCategoryLabels[item.categoria]}</span>
          <span className="size-1 rounded-full bg-[#2CBEE7]" aria-hidden="true" />
          <time dateTime={date} className="text-[#52606D]">{formatInstitutionalDate(date)}</time>
        </div>
        <h3 className={`${featured ? "mt-5 text-3xl" : "mt-3 text-xl"} text-balance font-semibold leading-tight tracking-[-0.02em] text-[#0A496C]`}>
          <Link href={href} className="hover:underline">{item.titulo}</Link>
        </h3>
        {excerpt ? <p className={`mt-3 leading-6 text-[#52606D] ${featured ? "line-clamp-4" : "line-clamp-3 text-sm"}`}>{excerpt}</p> : null}
        <Link href={href} className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 text-sm font-semibold text-[#0A496C] underline decoration-[#2CBEE7] decoration-2 underline-offset-4">
          Leer publicación <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
