"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Newspaper,
  Calendar,
  Clock,
  ArrowRight,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ITEMS_POR_PAGINA = 5;

/**
 * Client Component que recibe las noticias ya fetched desde el servidor.
 * Maneja paginación interactiva del lado del cliente.
 */
export default function NoticiasClient({ noticias }) {
  const [paginaActual, setPaginaActual] = useState(1);

  const getYouTubeEmbed = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
  };

  return (
    <>
      {/* --- SECCIÓN: FECHAS IMPORTANTES --- */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center gap-3 bg-background px-6 py-2 rounded-full shadow-sm border border-border mb-6">
          <h2 className="text-xl font-extrabold text-accent-foreground uppercase tracking-tight">
            Noticias Importantes
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        {noticias.fechas_importantes.length > 0 ? (
          noticias.fechas_importantes.map((item) => (
            <Link
              href={`/noticias/${item.slug}`}
              key={item.id}
              className="bg-card rounded-[32px] overflow-hidden shadow-sm border border-border group hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              <div className="h-52 bg-gray-200 relative overflow-hidden group">
                {item.imagen_principal ? (
                  <Image
                    src={item.imagen_principal}
                    alt={item.titulo}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-sky-50 text-primary">
                    <Calendar size={48} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-white">
                  <Clock size={16} className="text-primary" />
                  <span className="text-sm font-bold tracking-wide">
                    {item.fecha_evento
                      ? (() => {
                          const [year, month, day] = item.fecha_evento
                            .split("T")[0]
                            .split("-");
                          return new Date(
                            year,
                            month - 1,
                            day,
                          ).toLocaleDateString("es-AR", {
                            day: "2-digit",
                            month: "short",
                          });
                        })()
                      : "Próximamente"}
                  </span>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="font-extrabold text-accent-foreground text-xl mb-3 leading-tight uppercase tracking-tight line-clamp-2">
                  {item.titulo}
                </h3>
                <div
                  className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-1 leading-relaxed break-words"
                  style={{
                    overflowWrap: "break-word",
                    wordWrap: "break-word",
                  }}
                  dangerouslySetInnerHTML={{ __html: item.contenido }}
                />
                <div className="mt-auto flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest group-hover:text-accent-foreground transition-colors">
                  LEER MÁS{" "}
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-2 transition-transform"
                  />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-card rounded-[32px] border border-border border-dashed">
            <p className="text-muted-foreground font-bold uppercase tracking-widest">
              No hay eventos programados
            </p>
          </div>
        )}
      </div>

      {/* --- SECCIÓN: ACTUALIDAD INSTITUCIONAL --- */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center gap-3 bg-background px-6 py-2 rounded-full shadow-sm border border-border mb-6">
          <h2 className="text-xl font-extrabold text-accent-foreground uppercase tracking-tight">
            Actualidad Institucional
          </h2>
        </div>
      </div>

      <div id="actualidad-institucional" className="grid grid-cols-1 gap-8">
        {noticias.generales.length > 0 ? (
          <>
            {noticias.generales
              .slice(
                (paginaActual - 1) * ITEMS_POR_PAGINA,
                paginaActual * ITEMS_POR_PAGINA
              )
              .map((item) => (
                <Link
                  href={`/noticias/${item.slug}`}
                  key={item.id}
                  className="bg-card p-6 md:p-8 rounded-[32px] border border-border flex flex-col md:flex-row gap-8 items-center hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-full md:w-80 h-56 rounded-[24px] overflow-hidden shrink-0 relative bg-gray-100">
                    {item.video_url ? (
                      <>
                        <iframe
                          className="w-full h-full pointer-events-none"
                          src={getYouTubeEmbed(item.video_url)}
                          frameBorder="0"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                          <PlayCircle
                            className="text-white drop-shadow-lg"
                            size={48}
                          />
                        </div>
                      </>
                    ) : item.imagen_principal ? (
                      <Image
                        src={item.imagen_principal}
                        alt={item.titulo}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Newspaper size={40} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 w-full">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2">
                      Publicado el{" "}
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    <h3 className="text-2xl font-extrabold text-accent-foreground mb-4 leading-tight uppercase tracking-tight group-hover:text-primary transition-colors">
                      {item.titulo}
                    </h3>
                    <div
                      className="text-muted-foreground text-sm line-clamp-3 leading-relaxed mb-6 break-words"
                      style={{
                        overflowWrap: "break-word",
                        wordWrap: "break-word",
                      }}
                      dangerouslySetInnerHTML={{ __html: item.contenido }}
                    />
                    <div className="inline-flex items-center gap-2 bg-muted text-muted-foreground px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-colors">
                      Ver Noticia <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}

            {/* Controles de Paginación */}
            {Math.ceil(noticias.generales.length / ITEMS_POR_PAGINA) > 1 && (
              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => { setPaginaActual((p) => Math.max(1, p - 1)); window.scrollTo({ top: document.getElementById('actualidad-institucional')?.offsetTop - 100, behavior: 'smooth' }); }}
                  disabled={paginaActual === 1}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-background text-sm font-bold text-foreground hover:bg-accent-foreground hover:text-white hover:border-accent-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={16} /> Anterior
                </button>

                <span className="text-sm font-bold text-muted-foreground">
                  Página{" "}
                  <span className="text-accent-foreground">{paginaActual}</span>
                  {" "}de{" "}
                  {Math.ceil(noticias.generales.length / ITEMS_POR_PAGINA)}
                </span>

                <button
                  onClick={() => { setPaginaActual((p) => Math.min(Math.ceil(noticias.generales.length / ITEMS_POR_PAGINA), p + 1)); window.scrollTo({ top: document.getElementById('actualidad-institucional')?.offsetTop - 100, behavior: 'smooth' }); }}
                  disabled={paginaActual === Math.ceil(noticias.generales.length / ITEMS_POR_PAGINA)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-background text-sm font-bold text-foreground hover:bg-accent-foreground hover:text-white hover:border-accent-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Siguiente <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-card rounded-[32px] border border-border border-dashed">
            <p className="text-muted-foreground font-bold uppercase tracking-widest">
              Próximamente más novedades
            </p>
          </div>
        )}
      </div>
    </>
  );
}
