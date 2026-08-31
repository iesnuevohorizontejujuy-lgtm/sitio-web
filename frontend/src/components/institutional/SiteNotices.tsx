"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Megaphone, X } from "lucide-react";
import { publicFetch } from "@/lib/public-api";
import type { SiteNotice } from "@/types/site-notice";

const pageKeyForPath = (pathname: string): string => {
  if (pathname === "/") return "inicio";
  if (pathname.startsWith("/institucion")) return "institucion";
  if (pathname.startsWith("/carreras")) return "carreras";
  if (pathname.startsWith("/ingresantes")) return "ingresantes";
  if (pathname.startsWith("/vida-institucional") || pathname.startsWith("/noticias")) return "vida_institucional";
  return "otra";
};

const storageKey = (notice: SiteNotice) => `iesnh:aviso:${notice.id}`;

export function SiteNotices() {
  const pathname = usePathname();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const [notices, setNotices] = useState<SiteNotice[]>([]);
  const [dismissedIds, setDismissedIds] = useState<number[]>([]);

  const dismissNotice = useCallback((notice: SiteNotice) => {
    if (notice.frecuencia === "sesion") sessionStorage.setItem(storageKey(notice), "cerrado");
    if (notice.frecuencia === "una_vez") localStorage.setItem(storageKey(notice), "cerrado");
    setDismissedIds((current) => [...new Set([...current, notice.id])]);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    publicFetch("/avisos", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) return [];
        const payload = (await response.json()) as SiteNotice[] | { data?: SiteNotice[] };
        return Array.isArray(payload) ? payload : (payload.data ?? []);
      })
      .then((items) => {
        const alreadySeen = items.filter((notice) => {
          if (notice.frecuencia === "sesion") return sessionStorage.getItem(storageKey(notice)) === "cerrado";
          if (notice.frecuencia === "una_vez") return localStorage.getItem(storageKey(notice)) === "cerrado";
          return false;
        }).map((notice) => notice.id);

        setDismissedIds(alreadySeen);
        setNotices(items);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setNotices([]);
      });

    return () => controller.abort();
  }, []);

  const visibleNotices = useMemo(() => {
    const pageKey = pageKeyForPath(pathname);
    return notices.filter((notice) =>
      !dismissedIds.includes(notice.id)
      && (notice.paginas.includes("todas") || notice.paginas.includes(pageKey)),
    );
  }, [dismissedIds, notices, pathname]);

  const modal = visibleNotices.find((notice) => notice.presentacion === "modal");
  const strip = visibleNotices.find((notice) => notice.presentacion === "franja");
  const banner = visibleNotices.find((notice) => notice.presentacion === "banner");

  useEffect(() => {
    if (!modal) return;

    const previousOverflow = document.body.style.overflow;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const handleDialogKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismissNotice(modal);
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleDialogKeyboard);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleDialogKeyboard);
      previousFocusRef.current?.focus();
    };
  }, [dismissNotice, modal]);

  return (
    <>
      <AnimatePresence initial={false}>
        {strip && (
          <motion.aside initial={reduceMotion ? false : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -8 }} className="border-b border-white/15 bg-[#073A57] text-white" aria-label="Aviso institucional" role="status" aria-live="polite">
            <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3 lg:px-8">
              <Megaphone className="size-5 shrink-0 text-[#2CBEE7]" aria-hidden="true" />
              <div className="min-w-0 flex-1 text-sm"><strong>{strip.titulo}</strong><span className="ml-2 text-white/75">{strip.mensaje}</span></div>
              <NoticeAction notice={strip} compact />
              <button type="button" onClick={() => dismissNotice(strip)} className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-white/80 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2CBEE7]" aria-label={`Cerrar aviso: ${strip.titulo}`}><X className="size-5" aria-hidden="true" /></button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {banner && (
          <motion.aside initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0 }} className="border-b border-[#D8E1E8] bg-[#E0ECF8]" aria-label="Anuncio destacado" role="status" aria-live="polite">
            <div className="mx-auto grid max-w-7xl items-center gap-6 px-5 py-6 md:grid-cols-[minmax(0,1fr)_auto] lg:px-8">
              <div className="flex items-start gap-4">
                {banner.imagen ? <div className="relative hidden size-24 shrink-0 overflow-hidden rounded-xl bg-white sm:block"><Image src={banner.imagen} alt="" fill sizes="96px" className="object-cover" /></div> : <Megaphone className="mt-1 size-7 shrink-0 text-[#0A496C]" aria-hidden="true" />}
                <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0A496C]">Información institucional</p><h2 className="mt-2 text-xl font-semibold text-[#0A496C]">{banner.titulo}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-[#52606D]">{banner.mensaje}</p></div>
              </div>
              <div className="flex items-center gap-3"><NoticeAction notice={banner} /><button type="button" onClick={() => dismissNotice(banner)} className="inline-flex size-11 items-center justify-center rounded-lg border border-[#AFC4D8] text-[#0A496C] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2CBEE7]" aria-label={`Cerrar aviso: ${banner.titulo}`}><X className="size-5" aria-hidden="true" /></button></div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modal && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#031D2C]/75 p-4" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={reduceMotion ? undefined : { opacity: 0 }} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) dismissNotice(modal); }}>
            <motion.section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={`notice-title-${modal.id}`} aria-describedby={`notice-message-${modal.id}`} initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.98 }} transition={{ duration: reduceMotion ? 0 : 0.22 }} className="relative max-h-[90vh] w-full max-w-3xl overscroll-contain overflow-y-auto rounded-2xl bg-white shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
              <button ref={closeButtonRef} type="button" onClick={() => dismissNotice(modal)} className="absolute right-4 top-4 z-10 inline-flex size-11 items-center justify-center rounded-full bg-white/95 text-[#0A496C] shadow-sm hover:bg-[#E0ECF8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2CBEE7]/40" aria-label={`Cerrar aviso: ${modal.titulo}`}><X className="size-5" aria-hidden="true" /></button>
              {modal.imagen && <div className="relative aspect-[16/7] min-h-48 overflow-hidden rounded-t-2xl bg-[#E0ECF8]"><Image src={modal.imagen} alt="" fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" /></div>}
              <div className="p-7 md:p-10">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#0A496C]"><Megaphone className="size-4 text-[#2CBEE7]" aria-hidden="true" />Aviso institucional</p>
                <h2 id={`notice-title-${modal.id}`} className="mt-4 text-3xl font-semibold tracking-[-0.025em] text-[#0A496C] md:text-4xl">{modal.titulo}</h2>
                <p id={`notice-message-${modal.id}`} className="mt-5 break-words whitespace-pre-line text-base leading-7 text-[#52606D]">{modal.mensaje}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row"><NoticeAction notice={modal} /><button type="button" onClick={() => dismissNotice(modal)} className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#AFC4D8] px-5 py-3 text-sm font-semibold text-[#0A496C] hover:bg-[#F7F9FB] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2CBEE7]/40">Cerrar</button></div>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NoticeAction({ notice, compact = false }: { notice: SiteNotice; compact?: boolean }) {
  if (!notice.url_enlace || !notice.texto_enlace) return null;

  const className = compact
    ? "hidden min-h-11 shrink-0 items-center gap-2 text-xs font-semibold text-[#8CDDF3] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2CBEE7] sm:inline-flex"
    : "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#0A496C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#073A57] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2CBEE7]/40";
  const content = <>{notice.texto_enlace}<ArrowRight className="size-4" aria-hidden="true" /></>;

  return notice.url_enlace.startsWith("/")
    ? <Link href={notice.url_enlace} className={className}>{content}</Link>
    : <a href={notice.url_enlace} target="_blank" rel="noreferrer" className={className}>{content}</a>;
}
