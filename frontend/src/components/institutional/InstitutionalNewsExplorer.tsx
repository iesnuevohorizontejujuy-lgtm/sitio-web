"use client";

import { useMemo, useState } from "react";
import { Filter } from "lucide-react";
import type { InstitutionalNewsCategory, InstitutionalNewsItem } from "@/types/institutional-news";
import { InstitutionalNewsCard } from "./InstitutionalNewsCard";

interface InstitutionalNewsExplorerProps {
  items: InstitutionalNewsItem[];
}

const categoryLabels: Record<Exclude<InstitutionalNewsCategory, "fecha_importante">, string> = {
  general: "Noticias",
  actividad: "Actividades",
  jornada: "Jornadas",
  practica: "Prácticas",
  convenio: "Convenios",
};

export function InstitutionalNewsExplorer({ items }: InstitutionalNewsExplorerProps) {
  const [category, setCategory] = useState("todas");
  const [year, setYear] = useState("todos");
  const categories = [...new Set(items.map((item) => item.categoria))];
  const years = [...new Set(items.map((item) => new Date(item.created_at).getFullYear()))].sort((a, b) => b - a);
  const filteredItems = useMemo(() => items.filter((item) => {
    const itemYear = new Date(item.created_at).getFullYear().toString();
    return (category === "todas" || item.categoria === category) && (year === "todos" || itemYear === year);
  }), [category, items, year]);

  return (
    <div className="mt-10">
      <div className="mb-8 flex flex-col gap-4 border-y border-[#D8E1E8] py-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#0A496C]"><Filter className="size-4" />Filtrar publicaciones</div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex items-center gap-3 text-sm text-[#52606D]">
            <span>Categoría</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-11 rounded-lg border border-[#CBD5E1] bg-white px-3 font-medium text-[#0A496C] outline-none focus:border-[#0A496C]">
              <option value="todas">Todas</option>
              {categories.map((option) => <option key={option} value={option}>{categoryLabels[option as keyof typeof categoryLabels] ?? "Publicaciones"}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-3 text-sm text-[#52606D]">
            <span>Año</span>
            <select value={year} onChange={(event) => setYear(event.target.value)} className="h-11 rounded-lg border border-[#CBD5E1] bg-white px-3 font-medium text-[#0A496C] outline-none focus:border-[#0A496C]">
              <option value="todos">Todos</option>
              {years.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => <InstitutionalNewsCard key={item.id} item={item} />)}
        </div>
      ) : (
        <p className="border-l-4 border-[#2CBEE7] bg-white p-6 text-[#52606D]">No hay publicaciones que coincidan con esos filtros.</p>
      )}
    </div>
  );
}
