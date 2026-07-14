import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, BookOpen, FileText, Download } from "lucide-react";
import CarreraCTA from "../components/CarreraCTA";

const API_BASE_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api";

// ISR: revalidar cada hora
export const revalidate = 3600;

async function getCarrera(slug) {
  const res = await fetch(`${API_BASE_URL}/carreras/${slug}`, {
    next: { tags: [`carrera-${slug}`] },
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
}

export default async function DetalleCarrera({ params }) {
  const { slug } = await params;
  const carrera = await getCarrera(slug);

  if (!carrera) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background pb-20 font-sans">
      {/* HERO IMAGE */}
      <div className="relative h-[400px] w-full bg-slate-900">
        <Image
          src={carrera.image || "/placeholder.jpg"}
          alt={carrera.title}
          fill
          className="object-cover opacity-60"
          unoptimized
          priority
        />
        {/* CORRECCIÓN: Degradado oscuro fijo (slate-950) para garantizar que el texto blanco SIEMPRE sea legible, sin importar si el tema es claro u oscuro */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-black/20" />

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 max-w-7xl mx-auto z-10">
          <Link
            href="/#carreras"
            className="inline-flex items-center text-white/80 hover:text-white mb-4 transition text-sm font-bold uppercase tracking-wider drop-shadow-md"
          >
            <ArrowLeft size={16} className="mr-2" /> Volver a Carreras
          </Link>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
            {carrera.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-white/90 text-sm font-medium">
            {carrera.duracion && (
              <span className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full backdrop-blur-md border border-white/20 shadow-sm">
                <Calendar size={16} /> {carrera.duracion}
              </span>
            )}
            {carrera.modalidad && (
              <span className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full backdrop-blur-md border border-white/20 shadow-sm">
                <BookOpen size={16} /> {carrera.modalidad}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 bg-card rounded-xl shadow-lg p-8 border border-border">
            <h2 className="text-2xl font-bold text-accent-foreground mb-6 border-b pb-2">
              Perfil Profesional
            </h2>
            <div
              className="prose prose-blue max-w-none text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: carrera.content }}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Documentación */}
            <div className="bg-muted rounded-xl p-6 border border-border">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <FileText className="text-primary" /> Documentación
              </h3>
              <div className="space-y-3">
                {carrera.plan_estudio ? (
                  <a
                    href={carrera.plan_estudio}
                    target="_blank"
                    className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:border-primary hover:text-accent-foreground transition group cursor-pointer"
                  >
                    <span className="text-sm font-medium text-foreground group-hover:text-accent-foreground">
                      Descargar Plan de Estudio
                    </span>
                    <Download
                      size={18}
                      className="text-muted-foreground group-hover:text-primary"
                    />
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground italic text-center py-2">
                    Plan de estudio no disponible.
                  </p>
                )}

                {carrera.resolucion && (
                  <a
                    href={carrera.resolucion}
                    target="_blank"
                    className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:border-primary hover:text-accent-foreground transition group cursor-pointer"
                  >
                    <span className="text-sm font-medium text-foreground group-hover:text-accent-foreground">
                      Resolución Ministerial
                    </span>
                    <Download
                      size={18}
                      className="text-muted-foreground group-hover:text-primary"
                    />
                  </a>
                )}
              </div>
            </div>

            {/* CTA - Client Component */}
            <CarreraCTA careerId={carrera.id} careerName={carrera.title} />
          </div>
        </div>
      </div>
    </main>
  );
}