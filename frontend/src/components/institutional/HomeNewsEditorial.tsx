"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarDays, Newspaper } from "lucide-react";
import {
  formatInstitutionalDate,
  stripInstitutionalHtml,
} from "@/lib/institutional-news";
import type { InstitutionalNewsItem } from "@/types/institutional-news";

interface HomeNewsEditorialProps {
  items: InstitutionalNewsItem[];
}

export function HomeNewsEditorial({ items }: HomeNewsEditorialProps) {
  const reduceMotion = useReducedMotion();
  const featured = items[0];
  const secondary = items.slice(1, 4);

  if (!featured) return null;

  return (
    <>
      {items.length > 1 && (
        <p className="mt-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B] lg:hidden">Deslizá para ver más <ArrowRight className="size-4" /></p>
      )}
      <div className={`${items.length > 1 ? "mt-4 lg:mt-10" : "mt-10"} flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-12 lg:gap-6 lg:overflow-visible lg:pb-0`}>
      <motion.article
        className={`group min-w-[88%] snap-start overflow-hidden rounded-2xl border border-[#B7CADB] bg-white ${secondary.length > 0 ? "lg:col-span-7" : "lg:col-span-12 lg:grid lg:grid-cols-2"}`}
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <NewsImage item={featured} featured />
        <div className="flex min-h-64 flex-col p-7 md:p-9">
          <NewsMeta item={featured} />
          <h3 className="mt-5 text-2xl font-semibold leading-tight tracking-[-0.025em] text-[#0A496C] md:text-3xl">
            <Link href={`/vida-institucional/${featured.slug}`} className="hover:underline">{featured.titulo}</Link>
          </h3>
          {stripInstitutionalHtml(featured.contenido) && (
            <p className="mt-4 line-clamp-3 max-w-2xl leading-7 text-[#52606D]">{stripInstitutionalHtml(featured.contenido)}</p>
          )}
          <Link href={`/vida-institucional/${featured.slug}`} className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-semibold text-[#0A496C]">
            Leer publicación <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.article>

      {secondary.length > 0 && (
        <div className="contents lg:col-span-5 lg:grid lg:self-start lg:gap-4">
          {secondary.map((item, index) => (
            <motion.article
              key={item.id}
              className={`group grid min-w-[82%] snap-start grid-rows-[180px_1fr] overflow-hidden rounded-xl border border-[#CBD5E1] bg-white sm:min-w-[62%] lg:min-w-0 ${secondary.length === 1 ? "lg:grid-cols-1 lg:grid-rows-[260px_1fr]" : "lg:grid-cols-[150px_1fr] lg:grid-rows-1"}`}
              initial={reduceMotion ? false : { opacity: 0, x: 16 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.07 }}
            >
              <NewsImage item={item} />
              <div className="flex flex-col p-5">
                <NewsMeta item={item} compact />
                <h3 className="mt-3 text-lg font-semibold leading-tight text-[#0A496C]">
                  <Link href={`/vida-institucional/${item.slug}`} className="hover:underline">{item.titulo}</Link>
                </h3>
                <Link href={`/vida-institucional/${item.slug}`} aria-label={`Leer ${item.titulo}`} className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-[#0A496C]">
                  Ver más <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      )}
      </div>
    </>
  );
}

function NewsImage({ item, featured = false }: { item: InstitutionalNewsItem; featured?: boolean }) {
  const isEvent = item.categoria === "fecha_importante";

  return (
    <Link href={`/vida-institucional/${item.slug}`} className={`relative block overflow-hidden bg-[#E0ECF8] ${featured ? "aspect-[16/10] lg:aspect-[16/9]" : "min-h-full"}`}>
      {item.imagen_principal ? (
        <Image src={item.imagen_principal} alt={item.titulo} fill unoptimized sizes={featured ? "(max-width: 1024px) 90vw, 58vw" : "(max-width: 1024px) 70vw, 150px"} className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
      ) : (
        <span className="flex h-full min-h-44 items-center justify-center text-[#0A496C]">
          {isEvent ? <CalendarDays className="size-10" /> : <Newspaper className="size-10" />}
        </span>
      )}
    </Link>
  );
}

function NewsMeta({ item, compact = false }: { item: InstitutionalNewsItem; compact?: boolean }) {
  const isEvent = item.categoria === "fecha_importante";
  const date = isEvent && item.fecha_evento ? item.fecha_evento : item.created_at;

  return (
    <div className={`flex flex-wrap items-center gap-2 font-semibold uppercase tracking-[0.12em] ${compact ? "text-[10px]" : "text-xs"}`}>
      <span className="text-[#0A496C]">{isEvent ? "Agenda" : "Actualidad"}</span>
      <span className="size-1 rounded-full bg-[#2CBEE7]" />
      <time dateTime={date} className="text-[#64748B]">{formatInstitutionalDate(date)}</time>
    </div>
  );
}
