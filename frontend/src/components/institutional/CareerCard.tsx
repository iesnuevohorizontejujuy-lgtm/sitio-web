import Link from "next/link";
import { ArrowRight, Clock3, GraduationCap } from "lucide-react";
import type { Career } from "@/types/career";

interface CareerCardProps {
  career: Career;
  index: number;
  compact?: boolean;
}

export function CareerCard({ career, index, compact = false }: CareerCardProps) {
  const shortTitle = career.title.replace("Tecnicatura Superior en ", "");

  return (
    <article className="group flex h-full flex-col border border-[#CBD5E1] bg-white transition-colors hover:border-[#0A496C]">
      <div className={compact ? "p-6" : "p-7 md:p-8"}>
        <div className="mb-10 flex items-start justify-between gap-4">
          <span className="text-4xl font-semibold tracking-[-0.04em] text-[#E0E8EF]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="max-w-[55%] text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-[#64748B]">
            {career.area}
          </span>
        </div>
        <h3 className="min-h-20 text-xl font-semibold leading-tight tracking-[-0.02em] text-[#0A496C] md:text-2xl">
          {compact ? shortTitle : career.title}
        </h3>
        <div className="mt-6 space-y-2 text-sm text-[#52606D]">
          <p className="flex items-center gap-2">
            <Clock3 aria-hidden="true" className="size-4" />
            Duración: {career.duration}
          </p>
          <p className="flex items-center gap-2">
            <GraduationCap aria-hidden="true" className="size-4" />
            Título oficial
          </p>
        </div>
      </div>
      <div className="mt-auto px-7 pb-7 md:px-8 md:pb-8">
        <Link
          href={`/carreras/${career.slug}`}
          className="inline-flex items-center gap-3 text-sm font-semibold text-[#0A496C] underline-offset-4 hover:underline"
        >
          Ver carrera
          <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
