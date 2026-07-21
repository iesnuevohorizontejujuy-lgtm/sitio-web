"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Search, Scale, X } from "lucide-react";
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
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);

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

  const selectedCareers = careers.filter((career) => selectedSlugs.includes(career.slug));

  const toggleComparison = (slug: string) => {
    setSelectedSlugs((current) => {
      if (current.includes(slug)) return current.filter((item) => item !== slug);
      if (current.length === 3) return current;
      return [...current, slug];
    });
  };

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

      {selectedCareers.length > 0 && (
        <section id="comparador" className="mb-12 scroll-mt-28 overflow-hidden rounded-2xl border border-[#B7CADB] bg-white" aria-labelledby="comparison-title">
          <div className="flex flex-col justify-between gap-5 bg-[#0A496C] px-6 py-6 text-white sm:flex-row sm:items-center md:px-8">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#2CBEE7]"><Scale className="size-4" />Comparador</p>
              <h2 id="comparison-title" className="mt-2 text-2xl font-semibold">{selectedCareers.length === 1 ? "Elegí al menos una carrera más" : "Compará las propuestas seleccionadas"}</h2>
            </div>
            <button type="button" onClick={() => setSelectedSlugs([])} className="inline-flex items-center gap-2 self-start text-sm font-semibold text-white/75 hover:text-white"><X className="size-4" />Limpiar selección</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#D8E1E8] bg-[#F7F9FB]">
                  <th className="w-40 px-6 py-5 text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">Dato</th>
                  {selectedCareers.map((career) => <th key={career.slug} className="min-w-56 px-6 py-5 text-base font-semibold text-[#0A496C]">{career.shortTitle || career.title.replace("Tecnicatura Superior en ", "")}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-sm">
                <ComparisonRow label="Área" careers={selectedCareers} value={(career) => career.area} />
                <ComparisonRow label="Duración" careers={selectedCareers} value={(career) => career.duration} />
                <ComparisonRow label="Modalidad" careers={selectedCareers} value={(career) => career.modality} />
                <ComparisonRow label="Resolución" careers={selectedCareers} value={(career) => career.resolutionCode || "Consultar"} />
                <tr>
                  <th className="px-6 py-5 font-semibold text-[#0A496C]">Detalle</th>
                  {selectedCareers.map((career) => (
                    <td key={career.slug} className="px-6 py-5"><Link href={`/carreras/${career.slug}`} className="inline-flex items-center gap-2 font-semibold text-[#0A496C] underline underline-offset-4">Ver carrera <ArrowRight className="size-4" /></Link></td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {filteredCareers.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCareers.map((career) => (
            <div key={career.slug} className="flex flex-col">
              <button
                type="button"
                onClick={() => toggleComparison(career.slug)}
                disabled={!selectedSlugs.includes(career.slug) && selectedSlugs.length === 3}
                aria-pressed={selectedSlugs.includes(career.slug)}
                className={`flex min-h-11 items-center justify-center gap-2 border border-b-0 px-4 text-sm font-semibold transition ${selectedSlugs.includes(career.slug) ? "border-[#0A496C] bg-[#0A496C] text-white" : "border-[#CBD5E1] bg-[#F7F9FB] text-[#0A496C] hover:bg-[#E0ECF8] disabled:cursor-not-allowed disabled:text-[#94A3B8]"}`}
              >
                {selectedSlugs.includes(career.slug) ? <Check className="size-4" /> : <Scale className="size-4" />}
                {selectedSlugs.includes(career.slug) ? "Seleccionada para comparar" : selectedSlugs.length === 3 ? "Máximo de 3 carreras" : "Agregar al comparador"}
              </button>
              <CareerCard
                career={career}
                index={careers.findIndex((item) => item.slug === career.slug)}
              />
            </div>
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

function ComparisonRow({ careers, label, value }: { careers: Career[]; label: string; value: (career: Career) => string }) {
  return (
    <tr>
      <th className="px-6 py-5 font-semibold text-[#0A496C]">{label}</th>
      {careers.map((career) => <td key={career.slug} className="px-6 py-5 text-[#52606D]">{value(career)}</td>)}
    </tr>
  );
}
