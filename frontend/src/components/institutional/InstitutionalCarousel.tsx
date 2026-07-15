"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    src: "/institutional/students-collaboration.png",
    alt: "Estudiantes trabajando de manera colaborativa",
    title: "Aprender con otros",
    text: "La formación se construye con intercambio, acompañamiento y trabajo compartido.",
  },
  {
    src: "/institutional/professor-classroom.png",
    alt: "Docente acompañando una clase",
    title: "Docentes presentes",
    text: "Una propuesta cercana que conecta conocimientos con situaciones profesionales concretas.",
  },
  {
    src: "/institutional/software-students.png",
    alt: "Estudiantes desarrollando una actividad práctica",
    title: "Práctica desde el comienzo",
    text: "Espacios para aplicar lo aprendido y fortalecer capacidades para el mundo del trabajo.",
  },
] as const;

export function InstitutionalCarousel() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();

  function select(next: number) {
    setDirection(next > active ? 1 : -1);
    setActive((next + slides.length) % slides.length);
  }

  const slide = slides[active];

  return (
    <div className="overflow-hidden rounded-2xl border border-[#B7CADB] bg-white">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#E0ECF8] md:aspect-[16/8]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={slide.src}
            custom={direction}
            initial={reduceMotion ? false : { opacity: 0, x: direction * 36 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * -36 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image src={slide.src} alt={slide.alt} fill priority={active === 0} sizes="(max-width: 1280px) 100vw, 1200px" className="object-cover" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-x-0 bottom-0 bg-[#073A57]/90 p-5 text-white md:max-w-xl md:p-7">
          <p className="text-xl font-semibold md:text-2xl">{slide.title}</p>
          <p className="mt-2 text-sm leading-6 text-white/75 md:text-base">{slide.text}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-5 px-5 py-4">
        <div className="flex gap-2" aria-label="Seleccionar imagen">
          {slides.map((item, index) => (
            <button key={item.src} type="button" onClick={() => select(index)} aria-label={`Ver imagen ${index + 1}`} aria-current={active === index} className={`h-1.5 rounded-full transition-all ${active === index ? "w-8 bg-[#0A496C]" : "w-4 bg-[#B7CADB] hover:bg-[#7893AA]"}`} />
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => select(active - 1)} aria-label="Imagen anterior" className="inline-flex size-10 items-center justify-center rounded-lg border border-[#B7CADB] text-[#0A496C] hover:bg-[#E0ECF8]"><ChevronLeft className="size-5" /></button>
          <button type="button" onClick={() => select(active + 1)} aria-label="Imagen siguiente" className="inline-flex size-10 items-center justify-center rounded-lg border border-[#B7CADB] text-[#0A496C] hover:bg-[#E0ECF8]"><ChevronRight className="size-5" /></button>
        </div>
      </div>
    </div>
  );
}
