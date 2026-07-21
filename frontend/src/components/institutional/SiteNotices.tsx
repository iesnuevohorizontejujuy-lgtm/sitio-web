"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
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
  const [notices, setNotices] = useState<SiteNotice[]>([]);
  const [dismissedIds, setDismissedIds] = useState<number[]>([]);
  const isCampus = pathname.startsWith("/campus");

  const dismissNotice = useCallback((notice: SiteNotice) => {
    if (notice.frecuencia === "sesion") sessionStorage.setItem(storageKey(notice), "cerrado");
    if (notice.frecuencia === "una_vez") localStorage.setItem(storageKey(notice), "cerrado");
    setDismissedIds((current) => [...new Set([...current, notice.id])]);
  }, []);

  useEffect(() => {
    if (isCampus) return;

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
  }, [isCampus]);

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
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismissNotice(modal);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [dismissNotice, modal]);

  if (isCampus) return null;

  return (
    <>
      <AnimatePresence initial={false}>
        {strip && (
          <motion.aside initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="border-b border-white/15 bg-[#073A57] text-white" aria-label="Aviso institucional">
            <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3 lg:px-8">
              <Megaphone className="size-5 shrink-0 text-[#2CBEE7]" aria-hidden="true" />
              <div className="min-w-0 flex-1 text-sm"><strong>{strip.titulo}</strong><span className="ml-2 text-white/75">{strip.mensaje}</span></div>
              <NoticeAction notice={strip} compact />
              <button type="button" onClick={() => dismissNotice(strip)} className="shrink-0 rounded-md p-1 text-white/70 hover:bg-white/10 hover:text-white" aria-label={`Cerrar aviso: ${strip.titulo}`}><X className="size-5" /></button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {banner && (
          <motion.aside initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="border-b border-[#D8E1E8] bg-[#E0ECF8]" aria-label="Anuncio destacado">
            <div className="mx-auto grid max-w-7xl items-center gap-6 px-5 py-6 md:grid-cols-[minmax(0,1fr)_auto] lg:px-8">
              <div className="flex items-start gap-4">
                {banner.imagen ? <div className="relative hidden size-24 shrink-0 overflow-hidden rounded-xl bg-white sm:block"><Image src={banner.imagen} alt="" fill unoptimized sizes="96px" className="object-cover" /></div> : <Megaphone className="mt-1 size-7 shrink-0 text-[#0A496C]" />}
                <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0A496C]">Información institucional</p><h2 className="mt-2 text-xl font-semibold text-[#0A496C]">{banner.titulo}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-[#52606D]">{banner.mensaje}</p></div>
              </div>
              <div className="flex items-center gap-3"><NoticeAction notice={banner} /><button type="button" onClick={() => dismissNotice(banner)} className="rounded-lg border border-[#AFC4D8] p-2 text-[#0A496C] hover:bg-white" aria-label={`Cerrar aviso: ${banner.titulo}`}><X className="size-5" /></button></div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modal && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#031D2C]/75 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) dismissNotice(modal); }}>
            <motion.section role="dialog" aria-modal="true" aria-labelledby={`notice-title-${modal.id}`} aria-describedby={`notice-message-${modal.id}`} initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }} transition={{ duration: 0.22 }} className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
              <button ref={closeButtonRef} type="button" onClick={() => dismissNotice(modal)} className="absolute right-4 top-4 z-10 rounded-full bg-white/95 p-2 text-[#0A496C] shadow-sm hover:bg-[#E0ECF8]" aria-label={`Cerrar aviso: ${modal.titulo}`}><X className="size-5" /></button>
              {modal.imagen && <div className="relative aspect-[16/7] min-h-48 overflow-hidden rounded-t-2xl bg-[#E0ECF8]"><Image src={modal.imagen} alt="" fill unoptimized sizes="(max-width: 768px) 100vw, 768px" className="object-cover" /></div>}
              <div className="p-7 md:p-10">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#0A496C]"><Megaphone className="size-4 text-[#2CBEE7]" />Aviso institucional</p>
                <h2 id={`notice-title-${modal.id}`} className="mt-4 text-3xl font-semibold tracking-[-0.025em] text-[#0A496C] md:text-4xl">{modal.titulo}</h2>
                <p id={`notice-message-${modal.id}`} className="mt-5 whitespace-pre-line text-base leading-7 text-[#52606D]">{modal.mensaje}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row"><NoticeAction notice={modal} /><button type="button" onClick={() => dismissNotice(modal)} className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#AFC4D8] px-5 py-3 text-sm font-semibold text-[#0A496C] hover:bg-[#F7F9FB]">Cerrar</button></div>
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
    ? "hidden shrink-0 items-center gap-2 text-xs font-semibold text-[#2CBEE7] underline underline-offset-4 sm:inline-flex"
    : "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#0A496C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#073A57]";
  const content = <>{notice.texto_enlace}<ArrowRight className="size-4" /></>;

  return notice.url_enlace.startsWith("/")
    ? <Link href={notice.url_enlace} className={className}>{content}</Link>
    : <a href={notice.url_enlace} target="_blank" rel="noreferrer" className={className}>{content}</a>;
}
