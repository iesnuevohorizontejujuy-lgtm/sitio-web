"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { careerAreas } from "@/data/career-catalog";
import type { Career } from "@/types/career";
import { CareerCard } from "./CareerCard";

interface CareerExplorerProps {
  careers: Career[];
}

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export function CareerExplorer({ careers }: CareerExplorerProps) {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<(typeof careerAreas)[number]>("Todas");

  const filteredCareers = useMemo(() => {
    const normalizedQuery = normalize(query.trim());
    return careers.filter((career) => {
      const matchesArea = area === "Todas" || career.area === area;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        normalize(`${career.title} ${career.area}`).includes(normalizedQuery);
      return matchesArea && matchesQuery;
    });
  }, [area, careers, query]);

  return (
    <div>
      <div className="mb-12 border-b border-[#CBD5E1] pb-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <label className="relative block w-full lg:max-w-xs">
            <span className="sr-only">Buscar carrera por nombre</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#64748B]"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre…"
              className="h-12 w-full rounded-lg border border-[#CBD5E1] bg-white pl-12 pr-4 text-[#121C28] outline-none transition focus:border-[#0A496C] focus:ring-2 focus:ring-[#2CBEE7]/30"
            />
          </label>
          <div className="flex gap-x-7 gap-y-3 overflow-x-auto pb-1" aria-label="Filtrar carreras por área">
            {careerAreas.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setArea(option)}
                aria-pressed={area === option}
                className={`shrink-0 border-b-2 pb-2 text-sm font-semibold transition-colors ${
                  area === option
                    ? "border-[#0A496C] text-[#0A496C]"
                    : "border-transparent text-[#64748B] hover:text-[#0A496C]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredCareers.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCareers.map((career) => (
            <CareerCard
              key={career.slug}
              career={career}
              index={careers.findIndex((item) => item.slug === career.slug)}
            />
          ))}
        </div>
      ) : (
        <div className="border border-[#CBD5E1] bg-white px-6 py-16 text-center">
          <h3 className="text-xl font-semibold text-[#0A496C]">No encontramos coincidencias</h3>
          <p className="mt-2 text-[#52606D]">Probá con otro nombre o seleccioná un área diferente.</p>
        </div>
      )}
    </div>
  );
}
