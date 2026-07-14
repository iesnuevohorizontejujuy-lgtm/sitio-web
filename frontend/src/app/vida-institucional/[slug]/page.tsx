import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3, PlayCircle } from "lucide-react";
import {
  formatInstitutionalDate,
  getInstitutionalNewsItem,
  stripInstitutionalHtml,
} from "@/lib/institutional-news";

interface InstitutionalNewsDetailProps {
  params: Promise<{ slug: string }>;
}

function getYouTubeEmbed(url: string | null): string | null {
  if (!url) return null;
  const match = url.match(/^.*(?:youtu\.be\/|v\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/);
  return match?.[1]?.length === 11
    ? `https://www.youtube.com/embed/${match[1]}`
    : null;
}

export async function generateMetadata({ params }: InstitutionalNewsDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getInstitutionalNewsItem(slug);

  return item
    ? {
        title: `${item.titulo} | IES Nuevo Horizonte`,
        description: stripInstitutionalHtml(item.contenido).slice(0, 155),
      }
    : { title: "Publicación no encontrada | IES Nuevo Horizonte" };
}

export default async function InstitutionalNewsDetail({ params }: InstitutionalNewsDetailProps) {
  const { slug } = await params;
  const item = await getInstitutionalNewsItem(slug);
  if (!item) notFound();

  const isEvent = item.categoria === "fecha_importante";
  const embedUrl = getYouTubeEmbed(item.video_url);
  const cleanContent = item.contenido.replace(
    /[\w-]+\.(jpg|jpeg|png|webp|gif)\s+\d+(\.\d+)?\s*(KB|MB|GB)/gi,
    "",
  );
  const words = stripInstitutionalHtml(cleanContent).split(" ").filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(words / 220));

  return (
    <main className="institutional-shell bg-white text-[#121C28]">
      <div className="border-b border-[#D8E1E8]">
        <div className="mx-auto max-w-5xl px-5 py-6 lg:px-8">
          <Link href="/vida-institucional" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A496C]">
            <ArrowLeft className="size-4" /> Volver a Vida institucional
          </Link>
        </div>
      </div>

      <article className="mx-auto max-w-5xl px-5 py-14 md:py-20 lg:px-8">
        <header className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em]">
            <span className="text-[#0A496C]">{isEvent ? "Agenda institucional" : "Actualidad institucional"}</span>
            <span className="size-1 rounded-full bg-[#2CBEE7]" />
            <time dateTime={item.created_at} className="text-[#64748B]">Publicado el {formatInstitutionalDate(item.created_at)}</time>
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-[#0A496C] md:text-6xl">{item.titulo}</h1>
          <div className="mt-7 flex flex-wrap gap-5 border-t border-[#D8E1E8] pt-5 text-sm text-[#52606D]">
            <span className="inline-flex items-center gap-2"><Clock3 className="size-4 text-[#0A496C]" />{readingTime} min de lectura</span>
            {isEvent && item.fecha_evento && (
              <span className="inline-flex items-center gap-2 font-semibold text-[#0A496C]"><CalendarDays className="size-4" />Fecha: {formatInstitutionalDate(item.fecha_evento)}</span>
            )}
          </div>
        </header>

        {item.imagen_principal && (
          <div className="relative mt-10 aspect-[16/8] overflow-hidden rounded-2xl border border-[#CBD5E1] bg-[#E0ECF8]">
            <Image src={item.imagen_principal} alt={item.titulo} fill priority unoptimized sizes="(max-width: 1024px) 100vw, 960px" className="object-cover" />
          </div>
        )}

        {isEvent && item.fecha_evento && (
          <div className="mt-10 flex items-start gap-4 rounded-xl border border-[#B7CADB] bg-[#E0ECF8] p-6">
            <CalendarDays className="mt-0.5 size-6 shrink-0 text-[#0A496C]" />
            <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0A496C]">Fecha importante</p><p className="mt-2 text-lg font-semibold text-[#0A496C]">{formatInstitutionalDate(item.fecha_evento)}</p></div>
          </div>
        )}

        {item.video_url && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-[#0A496C]">Material audiovisual</h2>
            <div className="mt-5 aspect-video overflow-hidden rounded-2xl bg-[#073A57]">
              {embedUrl ? (
                <iframe className="h-full w-full" src={embedUrl} title={`Video relacionado con ${item.titulo}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-white"><PlayCircle className="size-12" /><a href={item.video_url} target="_blank" rel="noreferrer" className="rounded-lg border border-white/40 px-5 py-3 font-semibold">Ver video</a></div>
              )}
            </div>
          </section>
        )}

        <div className="mt-12 border-t border-[#D8E1E8] pt-10">
          <div className="rich-text-container mx-auto max-w-3xl text-[17px] leading-8 text-[#334155] [&_a]:font-semibold [&_a]:text-[#0A496C] [&_a]:underline [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-[#2CBEE7] [&_blockquote]:bg-[#F7F9FB] [&_blockquote]:p-5 [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-[#0A496C] [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-[#0A496C] [&_img]:my-8 [&_img]:rounded-xl [&_li]:mb-2 [&_ol]:my-6 [&_ol]:pl-6 [&_p]:mb-6 [&_strong]:text-[#121C28] [&_ul]:my-6 [&_ul]:pl-6" dangerouslySetInnerHTML={{ __html: cleanContent }} />
        </div>
      </article>
    </main>
  );
}
