import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, MapPin, PlayCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { InstitutionalNewsCard } from "@/components/institutional/InstitutionalNewsCard";
import { InstitutionalShareTools } from "@/components/institutional/InstitutionalShareTools";
import {
  formatInstitutionalDate,
  getInstitutionalNews,
  getInstitutionalNewsItem,
  institutionalCategoryLabels,
  isInstitutionalEvent,
  stripInstitutionalHtml,
} from "@/lib/institutional-news";
import type { InstitutionalNewsItem } from "@/types/institutional-news";

interface InstitutionalNewsDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: InstitutionalNewsDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getInstitutionalNewsItem(slug);

  return item
    ? {
        title: item.titulo,
        description: stripInstitutionalHtml(item.contenido).slice(0, 155),
        alternates: { canonical: `/vida-institucional/${item.slug}` },
        openGraph: {
          type: "article",
          title: item.titulo,
          description: stripInstitutionalHtml(item.contenido).slice(0, 155),
          url: `/vida-institucional/${item.slug}`,
          publishedTime: item.publicada_at || item.created_at,
          images: item.imagen_principal ? [{ url: item.imagen_principal, alt: item.titulo }] : undefined,
        },
      }
    : { title: "Publicación no encontrada", robots: { index: false, follow: false } };
}

export default async function InstitutionalNewsDetail({ params }: InstitutionalNewsDetailProps) {
  const { slug } = await params;
  const [item, collection] = await Promise.all([getInstitutionalNewsItem(slug), getInstitutionalNews()]);
  if (!item) notFound();

  const isEvent = isInstitutionalEvent(item);
  const cleanContent = cleanInstitutionalContent(item.contenido);
  const words = stripInstitutionalHtml(cleanContent).split(" ").filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(words / 220));
  const embedUrl = getVideoEmbedUrl(item.video_url);
  const related = getRelatedItems(item, [...collection.noticias, ...collection.agenda]);
  const publicationDate = item.publicada_at || item.created_at;

  return (
    <main className="institutional-shell text-[#121C28]">
      <div className="institutional-surface-muted border-b border-[#D8E1E8]">
        <div className="mx-auto max-w-7xl px-5 py-5 lg:px-8">
          <Link href="/vida-institucional" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0A496C]">
            <ArrowLeft className="size-4" aria-hidden="true" /> Volver a Vida institucional
          </Link>
        </div>
      </div>

      <article>
        <header className="institutional-surface-canvas px-5 pb-12 pt-14 lg:px-8 lg:pb-16 lg:pt-20">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-5xl">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em]">
                <span className="text-[#0A6F94]">{institutionalCategoryLabels[item.categoria]}</span>
                <span className="size-1 rounded-full bg-[#2CBEE7]" aria-hidden="true" />
                <time dateTime={publicationDate} className="text-[#52606D]">Publicado el {formatInstitutionalDate(publicationDate)}</time>
              </div>
              <h1 className="mt-6 max-w-5xl text-balance text-4xl font-bold leading-[1.06] tracking-[-0.04em] text-[#0A496C] sm:text-5xl lg:text-7xl">{item.titulo}</h1>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#D8E1E8] pt-5 text-sm text-[#52606D]">
                <span className="inline-flex items-center gap-2"><Clock3 className="size-4 text-[#0A6F94]" aria-hidden="true" />{readingTime} min de lectura</span>
                <span>IES Nuevo Horizonte · San Salvador de Jujuy</span>
              </div>
            </div>
          </div>
        </header>

        {item.imagen_principal ? (
          <div className="institutional-surface-canvas px-5 lg:px-8">
            <div className="relative mx-auto aspect-[16/9] max-w-7xl overflow-hidden rounded-2xl border border-[#C6D7E5] bg-[#E0ECF8] md:aspect-[16/8]">
              <Image src={item.imagen_principal} alt={item.titulo} fill priority sizes="(max-width: 1280px) 100vw, 1280px" className="object-cover" />
            </div>
          </div>
        ) : null}

        <div className={`institutional-surface-canvas px-5 pb-20 ${item.imagen_principal ? "pt-14" : "pt-4"} lg:px-8 lg:pb-24`}>
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 lg:gap-12">
            <aside className="lg:col-span-2" aria-label="Herramientas de publicación">
              <div className="lg:sticky lg:top-40">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.13em] text-[#52606D]">Compartir</p>
                <InstitutionalShareTools title={item.titulo} />
              </div>
            </aside>

            <div className="min-w-0 lg:col-span-7">
              <div className="rich-text-container break-words text-[17px] leading-8 text-[#334155] [&_a]:font-semibold [&_a]:text-[#0A496C] [&_a]:underline [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-[#2CBEE7] [&_blockquote]:bg-[#F4F7F9] [&_blockquote]:p-5 [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-balance [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-[#0A496C] [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-balance [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-[#0A496C] [&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl [&_li]:mb-2 [&_ol]:my-6 [&_ol]:pl-6 [&_p]:mb-6 [&_strong]:text-[#121C28] [&_ul]:my-6 [&_ul]:pl-6" dangerouslySetInnerHTML={{ __html: cleanContent }} />

              {item.video_url ? (
                <section className="mt-14 border-t border-[#D8E1E8] pt-10" aria-labelledby="video-heading">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0A6F94]">Contenido relacionado</p>
                  <h2 id="video-heading" className="mt-2 text-2xl font-semibold text-[#0A496C]">Material audiovisual</h2>
                  <div className="mt-5 aspect-video overflow-hidden rounded-xl bg-[#073A57]">
                    {embedUrl ? (
                      <iframe loading="lazy" className="h-full w-full" src={embedUrl} title={`Video relacionado con ${item.titulo}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-white"><PlayCircle className="size-12 text-[#8CDDF3]" aria-hidden="true" /><a href={item.video_url} target="_blank" rel="noreferrer" className="rounded-lg border border-white/40 px-5 py-3 font-semibold transition-colors hover:bg-white hover:text-[#073A57]">Ver video</a></div>
                    )}
                  </div>
                </section>
              ) : null}
            </div>

            <aside className="lg:col-span-3">
              {isEvent ? <EventInformation item={item} /> : <PublicationContext item={item} />}
            </aside>
          </div>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="institutional-surface-muted border-y border-[#D8E1E8] py-16 md:py-20" aria-labelledby="related-heading">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0A6F94]">Seguí explorando</p>
                <h2 id="related-heading" className="mt-3 text-balance text-3xl font-semibold tracking-[-0.025em] text-[#0A496C]">Más de Vida institucional</h2>
              </div>
              <Link href="/vida-institucional#publicaciones" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0A496C] underline decoration-[#2CBEE7] decoration-2 underline-offset-4">Ver todas las publicaciones <ArrowRight className="size-4" aria-hidden="true" /></Link>
            </div>
            <div className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((relatedItem) => <InstitutionalNewsCard key={relatedItem.id} item={relatedItem} />)}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

function EventInformation({ item }: { item: InstitutionalNewsItem }) {
  return (
    <div className="rounded-xl border-t-4 border-[#2CBEE7] bg-[#EAF2FB] p-6 lg:sticky lg:top-40">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0A6F94]">Información de la actividad</p>
      <dl className="mt-5 divide-y divide-[#C6D7E5]">
        <div className="py-4">
          <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#52606D]"><CalendarDays className="size-4" aria-hidden="true" />Fecha</dt>
          <dd className="mt-2 font-semibold leading-6 text-[#0A496C]">{formatEventRange(item)}</dd>
        </div>
        {item.lugar_evento ? (
          <div className="py-4">
            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#52606D]"><MapPin className="size-4" aria-hidden="true" />Lugar</dt>
            <dd className="mt-2 font-semibold leading-6 text-[#0A496C]">{item.lugar_evento}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}

function PublicationContext({ item }: { item: InstitutionalNewsItem }) {
  return (
    <div className="border-l-4 border-[#2CBEE7] bg-[#F4F7F9] p-6 lg:sticky lg:top-40">
      <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#0A6F94]">Vida institucional</p>
      <p className="mt-3 text-sm leading-6 text-[#52606D]">Publicación de {institutionalCategoryLabels[item.categoria].toLocaleLowerCase("es-AR")} del Instituto de Educación Superior Nuevo Horizonte.</p>
      <Link href="/vida-institucional" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0A496C] underline decoration-[#2CBEE7] decoration-2 underline-offset-4">Explorar más noticias <ArrowRight className="size-4" aria-hidden="true" /></Link>
    </div>
  );
}

function getRelatedItems(current: InstitutionalNewsItem, items: InstitutionalNewsItem[]): InstitutionalNewsItem[] {
  const seen = new Set<number | string>();
  return items
    .filter((item) => item.id !== current.id && !seen.has(item.id) && seen.add(item.id))
    .sort((a, b) => {
      const categoryDifference = Number(b.categoria === current.categoria) - Number(a.categoria === current.categoria);
      if (categoryDifference !== 0) return categoryDifference;
      return new Date(b.publicada_at || b.created_at).getTime() - new Date(a.publicada_at || a.created_at).getTime();
    })
    .slice(0, 3);
}

function formatEventRange(item: InstitutionalNewsItem): string {
  if (!item.fecha_evento) return "Fecha a confirmar";
  if (!item.fecha_fin_evento || item.fecha_fin_evento === item.fecha_evento) return formatInstitutionalDate(item.fecha_evento);
  return `${formatInstitutionalDate(item.fecha_evento)} al ${formatInstitutionalDate(item.fecha_fin_evento)}`;
}

function cleanInstitutionalContent(content: string): string {
  return content.replace(/[\w-]+\.(jpg|jpeg|png|webp|gif)\s+\d+(\.\d+)?\s*(KB|MB|GB)/gi, "");
}

function getVideoEmbedUrl(value: string | null): string | null {
  if (!value) return null;
  const youtube = value.match(/^.*(?:youtu\.be\/|v\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/);
  if (youtube?.[1]?.length === 11) return `https://www.youtube.com/embed/${youtube[1]}`;
  const vimeo = value.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return vimeo?.[1] ? `https://player.vimeo.com/video/${vimeo[1]}` : null;
}
