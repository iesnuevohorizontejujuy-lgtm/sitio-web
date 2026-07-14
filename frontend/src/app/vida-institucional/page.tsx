import type { Metadata } from "next";
import { ArrowRight, CalendarDays, Newspaper, UsersRound } from "lucide-react";
import { InstitutionalNewsCard } from "@/components/institutional/InstitutionalNewsCard";
import { whatsappHref } from "@/config/institution";
import { getInstitutionalNews } from "@/lib/institutional-news";

export const metadata: Metadata = {
  title: "Vida institucional | IES Nuevo Horizonte",
  description: "Noticias, actividades, agenda académica y novedades de la comunidad del IES Nuevo Horizonte en Jujuy.",
};

export const revalidate = 300;

export default async function InstitutionalLifePage() {
  const news = await getInstitutionalNews();
  const allItems = [...news.generales, ...news.fechas_importantes]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const featured = allItems[0];
  const remainingNews = news.generales.filter((item) => item.id !== featured?.id);
  const remainingEvents = news.fechas_importantes.filter((item) => item.id !== featured?.id);
  const hasPublications = allItems.length > 0;

  return (
    <main className="institutional-shell bg-white text-[#121C28]">
      <section className="border-b border-[#CBD5E1] bg-[#E0ECF8]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:py-20 lg:grid-cols-12 lg:px-8 lg:py-24">
          <div className="lg:col-span-8">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#0A496C]"><span className="h-0.5 w-9 bg-[#2CBEE7]" />Nuestra comunidad</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-[#0A496C] sm:text-5xl lg:text-6xl">Vida institucional</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#52606D]">Noticias, actividades, experiencias y fechas importantes que forman parte de la vida cotidiana del IES Nuevo Horizonte.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:col-span-4 lg:grid-cols-1">
            <div className="flex items-center gap-4 border-b border-[#B7CADB] py-4"><Newspaper className="size-6 text-[#0A496C]" /><span className="font-semibold text-[#0A496C]">Noticias y comunicados</span></div>
            <div className="flex items-center gap-4 border-b border-[#B7CADB] py-4"><UsersRound className="size-6 text-[#0A496C]" /><span className="font-semibold text-[#0A496C]">Actividades institucionales</span></div>
            <div className="flex items-center gap-4 py-4"><CalendarDays className="size-6 text-[#0A496C]" /><span className="font-semibold text-[#0A496C]">Agenda académica</span></div>
          </div>
        </div>
      </section>

      {hasPublications ? (
        <>
          {featured && (
            <section className="py-16 md:py-20">
              <div className="mx-auto max-w-7xl px-5 lg:px-8">
                <p className="mb-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#0A496C]">Publicación destacada</p>
                <InstitutionalNewsCard item={featured} featured />
              </div>
            </section>
          )}

          <section className="border-y border-[#D8E1E8] bg-[#F7F9FB] py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A496C]">Comunidad</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-[#0A496C] md:text-4xl">Noticias y actividades</h2>
                </div>
              </div>
              {remainingNews.length > 0 ? (
                <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {remainingNews.map((item) => <InstitutionalNewsCard key={item.id} item={item} />)}
                </div>
              ) : (
                <p className="mt-8 border-l-4 border-[#2CBEE7] bg-white p-6 text-[#52606D]">Las próximas noticias y actividades publicadas desde el panel institucional aparecerán acá.</p>
              )}
            </div>
          </section>

          <section className="py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A496C]">Próximas fechas</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-[#0A496C] md:text-4xl">Agenda institucional</h2>
              {remainingEvents.length > 0 ? (
                <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {remainingEvents.map((item) => <InstitutionalNewsCard key={item.id} item={item} />)}
                </div>
              ) : (
                <p className="mt-8 border-l-4 border-[#2CBEE7] bg-[#F7F9FB] p-6 text-[#52606D]">No hay nuevas fechas publicadas por el momento.</p>
              )}
            </div>
          </section>
        </>
      ) : (
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
            <CalendarDays className="mx-auto size-12 text-[#2CBEE7]" />
            <h2 className="mt-6 text-3xl font-semibold text-[#0A496C]">Próximamente nuevas publicaciones</h2>
            <p className="mt-4 leading-7 text-[#52606D]">Las noticias, actividades y fechas cargadas desde el panel institucional se mostrarán automáticamente en esta sección.</p>
          </div>
        </section>
      )}

      <section className="px-5 pb-20 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 rounded-2xl bg-[#0A496C] px-7 py-10 text-white md:flex-row md:items-center md:px-10">
          <div><h2 className="text-2xl font-semibold">¿Querés compartir una actividad con la comunidad?</h2><p className="mt-2 text-white/75">Comunicate con el instituto para enviar la información y el material correspondiente.</p></div>
          <a href={whatsappHref("Hola, quiero compartir información sobre una actividad institucional.")} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#2CBEE7] px-6 py-3 text-sm font-semibold text-[#073A57]">Contactar al instituto <ArrowRight className="size-4" /></a>
        </div>
      </section>
    </main>
  );
}
