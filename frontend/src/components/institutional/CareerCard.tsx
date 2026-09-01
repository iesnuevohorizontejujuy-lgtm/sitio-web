import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, GraduationCap } from "lucide-react";
import type { Career } from "@/types/career";

interface CareerCardProps {
  career: Career;
  index: number;
  compact?: boolean;
}

const fallbackImages: Record<Career["area"], string> = {
  Salud: "/institutional/students-collaboration.png",
  Tecnología: "/institutional/software-students.png",
  Gestión: "/institutional/professor-classroom.png",
  "Sociedad y comunicación": "/instituto.jpg",
  "Actividad física": "/institutional/students-collaboration.png",
};

export function CareerCard({ career, index, compact = false }: CareerCardProps) {
  const shortTitle = career.title.replace("Tecnicatura Superior en ", "");
  const cardImage = career.imageThumb ?? career.image ?? career.gallery[0]?.url ?? fallbackImages[career.area];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#CBD5E1] bg-white transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-[#0A496C] hover:shadow-[0_16px_32px_rgba(10,73,108,0.10)]">
      <div className={`relative overflow-hidden bg-[#E0ECF8] ${compact ? "aspect-[16/8]" : "aspect-[16/10]"}`}>
        <Image
          src={cardImage}
          alt=""
          fill
          sizes={compact ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
        />
        {/*<div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
          <span className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg bg-white px-2 text-sm font-bold tabular-nums text-[#0A496C] shadow-sm">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="max-w-[70%] rounded-md bg-[#073A57] px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
            {career.area}
          </span>
        </div>*/}
      </div>

      <div className={compact ? "p-6" : "p-6 md:p-7"}>
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
      <div className="mt-auto px-6 pb-6 md:px-7 md:pb-7">
        <Link
          href={`/carreras/${career.slug}`}
          className="inline-flex min-h-11 items-center gap-3 border-t border-[#D8E1E8] pt-4 text-sm font-semibold text-[#0A496C] underline-offset-4 hover:underline"
        >
          Ver carrera
          <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
