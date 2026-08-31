import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { InstitutionalNewsCard } from "@/components/institutional/InstitutionalNewsCard";
import { institutionalCategoryLabels, stripInstitutionalHtml } from "@/lib/institutional-news";
import type { InstitutionalNewsCategory, InstitutionalNewsItem } from "@/types/institutional-news";

export interface InstitutionalNewsFilters {
  buscar?: string;
  categoria?: string;
  anio?: string;
}

export function InstitutionalNewsExplorer({ items, filters, excludedIds = [] }: { items: InstitutionalNewsItem[]; filters: InstitutionalNewsFilters; excludedIds?: Array<number | string> }) {
  const query = filters.buscar?.trim() ?? "";
  const category = filters.categoria ?? "todas";
  const year = filters.anio ?? "todos";
  const normalizedQuery = query.toLocaleLowerCase("es-AR");
  const hasActiveFilters = Boolean(query || category !== "todas" || year !== "todos");
  const excluded = new Set(excludedIds);
  const sourceItems = hasActiveFilters ? items : items.filter((item) => !excluded.has(item.id));
  const categories = [...new Set(items.map((item) => item.categoria))].filter((item) => item !== "fecha_importante");
  const years = [...new Set(items.map((item) => new Date(item.publicada_at || item.created_at).getFullYear()))].sort((a, b) => b - a);
  const filteredItems = sourceItems.filter((item) => {
    const itemYear = new Date(item.publicada_at || item.created_at).getFullYear().toString();
    const searchable = `${item.titulo} ${stripInstitutionalHtml(item.contenido)}`.toLocaleLowerCase("es-AR");
    return (category === "todas" || item.categoria === category)
      && (year === "todos" || itemYear === year)
      && (!normalizedQuery || searchable.includes(normalizedQuery));
  });
  return (
    <div className="mt-8">
      <div className="border-y border-[#C6D7E5] bg-white px-5 py-5 sm:px-6">
        <form action="/vida-institucional" method="get" className="grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-end" role="search">
          {category !== "todas" ? <input type="hidden" name="categoria" value={category} /> : null}
          <label className="grid gap-2 text-sm font-semibold text-[#0A496C]">
            Buscar publicaciones
            <span className="flex min-h-12 items-center gap-3 rounded-lg border border-[#AFC4D8] bg-white px-4 focus-within:border-[#0A496C] focus-within:ring-2 focus-within:ring-[#2CBEE7]/30">
              <Search className="size-5 shrink-0 text-[#52606D]" aria-hidden="true" />
              <input type="search" name="buscar" defaultValue={query} autoComplete="off" placeholder="Por ejemplo: jornada, enfermería…" className="min-w-0 flex-1 bg-transparent py-3 font-normal text-[#121C28] outline-none" />
            </span>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#0A496C]">
            Año
            <select name="anio" autoComplete="off" defaultValue={year} className="min-h-12 rounded-lg border border-[#AFC4D8] bg-white px-4 font-medium text-[#0A496C] outline-none focus:border-[#0A496C] focus:ring-2 focus:ring-[#2CBEE7]/30">
              <option value="todos">Todos los años</option>
              {years.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#0A496C] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#073A57]">
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Aplicar filtros
          </button>
        </form>

        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1 border-t border-[#D8E1E8] pt-4" aria-label="Filtrar por categoría">
          <CategoryLink label="Todas" href={buildFilterHref(filters, "todas")} active={category === "todas"} />
          {categories.map((option) => (
            <CategoryLink key={option} label={institutionalCategoryLabels[option as InstitutionalNewsCategory]} href={buildFilterHref(filters, option)} active={category === option} />
          ))}
          {hasActiveFilters ? (
            <Link href="/vida-institucional" className="ml-auto inline-flex min-h-10 items-center gap-2 px-3 text-sm font-semibold text-[#52606D] underline underline-offset-4">
              <X className="size-4" aria-hidden="true" /> Limpiar filtros
            </Link>
          ) : null}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-sm text-[#52606D]"><strong className="font-semibold text-[#0A496C]">{filteredItems.length}</strong> {filteredItems.length === 1 ? "publicación" : "publicaciones"}</p>
        {query ? <p className="text-sm text-[#52606D]">Resultados para “{query}”</p> : null}
      </div>

      {filteredItems.length > 0 ? (
        <div className={`mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 ${filteredItems.length >= 3 ? "lg:grid-cols-3" : ""} ${filteredItems.length >= 4 ? "xl:grid-cols-4" : ""}`}>
          {filteredItems.map((item) => <InstitutionalNewsCard key={item.id} item={item} />)}
        </div>
      ) : (
        <div className="mt-8 border-l-4 border-[#2CBEE7] bg-white p-6">
          <h3 className="font-semibold text-[#0A496C]">No encontramos publicaciones</h3>
          <p className="mt-2 text-sm leading-6 text-[#52606D]">Probá con otra categoría, otro año o una búsqueda más general.</p>
        </div>
      )}
    </div>
  );
}

function CategoryLink({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={`inline-flex min-h-10 items-center border-b-2 px-0.5 text-sm font-semibold transition-colors ${active ? "border-[#0A496C] text-[#0A496C]" : "border-transparent text-[#52606D] hover:border-[#2CBEE7] hover:text-[#0A496C]"}`}>
      {label}
    </Link>
  );
}

function buildFilterHref(filters: InstitutionalNewsFilters, category: string): string {
  const params = new URLSearchParams();
  if (filters.buscar?.trim()) params.set("buscar", filters.buscar.trim());
  if (filters.anio && filters.anio !== "todos") params.set("anio", filters.anio);
  if (category !== "todas") params.set("categoria", category);
  const query = params.toString();
  return query ? `/vida-institucional?${query}#publicaciones` : "/vida-institucional#publicaciones";
}
