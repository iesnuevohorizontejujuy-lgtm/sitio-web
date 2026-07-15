"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CareerGalleryImage } from "@/types/career";

const MAX_GALLERY_IMAGES = 8;

export function CareerGallery({ images }: { images: CareerGalleryImage[] }) {
  const gallery = images.slice(0, MAX_GALLERY_IMAGES);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();
  const activeImage = gallery[activeIndex];

  if (!activeImage) return null;

  function select(index: number) {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex((index + gallery.length) % gallery.length);
  }

  function move(step: number) {
    select(activeIndex + step);
  }

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#B7CADB] bg-[#E0ECF8] md:aspect-[16/9]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={activeImage.id}
            custom={direction}
            initial={reduceMotion ? false : { opacity: 0, x: direction * 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * -28 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image src={activeImage.url} alt={activeImage.alt} fill unoptimized sizes="(max-width: 1280px) 100vw, 1200px" className="object-cover" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-x-0 bottom-0 bg-[#073A57]/90 px-5 py-4 text-white md:max-w-3xl md:px-8 md:py-5">
          <AnimatePresence initial={false} mode="wait">
            <motion.p key={activeImage.id} initial={reduceMotion ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="max-w-2xl text-sm leading-6 md:text-base">
              {activeImage.caption || activeImage.alt}
            </motion.p>
          </AnimatePresence>
        </div>

        {gallery.length > 1 && (
          <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between md:inset-x-6">
            <button type="button" onClick={() => move(-1)} aria-label="Fotografía anterior" className="grid size-11 place-items-center rounded-lg bg-white/95 text-[#0A496C] shadow-[0_4px_18px_rgba(7,58,87,0.2)] transition hover:bg-[#2CBEE7]"><ChevronLeft className="size-5" /></button>
            <button type="button" onClick={() => move(1)} aria-label="Fotografía siguiente" className="grid size-11 place-items-center rounded-lg bg-white/95 text-[#0A496C] shadow-[0_4px_18px_rgba(7,58,87,0.2)] transition hover:bg-[#2CBEE7]"><ChevronRight className="size-5" /></button>
          </div>
        )}

        <span className="absolute right-5 top-5 rounded-lg bg-[#073A57]/90 px-3 py-2 text-xs font-semibold tracking-[0.12em] text-white backdrop-blur-sm">
          {String(activeIndex + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}
        </span>
      </div>

      {gallery.length > 1 && (
        <>
          <div className="mt-4 h-0.5 overflow-hidden bg-[#D8E1E8]" aria-hidden="true">
            <motion.div className="h-full bg-[#2CBEE7]" animate={{ width: `${((activeIndex + 1) / gallery.length) * 100}%` }} transition={{ duration: reduceMotion ? 0 : 0.35 }} />
          </div>
          <div className="mt-5 flex snap-x gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {gallery.map((image, index) => (
              <button key={image.id} type="button" onClick={() => select(index)} aria-label={`Ver fotografía ${index + 1}: ${image.alt}`} aria-current={index === activeIndex} className={`relative h-20 w-28 shrink-0 snap-start overflow-hidden rounded-lg border-2 transition ${index === activeIndex ? "border-[#2CBEE7] opacity-100" : "border-transparent opacity-65 hover:opacity-100"}`}>
                <Image src={image.url} alt="" fill unoptimized sizes="112px" className="object-cover" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
