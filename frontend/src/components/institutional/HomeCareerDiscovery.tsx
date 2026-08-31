"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock3, Search, X } from "lucide-react";
import type { CareerArea } from "@/types/career";

export type CareerSearchItem = {
  title: string;
  slug: string;
  area: CareerArea;
  duration: string;
  modality: string;
};

const areaDescriptions: Record<CareerArea, string> = {
  Salud: "Cuidado, prevención, diagnóstico y acompañamiento.",
  Tecnología: "Software, soporte e infraestructura para resolver problemas.",
  Gestión: "Administración y servicios para organizaciones.",
  "Sociedad y comunicación": "Comunicación, idiomas e intervención social.",
  "Actividad física": "Movimiento, rendimiento y hábitos saludables.",
};

const areaOrder: CareerArea[] = ["Salud", "Tecnología", "Gestión", "Sociedad y comunicación", "Actividad física"];
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const shortTitle = (title: string) => title.replace(/^Tecnicatura Superior en\s+/i, "");

export function HomeCareerDiscovery({ careers }: { careers: CareerSearchItem[] }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalize(deferredQuery.trim());

  const results = useMemo(() => {
    if (normalizedQuery.length === 0) return [];
    return careers.filter((career) => normalize(`${career.title} ${career.area}`).includes(normalizedQuery)).slice(0, 6);
  }, [careers, normalizedQuery]);

  const areas = useMemo(() => {
    const counts = new Map<CareerArea, number>();
    for (const career of careers) counts.set(career.area, (counts.get(career.area) ?? 0) + 1);
    return areaOrder.filter((name) => counts.has(name)).map((name) => ({ name, count: counts.get(name) ?? 0 }));
  }, [careers]);

  return (
    <section aria-labelledby="career-discovery-title" className="border-b border-[#D8E1E8] bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-5 border-b border-[#C6D7E5] pb-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#0A6F94]">Estudiá en el IES</p>
            <h2 id="career-discovery-title" className="mt-3 text-balance text-3xl font-semibold tracking-[-0.035em] text-[#0A496C] md:text-5xl">Elegí una carrera para construir tu futuro</h2>
          </div>
          <p className="max-w-xl leading-7 text-[#52606D] lg:col-span-5 lg:justify-self-end">Explorá las áreas de formación o buscá directamente entre las tecnicaturas disponibles.</p>
        </div>

        <div className="mt-8 bg-[#0A496C] p-6 text-white sm:p-8 lg:grid lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:gap-10 lg:p-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#8CDDF3]">Buscador de carreras</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.025em]">¿Qué querés estudiar?</h3>
            <p id="home-career-search-hint" className="mt-3 text-sm leading-6 text-white/70">{query.trim() ? `${results.length} ${results.length === 1 ? "resultado encontrado" : "resultados encontrados"}` : `Buscá entre ${careers.length} carreras presenciales.`}</p>
          </div>
          <div className="relative mt-6 lg:mt-0">
            <label htmlFor="home-career-search" className="sr-only">Buscar una carrera</label>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#0A496C]" aria-hidden="true" />
            <input id="home-career-search" name="carrera" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Enfermería, Software, Farmacia…" autoComplete="off" className="h-14 w-full rounded-lg border border-white/30 bg-white pl-12 pr-12 text-base text-[#121C28] outline-none transition focus:ring-4 focus:ring-[#2CBEE7]/35" aria-describedby="home-career-search-hint" />
            {query ? <button type="button" onClick={() => setQuery("")} className="absolute right-2 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-md text-[#64748B] hover:bg-[#E0ECF8] hover:text-[#0A496C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2CBEE7]" aria-label="Limpiar búsqueda"><X className="size-5" aria-hidden="true" /></button> : null}
          </div>
        </div>

        {query.trim() ? (
          <div className="border border-t-0 border-[#C6D7E5] bg-white px-4 sm:px-6" aria-live="polite">
            {results.length > 0 ? (
              <div className="divide-y divide-[#E2E8F0]">
                {results.map((career) => (
                  <Link key={career.slug} href={`/carreras/${career.slug}`} className="group grid gap-3 py-4 transition-colors hover:bg-[#F4F8FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2CBEE7] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-4">
                    <span><span className="block font-semibold text-[#0A496C]">{shortTitle(career.title)}</span><span className="mt-1 block text-xs font-medium uppercase tracking-[0.08em] text-[#64748B]">{career.area}</span></span>
                    <span className="flex items-center gap-4 text-sm text-[#52606D]"><span className="inline-flex items-center gap-1.5"><Clock3 className="size-4 text-[#2CBEE7]" aria-hidden="true" />{career.duration}</span><span>{career.modality}</span><ArrowRight className="size-4 text-[#0A496C] transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
                  </Link>
                ))}
              </div>
            ) : <div className="py-8 text-center"><p className="font-semibold text-[#0A496C]">No encontramos coincidencias</p><p className="mt-2 text-sm text-[#52606D]">Probá con otro nombre o explorá las áreas disponibles.</p></div>}
          </div>
        ) : null}

        <div className="mt-10 flex items-end justify-between gap-5 border-b border-[#C6D7E5] pb-4">
          <h3 className="text-2xl font-semibold tracking-[-0.025em] text-[#0A496C]">Áreas de formación</h3>
          <Link href="/carreras" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0A496C]">Ver las {careers.length} carreras <ArrowRight className="size-4" aria-hidden="true" /></Link>
        </div>
        <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-[#C6D7E5] bg-[#C6D7E5] sm:grid-cols-2 lg:grid-cols-5">
          {areas.map((area, index) => (
            <Link key={area.name} href={`/carreras?area=${encodeURIComponent(area.name)}`} className="group flex min-h-56 flex-col bg-[#F4F7F9] p-6 transition-colors hover:bg-[#E0ECF8] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#2CBEE7]/30">
              <span className="text-xs font-semibold tabular-nums text-[#0A6F94]">{String(index + 1).padStart(2, "0")}</span>
              <span className="mt-7 block text-xl font-semibold leading-tight text-[#0A496C]">{area.name}</span>
              <span className="mt-3 block text-sm leading-6 text-[#52606D]">{areaDescriptions[area.name]}</span>
              <span className="mt-auto flex items-center justify-between gap-3 pt-5 text-sm font-semibold text-[#0A496C]"><span>{area.count} {area.count === 1 ? "carrera" : "carreras"}</span><ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
