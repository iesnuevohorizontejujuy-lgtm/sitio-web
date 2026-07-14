"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CareerGalleryImage } from "@/types/career";

export function CareerGallery({ images }: { images: CareerGalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  if (!activeImage) return null;

  const move = (direction: number) => {
    setActiveIndex((current) => (current + direction + images.length) % images.length);
  };

  return (
    <div>
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-[#CBD5E1] bg-[#E0ECF8]">
        <Image src={activeImage.url} alt={activeImage.alt} fill unoptimized sizes="(max-width: 1280px) 100vw, 1200px" className="object-cover" />
        {images.length > 1 && (
          <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between">
            <button type="button" onClick={() => move(-1)} aria-label="Fotografía anterior" className="grid size-11 place-items-center rounded-full bg-white text-[#0A496C] shadow-lg"><ChevronLeft className="size-5" /></button>
            <button type="button" onClick={() => move(1)} aria-label="Fotografía siguiente" className="grid size-11 place-items-center rounded-full bg-white text-[#0A496C] shadow-lg"><ChevronRight className="size-5" /></button>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-5">
        <p className="text-sm leading-6 text-[#52606D]">{activeImage.caption || activeImage.alt}</p>
        <span className="shrink-0 text-sm font-semibold text-[#0A496C]">{activeIndex + 1} / {images.length}</span>
      </div>
      {images.length > 1 && (
        <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button key={image.id} type="button" onClick={() => setActiveIndex(index)} aria-label={`Ver fotografía ${index + 1}`} aria-current={index === activeIndex} className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 ${index === activeIndex ? "border-[#2CBEE7]" : "border-transparent"}`}>
              <Image src={image.url} alt="" fill unoptimized sizes="112px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
