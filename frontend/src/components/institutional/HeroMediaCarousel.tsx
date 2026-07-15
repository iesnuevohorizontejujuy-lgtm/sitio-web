"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";

const slides = [
  {
    src: "/instituto.jpg",
    alt: "Sala de informática del IES Nuevo Horizonte",
    title: "Espacios para aprender",
    text: "Formación técnica en un entorno pensado para la práctica.",
  },
  {
    src: "/institutional/students-collaboration.png",
    alt: "Estudiantes trabajando en una actividad colaborativa",
    title: "Aprender haciendo",
    text: "Experiencias prácticas y trabajo compartido desde la formación.",
  },
  {
    src: "/institutional/professor-classroom.png",
    alt: "Docente acompañando una clase",
    title: "Acompañamiento cercano",
    text: "Docentes presentes durante cada etapa del recorrido académico.",
  },
] as const;

export function HeroMediaCarousel() {
  const [active, setActive] = useState(0);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const reduceMotion = useReducedMotion();
  const isPaused = manuallyPaused || interacting;

  useEffect(() => {
    if (isPaused || reduceMotion) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [isPaused, reduceMotion]);

  const slide = slides[active];

  return (
    <div
      className="relative"
      aria-roledescription="carrusel"
      aria-label="Experiencias en el IES Nuevo Horizonte"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={() => setInteracting(false)}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#CBD5E1] bg-[#E0ECF8]">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={slide.src}
            className="absolute inset-0"
            initial={reduceMotion ? false : { opacity: 0, scale: 1.015 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.995 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={active === 0}
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute right-4 top-4 flex items-center gap-3 rounded-lg bg-[#073A57]/90 px-3 py-2 text-xs font-semibold tracking-[0.14em] text-white backdrop-blur-sm">
          <span>{String(active + 1).padStart(2, "0")}</span>
          <span className="h-px w-6 bg-[#2CBEE7]" />
          <span className="text-white/60">{String(slides.length).padStart(2, "0")}</span>
        </div>
      </div>

      <div className="absolute bottom-5 left-5 max-w-[260px] border-l-4 border-[#2CBEE7] bg-white p-5 shadow-[0_4px_20px_rgba(10,73,108,0.12)] sm:bottom-7 sm:left-7">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={slide.title}
            initial={reduceMotion ? false : { opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
            transition={{ duration: 0.35 }}
            aria-live="polite"
          >
            <p className="font-semibold text-[#0A496C]">{slide.title}</p>
            <p className="mt-1 text-sm leading-5 text-[#52606D]">{slide.text}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2" aria-label="Seleccionar escena">
          {slides.map((item, index) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Mostrar escena ${index + 1}: ${item.title}`}
              aria-current={active === index}
              className={`h-1.5 rounded-full transition-all ${active === index ? "w-10 bg-[#0A496C]" : "w-5 bg-[#B7CADB] hover:bg-[#7893AA]"}`}
            />
          ))}
        </div>
        {!reduceMotion && (
          <button
            type="button"
            onClick={() => setManuallyPaused((current) => !current)}
            aria-label={manuallyPaused ? "Reanudar carrusel" : "Pausar carrusel"}
            className="inline-flex size-10 items-center justify-center rounded-lg border border-[#B7CADB] text-[#0A496C] transition hover:border-[#0A496C] hover:bg-[#E0ECF8]"
          >
            {manuallyPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
          </button>
        )}
      </div>
    </div>
  );
}
