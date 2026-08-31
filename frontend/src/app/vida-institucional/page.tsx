import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { InstitutionalAgenda } from "@/components/institutional/InstitutionalAgenda";
import { InstitutionalNewsExplorer, type InstitutionalNewsFilters } from "@/components/institutional/InstitutionalNewsExplorer";
import { InstitutionalNewsLead } from "@/components/institutional/InstitutionalNewsLead";
import { whatsappHref } from "@/config/institution";
import { getInstitutionalNews } from "@/lib/institutional-news";

export const metadata: Metadata = {
  title: "Vida institucional",
  description: "Noticias, actividades, agenda académica y novedades de la comunidad del IES Nuevo Horizonte en Jujuy.",
  alternates: { canonical: "/vida-institucional" },
};

export const revalidate = 300;

interface InstitutionalLifePageProps {
  searchParams: Promise<InstitutionalNewsFilters>;
}

export default async function InstitutionalLifePage({ searchParams }: InstitutionalLifePageProps) {
  const [news, filters] = await Promise.all([getInstitutionalNews(), searchParams]);
  const allItems = [...news.noticias, ...news.agenda].sort((a, b) => new Date(b.publicada_at || b.created_at).getTime() - new Date(a.publicada_at || a.created_at).getTime());
  const featured = news.destacadas[0] ?? news.noticias[0] ?? news.agenda[0];
  const secondary = allItems.filter((item) => item.id !== featured?.id).slice(0, 2);
  const featuredIds = featured ? [featured.id, ...secondary.map((item) => item.id)] : [];
  const hasPublications = allItems.length > 0;

  return (
    <main className="institutional-shell text-[#121C28]">
      <section className="border-b border-[#C6D7E5] bg-[#F4F7F9]">
        <div className="mx-auto max-w-7xl px-5 pb-0 pt-12 lg:px-8 lg:pt-16">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0A6F94]">Comunidad IES Nuevo Horizonte</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-12 lg:items-end">
            <h1 className="text-balance text-5xl font-bold leading-none tracking-[-0.045em] text-[#0A496C] sm:text-6xl lg:col-span-7 lg:text-7xl">Noticias</h1>
            <p className="max-w-xl text-pretty text-lg leading-8 text-[#52606D] lg:col-span-5 lg:justify-self-end">Información académica, actividades y novedades de la comunidad del Instituto de Educación Superior Nuevo Horizonte.</p>
          </div>
          <nav aria-label="Secciones de Noticias" className="mt-10 flex gap-7 overflow-x-auto border-t border-[#C6D7E5] text-sm font-semibold text-[#0A496C]">
            <SectionJump href="#destacadas" label="Destacadas" />
            <SectionJump href="#publicaciones" label="Todas las noticias" />
            <SectionJump href="#agenda" label="Agenda institucional" />
          </nav>
        </div>
      </section>

      {hasPublications ? (
        <>
          {featured ? (
            <section id="destacadas" aria-labelledby="featured-heading" className="institutional-surface-canvas scroll-mt-36 py-12 md:py-16">
              <div className="mx-auto max-w-7xl px-5 lg:px-8">
                <div className="mb-7 flex items-end justify-between gap-5 border-b border-[#C6D7E5] pb-4">
                  <h2 id="featured-heading" className="text-2xl font-semibold tracking-[-0.025em] text-[#0A496C]">En primer plano</h2>
                  <span className="hidden text-sm text-[#52606D] sm:block">Actualidad institucional</span>
                </div>
                <InstitutionalNewsLead featured={featured} secondary={secondary} />
              </div>
            </section>
          ) : null}

          <section id="publicaciones" aria-labelledby="publications-heading" className="institutional-surface-muted scroll-mt-36 border-y border-[#D8E1E8] py-14 md:py-18">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
              <div className="grid gap-4 border-b border-[#C6D7E5] pb-6 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A6F94]">Archivo institucional</p>
                  <h2 id="publications-heading" className="mt-3 text-balance text-3xl font-semibold tracking-[-0.03em] text-[#0A496C] md:text-5xl">Últimas noticias</h2>
                </div>
                <p className="max-w-xl leading-7 text-[#52606D] lg:col-span-5 lg:justify-self-end">Consultá las novedades más recientes o recorré el archivo por tema y año.</p>
              </div>
              <InstitutionalNewsExplorer items={news.noticias} filters={filters} excludedIds={news.noticias.length > 3 ? featuredIds : []} />
            </div>
          </section>

          <section id="agenda" aria-labelledby="agenda-heading" className="institutional-surface-canvas scroll-mt-36 py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
              <div className="grid gap-5 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A6F94]">Próximas fechas</p>
                  <h2 id="agenda-heading" className="mt-3 text-balance text-3xl font-semibold tracking-[-0.03em] text-[#0A496C] md:text-5xl">Agenda institucional</h2>
                  <p className="mt-4 max-w-2xl text-pretty leading-7 text-[#52606D]">Actividades, jornadas e información importante organizada cronológicamente.</p>
                </div>
              </div>
              <InstitutionalAgenda items={news.agenda} />
            </div>
          </section>
        </>
      ) : (
        <section className="institutional-surface-muted py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
            <CalendarDays className="mx-auto size-12 text-[#0A6F94]" aria-hidden="true" />
            <h2 className="mt-6 text-3xl font-semibold text-[#0A496C]">Próximamente nuevas publicaciones</h2>
            <p className="mt-4 leading-7 text-[#52606D]">Las noticias, actividades y fechas cargadas desde el panel institucional se mostrarán automáticamente en esta sección.</p>
          </div>
        </section>
      )}

      <section className="institutional-surface-muted border-t border-[#D8E1E8] px-5 py-20 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 rounded-2xl bg-[#073A57] px-7 py-10 text-white md:flex-row md:items-center md:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8CDDF3]">Participación institucional</p>
            <h2 className="mt-3 text-balance text-2xl font-semibold">¿Querés compartir una actividad con la comunidad?</h2>
            <p className="mt-2 max-w-2xl text-white/75">Comunicate con el instituto para enviar la información y el material correspondiente.</p>
          </div>
          <a href={whatsappHref("Hola, quiero compartir información sobre una actividad institucional.")} target="_blank" rel="noreferrer" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#2CBEE7] px-6 py-3 text-sm font-semibold text-[#073A57] transition-colors hover:bg-white">
            Contactar al instituto <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  );
}

function SectionJump({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="flex min-h-14 shrink-0 items-center border-b-[3px] border-transparent pt-0.5 transition-colors hover:border-[#2CBEE7] hover:text-[#073A57]">
      {label}
    </Link>
  );
}
