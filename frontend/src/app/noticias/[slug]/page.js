import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock3,
  ArrowLeft,
  PlayCircle,
  Newspaper,
} from "lucide-react";

const API_BASE_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api";

export const revalidate = 3600;

async function getNoticia(slug) {
  try {
    const res = await fetch(`${API_BASE_URL}/noticias/${slug}`, {
      next: { tags: [`noticia-${slug}`] },
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function getYouTubeEmbed(url) {
  if (!url) return null;

  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : null;
}

function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function stripHtml(html = "") {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function getReadingTime(html = "") {
  const text = stripHtml(html);
  const words = text.split(" ").filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min de lectura`;
}

export default async function DetalleNoticia({ params }) {
  const { slug } = await params;
  const noticia = await getNoticia(slug);

  if (!noticia) notFound();

  const contenidoLimpio = (noticia.contenido || "").replace(
    /[\w-]+\.(jpg|jpeg|png|webp|gif)\s+\d+(\.\d+)?\s*(KB|MB|GB)/gi,
    ""
  );

  const embedUrl = getYouTubeEmbed(noticia.video_url);
  const readingTime = getReadingTime(contenidoLimpio);

  return (
    // Agregamos dark:bg-background para el fondo general de la página
    <div className="min-h-screen bg-slate-50 dark:bg-background pt-24 md:pt-32 transition-colors duration-300">
      <main className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8 pb-20">
        <div className="mb-8">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-border bg-white dark:bg-card px-4 py-2 text-sm font-medium text-slate-600 dark:text-muted-foreground shadow-sm transition hover:border-blue-600 hover:text-blue-700 dark:hover:border-primary dark:hover:text-primary"
          >
            <ArrowLeft size={16} />
            Volver a noticias
          </Link>
        </div>

        <header className="mb-10">
          <div className="mb-4 flex items-center gap-2 text-sm text-slate-500 dark:text-muted-foreground">
            <Newspaper size={16} />
            <span>Canal de noticias y difusión</span>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-200 dark:ring-blue-500/30">
              {String(noticia.categoria || "noticia").replace("_", " ")}
            </span>

            {noticia.categoria === "fecha_importante" && noticia.fecha_evento && (
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 dark:bg-amber-900/30 px-3 py-1 text-xs font-semibold text-amber-800 dark:text-amber-400 ring-1 ring-inset ring-amber-200 dark:ring-amber-500/30">
                <Calendar size={14} />
                Evento: {formatDate(noticia.fecha_evento)}
              </span>
            )}
          </div>

          <h1 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-foreground md:text-5xl">
            {noticia.titulo}
          </h1>

          {stripHtml(contenidoLimpio) && (
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 dark:text-muted-foreground md:text-lg">
              {stripHtml(contenidoLimpio).slice(0, 180)}
              {stripHtml(contenidoLimpio).length > 180 ? "..." : ""}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-200 dark:border-border pt-5 text-sm text-slate-500 dark:text-muted-foreground">
            <div className="inline-flex items-center gap-2">
              <Clock3 size={16} className="text-blue-600 dark:text-primary" />
              <span>Publicado el {formatDate(noticia.created_at)}</span>
            </div>

            <div className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-muted-foreground/50" />
              <span>{readingTime}</span>
            </div>
          </div>
        </header>

        {noticia.imagen_principal && (
          <section className="mb-10 overflow-hidden rounded-3xl border border-slate-200 dark:border-border bg-white dark:bg-card shadow-sm">
            <div className="relative aspect-[16/7] w-full">
              <Image
                src={noticia.imagen_principal}
                alt={noticia.titulo || "Imagen de la noticia"}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            </div>
          </section>
        )}

        <article className="overflow-hidden rounded-3xl border border-slate-200 dark:border-border bg-white dark:bg-card shadow-sm transition-colors duration-300">
          <div className="mx-auto max-w-3xl px-5 py-8 md:px-10 md:py-12">
            {noticia.categoria === "fecha_importante" && noticia.fecha_evento && (
              <div className="mb-10 rounded-2xl border border-blue-100 dark:border-blue-900/50 bg-blue-50/70 dark:bg-blue-900/20 p-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-blue-600 p-3 text-white shadow-sm">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700 dark:text-blue-400">
                      Fecha importante
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-foreground">
                      {formatDate(noticia.fecha_evento)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {noticia.video_url && (
              <section className="mb-12">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-foreground">
                    Material audiovisual
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">
                    Recurso complementario asociado a esta publicación.
                  </p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-border bg-slate-950 shadow-sm">
                  <div className="aspect-video w-full">
                    {embedUrl ? (
                      <iframe
                        className="h-full w-full"
                        src={embedUrl}
                        title={`Video relacionado con ${noticia.titulo}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-white">
                        <PlayCircle size={40} />
                        <a
                          href={noticia.video_url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
                        >
                          Ver video
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            <div
              className="
                rich-text-container
                text-[16px] leading-8 text-slate-700 dark:text-slate-300
                md:text-[17px]

                [&_p]:mb-6
                [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:text-slate-900 dark:[&_h2]:text-foreground
                [&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:text-slate-900 dark:[&_h3]:text-foreground

                [&_ul]:my-6 [&_ul]:ml-0 [&_ul]:list-none
                [&_ul_li]:relative [&_ul_li]:mb-3 [&_ul_li]:pl-7
                [&_ul_li::before]:absolute [&_ul_li::before]:left-0 [&_ul_li::before]:top-[0.72em]
                [&_ul_li::before]:h-2 [&_ul_li::before]:w-2 [&_ul_li::before]:rounded-full [&_ul_li::before]:bg-blue-600 dark:[&_ul_li::before]:bg-primary

                [&_ol]:my-6 [&_ol]:pl-6
                [&_ol_li]:mb-3

                [&_a]:font-medium [&_a]:text-blue-700 dark:[&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline

                [&_strong]:font-semibold [&_strong]:text-slate-900 dark:[&_strong]:text-foreground

                [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-600 dark:[&_blockquote]:border-primary
                [&_blockquote]:bg-slate-50 dark:[&_blockquote]:bg-muted/30 [&_blockquote]:py-3 [&_blockquote]:pl-5 [&_blockquote]:pr-4
                [&_blockquote]:italic [&_blockquote]:text-slate-700 dark:[&_blockquote]:text-muted-foreground

                [&_img]:my-10 [&_img]:rounded-2xl [&_img]:border [&_img]:border-slate-200 dark:[&_img]:border-border [&_img]:shadow-sm

                [&_figure]:my-10
                [&_figcaption]:mt-3 [&_figcaption]:text-sm [&_figcaption]:text-slate-500 dark:[&_figcaption]:text-muted-foreground
              "
              dangerouslySetInnerHTML={{ __html: contenidoLimpio }}
            />
          </div>
        </article>
      </main>
    </div>
  );
}