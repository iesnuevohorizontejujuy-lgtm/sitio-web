"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getImageProps } from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";

export type HomeHeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  mobileImage?: string;
  imageAlt: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export function HeroMediaCarousel({ slides }: { slides: HomeHeroSlide[] }) {
  const shouldReduceMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (slides.length < 2 || isPaused || shouldReduceMotion) return;
    const interval = window.setInterval(() => setCurrent((index) => (index + 1) % slides.length), 7000);
    return () => window.clearInterval(interval);
  }, [isPaused, shouldReduceMotion, slides.length]);

  if (slides.length === 0) return null;

  const showPrevious = () => setCurrent((index) => (index - 1 + slides.length) % slides.length);
  const showNext = () => setCurrent((index) => (index + 1) % slides.length);

  return (
    <section aria-roledescription="carrusel" aria-label="Información destacada del instituto" className="relative isolate min-h-[660px] overflow-hidden bg-[#073A57] sm:min-h-[700px] lg:min-h-[640px]">
      {current !== 0 ? <h1 className="sr-only">{slides[0].title}</h1> : null}
      <AnimatePresence initial={false} mode="sync">
        {slides.map((slide, index) => {
          if (index !== current) return null;

          const desktopImage = getImageProps({
            src: slide.image,
            alt: slide.imageAlt,
            width: 1920,
            height: 1080,
            sizes: "100vw",
            loading: index === 0 ? "eager" : "lazy",
            fetchPriority: index === 0 ? "high" : "auto",
          });
          const mobileImage = getImageProps({
            src: slide.mobileImage ?? slide.image,
            alt: slide.imageAlt,
            width: 900,
            height: 1200,
            sizes: "100vw",
            loading: index === 0 ? "eager" : "lazy",
            fetchPriority: index === 0 ? "high" : "auto",
          });

          return (
            <motion.article key={slide.id} aria-roledescription="diapositiva" aria-label={`${index + 1} de ${slides.length}`} initial={shouldReduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={shouldReduceMotion ? undefined : { opacity: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="absolute inset-0">
              <picture>
                <source media="(max-width: 639px)" srcSet={mobileImage.props.srcSet} />
                <img {...desktopImage.props} alt={slide.imageAlt} className="absolute inset-0 h-full w-full object-cover object-center" />
              </picture>
              <div className="absolute inset-0 bg-[#073A57]/65" aria-hidden="true" />
              <div className="absolute inset-x-0 top-0 h-1 bg-[#2CBEE7]" aria-hidden="true" />

              <div className="relative z-10 mx-auto flex min-h-[660px] max-w-7xl items-center px-5 pb-28 pt-16 text-white sm:min-h-[700px] sm:px-8 lg:min-h-[640px] lg:pb-32 lg:pt-20">
                <div className="mx-auto max-w-5xl text-center">
                  <p className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8CDDF3]"><span className="h-px w-10 bg-[#2CBEE7]" aria-hidden="true" />{slide.eyebrow}<span className="h-px w-10 bg-[#2CBEE7]" aria-hidden="true" /></p>
                  {index === 0 ? <h1 className="mt-6 line-clamp-3 text-balance text-4xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">{slide.title}</h1> : <h2 className="mt-6 line-clamp-3 text-balance text-4xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">{slide.title}</h2>}
                  <p className="mx-auto mt-6 line-clamp-3 max-w-3xl text-pretty text-base leading-7 text-white/85 sm:text-lg sm:leading-8">{slide.description}</p>
                  <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                    <HeroAction href={slide.primaryHref} primary>{slide.primaryLabel}</HeroAction>
                    {slide.secondaryHref && slide.secondaryLabel ? <HeroAction href={slide.secondaryHref}>{slide.secondaryLabel}</HeroAction> : null}
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </AnimatePresence>

      {slides.length > 1 ? (
        <div className="absolute inset-x-0 bottom-7 z-20 mx-auto flex w-fit items-center gap-1 rounded-full bg-[#073A57]/75 px-2 py-1.5 text-white backdrop-blur-sm sm:bottom-8">
          <button type="button" onClick={showPrevious} className="inline-flex size-11 items-center justify-center rounded-full hover:bg-white hover:text-[#0A496C] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2CBEE7]/40" aria-label="Ver diapositiva anterior"><ArrowLeft className="size-4" aria-hidden="true" /></button>
          <div className="flex items-center" aria-label="Seleccionar diapositiva">
            {slides.map((slide, index) => <button key={slide.id} type="button" onClick={() => setCurrent(index)} className="group inline-flex size-10 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2CBEE7]/40" aria-label={`Ir a la diapositiva ${index + 1}`} aria-current={index === current ? "true" : undefined}><span className={`h-2.5 rounded-full transition-[width,background-color] ${index === current ? "w-7 bg-[#2CBEE7]" : "w-2.5 bg-white/50 group-hover:bg-white"}`} aria-hidden="true" /></button>)}
          </div>
          <button type="button" onClick={showNext} className="inline-flex size-11 items-center justify-center rounded-full hover:bg-white hover:text-[#0A496C] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2CBEE7]/40" aria-label="Ver diapositiva siguiente"><ArrowRight className="size-4" aria-hidden="true" /></button>
          {!shouldReduceMotion ? <button type="button" onClick={() => setIsPaused((paused) => !paused)} className="inline-flex size-11 items-center justify-center rounded-full hover:bg-white hover:text-[#0A496C] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2CBEE7]/40" aria-label={isPaused ? "Reanudar carrusel" : "Pausar carrusel"}>{isPaused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}</button> : null}
        </div>
      ) : null}
    </section>
  );
}

function HeroAction({ href, primary = false, children }: { href: string; primary?: boolean; children: React.ReactNode }) {
  const className = primary
    ? "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#2CBEE7] px-7 py-3 text-center text-sm font-semibold text-[#073A57] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2CBEE7]/35 sm:w-auto"
    : "inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-white/65 bg-[#073A57]/30 px-7 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#0A496C] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2CBEE7]/35 sm:w-auto";
  const content = <>{children}{primary ? <ArrowRight className="size-4" aria-hidden="true" /> : null}</>;
  return href.startsWith("/") ? <Link href={href} className={className}>{content}</Link> : <a href={href} target="_blank" rel="noreferrer" className={className}>{content}</a>;
}
