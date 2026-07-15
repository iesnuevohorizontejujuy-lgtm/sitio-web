"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { CareerCard } from "@/components/institutional/CareerCard";
import type { Career } from "@/types/career";

interface CareerCarouselProps {
  careers: Career[];
}

export function CareerCarousel({ careers }: CareerCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  function move(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;

    track.scrollBy({
      left: direction * Math.min(track.clientWidth * 0.85, 440),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  return (
    <div className="relative">
      <div className="mb-5 flex justify-end gap-2">
        <button type="button" onClick={() => move(-1)} aria-label="Ver carreras anteriores" className="inline-flex size-11 items-center justify-center rounded-lg border border-[#AFC4D8] text-[#0A496C] transition hover:border-[#0A496C] hover:bg-[#E0ECF8]">
          <ChevronLeft className="size-5" />
        </button>
        <button type="button" onClick={() => move(1)} aria-label="Ver carreras siguientes" className="inline-flex size-11 items-center justify-center rounded-lg border border-[#AFC4D8] text-[#0A496C] transition hover:border-[#0A496C] hover:bg-[#E0ECF8]">
          <ChevronRight className="size-5" />
        </button>
      </div>
      <div ref={trackRef} className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {careers.map((career, index) => (
          <motion.div
            key={career.slug}
            className="min-w-[86%] snap-start sm:min-w-[48%] xl:min-w-[calc(25%-15px)]"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
          >
            <CareerCard career={career} index={index} compact />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
