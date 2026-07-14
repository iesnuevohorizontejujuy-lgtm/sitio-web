"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Calendar, ArrowRight, ChevronDown, Clock, AlertCircle } from "lucide-react";

const API_BASE_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api";

const formatFecha = (fechaStr) => {
  if (!fechaStr) return "";
  const [year, month, day] = fechaStr.split("T")[0].split("-");
  return new Date(year, month - 1, day).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState({ fechas_importantes: [], generales: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/noticias`);
        if (!res.ok) throw new Error("Error al cargar noticias");
        const data = await res.json();
        setNoticias(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNoticias();
  }, []);

  const scrollToContent = () => {
    const mainContent = document.getElementById('contenido-principal');
    if (mainContent) {
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const LoadingSpinner = () => (
    <div className="w-full flex flex-col items-center justify-center py-20 text-muted-foreground">
      <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
      <p className="text-sm font-bold uppercase tracking-widest animate-pulse">Cargando noticias...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground">

      {/* ── HERO SECTION ── */}
      <section className="relative h-[70vh] min-h-[650px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/herosection.webp"
            alt="Noticias IESNH"
            fill
            className="object-cover brightness-75 dark:brightness-[0.6]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(210_60%_12%)] via-transparent to-[hsl(210_60%_12%)]/40" />
        </div>

        <div className="relative z-10 text-center px-4 w-full max-w-5xl flex flex-col items-center mt-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1.5 px-5 rounded-full bg-primary/30 border border-primary/50 text-white text-xs font-bold tracking-widest uppercase backdrop-blur-md mb-6 shadow-xl">
              Novedades Institucionales
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold mb-2 leading-tight tracking-tighter drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-t from-white/60 via-white to-white pb-2"
          >
            Canal de Noticias
          </motion.h1>

          <div className="h-1.5 w-[60%] max-w-md bg-gradient-to-r from-transparent via-white/80 to-transparent mb-8 rounded-full " />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto font-medium drop-shadow-md"
          >
            Mantente informado sobre eventos, mesas de examen y toda la actualidad académica del instituto.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={scrollToContent}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer z-20"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <ChevronDown className="w-10 h-10 text-white/80 hover:text-white drop-shadow-lg transition-colors" />
          </motion.div>
        </motion.div>
      </section>

      <main id="contenido-principal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

        {/* Manejo de errores global de la sección */}
        {error ? (
          <div className="w-full flex justify-center py-20">
            <div className="text-center p-8 bg-destructive/10 border border-destructive/20 rounded-2xl max-w-md flex flex-col items-center">
              <AlertCircle className="text-destructive mb-4 w-12 h-12" />
              <p className="text-destructive font-bold text-lg mb-2">Error de conexión</p>
              <p className="text-muted-foreground text-sm">{error}</p>
            </div>
          </div>
        ) : (
          <>
            {/* ── CALENDARIO ACADÉMICO ── */}
            <div className="text-center mb-16 flex flex-col items-center w-full">
              <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight bg-clip-text text-transparent pb-2 
                bg-gradient-to-t from-primary via-primary to-foreground 
                dark:from-primary/60 dark:via-foreground dark:to-foreground"
              >
                Calendario Académico
              </h2>
              <div className="h-[3px] w-[85%] max-w-4xl bg-gradient-to-r from-transparent via-primary to-transparent mt-4 rounded-full" />
              <p className="text-muted-foreground mt-6 max-w-xl mx-auto text-lg">
                Próximos eventos y fechas importantes del ciclo lectivo.
              </p>
            </div>

            {loading ? <LoadingSpinner /> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
                {noticias.fechas_importantes?.length === 0 ? (
                  <p className="col-span-full text-center text-muted-foreground">No hay fechas importantes programadas.</p>
                ) : (
                  noticias.fechas_importantes?.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="group flex flex-col"
                    >
                      <Link href={`/noticias/${item.slug}`} className="block h-full">
                        <div className="bg-card border border-border rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full hover:border-primary/50 group-hover:-translate-y-1">

                          <div className="relative h-56 w-full bg-muted overflow-hidden">
                            {item.imagen_principal ? (
                              <Image
                                src={item.imagen_principal}
                                alt={item.titulo}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-accent/20">
                                <Calendar className="w-12 h-12 text-primary/30" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                            <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                              Importante
                            </div>
                          </div>

                          <div className="p-8 flex-1 flex flex-col">
                            <div className="mb-5">
                              <span className="inline-flex items-center gap-2 text-[11px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-md w-fit border border-primary/20">
                                <Calendar className="w-4 h-4" />
                                {formatFecha(item.fecha_evento)}
                              </span>
                            </div>
                            <h3 className="text-xl font-extrabold text-foreground mb-4 leading-snug group-hover:text-primary transition-colors">
                              {item.titulo}
                            </h3>
                            <div
                              className="text-muted-foreground text-sm mb-8 flex-1 line-clamp-3 leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: item.contenido }}
                            />
                            <div className="mt-auto pt-5 border-t border-border flex items-center justify-between text-sm">
                              <span className="font-bold text-foreground group-hover:text-primary transition-colors uppercase tracking-widest text-xs">Leer detalles</span>
                              <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-2 transition-transform duration-300" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* ── ACTUALIDAD INSTITUCIONAL ── */}
            <div className="text-center mb-16 flex flex-col items-center w-full">
              <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight bg-clip-text text-transparent pb-2 
                bg-gradient-to-t from-primary via-primary to-foreground 
                dark:from-primary/60 dark:via-foreground dark:to-foreground"
              >
                Actualidad Institucional
              </h2>
              <div className="h-[3px] w-[85%] max-w-4xl bg-gradient-to-r from-transparent via-primary to-transparent mt-4 rounded-full" />
              <p className="text-muted-foreground mt-6 max-w-xl mx-auto text-lg">
                Últimas noticias y comunicaciones generales.
              </p>
            </div>

            {loading ? <LoadingSpinner /> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {noticias.generales?.length === 0 ? (
                  <p className="col-span-full text-center text-muted-foreground">No hay noticias recientes.</p>
                ) : (
                  noticias.generales?.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="group flex flex-col"
                    >
                      <Link href={`/noticias/${item.slug}`} className="block h-full">
                        <div className="bg-card border border-border rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full hover:border-primary/50 group-hover:-translate-y-1">

                          <div className="relative h-48 w-full bg-muted overflow-hidden">
                            {item.imagen_principal ? (
                              <Image
                                src={item.imagen_principal}
                                alt={item.titulo}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-accent/20">
                                <Calendar className="w-12 h-12 text-primary/30" />
                              </div>
                            )}
                          </div>

                          <div className="p-8 flex-1 flex flex-col">
                            <div className="mb-4">
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted px-3 py-1.5 rounded-md border border-border">
                                <Clock className="w-3.5 h-3.5 text-primary" />
                                {new Date(item.created_at).toLocaleDateString('es-AR', {
                                  day: '2-digit', month: 'long', year: 'numeric'
                                })}
                              </span>
                            </div>
                            <h3 className="text-lg font-extrabold text-foreground mb-4 leading-snug group-hover:text-primary transition-colors">
                              {item.titulo}
                            </h3>
                            <div
                              className="text-muted-foreground text-sm mb-8 flex-1 line-clamp-3 leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: item.contenido }}
                            />
                            <div className="mt-auto w-full">
                              <div className="flex items-center justify-center gap-2 border-2 border-primary text-primary font-bold py-2.5 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 uppercase tracking-widest text-xs">
                                Ver noticia <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </>
        )}

      </main>

      <div className="h-24" />
    </div>
  );
}