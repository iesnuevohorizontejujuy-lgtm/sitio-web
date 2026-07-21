import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Newspaper } from "lucide-react";
import {
  formatInstitutionalDate,
  stripInstitutionalHtml,
} from "@/lib/institutional-news";
import type { InstitutionalNewsItem } from "@/types/institutional-news";

interface InstitutionalNewsCardProps {
  item: InstitutionalNewsItem;
  featured?: boolean;
}

export function InstitutionalNewsCard({
  item,
  featured = false,
}: InstitutionalNewsCardProps) {
  const isEvent = item.categoria === "fecha_importante";
  const date = isEvent && item.fecha_evento
    ? item.fecha_evento
    : item.created_at;
  const excerpt = stripInstitutionalHtml(item.contenido);
  const categoryLabel = {
    general: "Actualidad",
    actividad: "Actividad",
    jornada: "Jornada",
    practica: "Práctica profesional",
    convenio: "Convenio",
    fecha_importante: "Agenda",
  }[item.categoria];

  return (
    <article className={`group overflow-hidden rounded-xl border border-[#CBD5E1] bg-white ${featured ? "md:grid md:grid-cols-2" : "flex h-full flex-col"}`}>
      <Link
        href={`/vida-institucional/${item.slug}`}
        className={`relative block overflow-hidden bg-[#E0ECF8] ${featured ? "min-h-72" : "aspect-[16/10]"}`}
      >
        {item.imagen_principal ? (
          <Image
            src={item.imagen_principal}
            alt={item.titulo}
            fill
            unoptimized
            sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#0A496C]">
            {isEvent ? <CalendarDays className="size-12" /> : <Newspaper className="size-12" />}
          </div>
        )}
      </Link>

      <div className={`flex flex-1 flex-col ${featured ? "p-8 md:p-10" : "p-6"}`}>
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.12em]">
          <span className="text-[#0A496C]">{categoryLabel}</span>
          <span className="size-1 rounded-full bg-[#2CBEE7]" />
          <time dateTime={date} className="text-[#64748B]">{formatInstitutionalDate(date)}</time>
        </div>
        <h2 className={`${featured ? "mt-5 text-3xl" : "mt-4 text-xl"} font-semibold leading-tight tracking-[-0.02em] text-[#0A496C]`}>
          <Link href={`/vida-institucional/${item.slug}`} className="hover:underline">
            {item.titulo}
          </Link>
        </h2>
        {excerpt && (
          <p className={`mt-4 leading-7 text-[#52606D] ${featured ? "line-clamp-4" : "line-clamp-3"}`}>
            {excerpt}
          </p>
        )}
        <Link href={`/vida-institucional/${item.slug}`} className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-semibold text-[#0A496C]">
          Leer publicación <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
