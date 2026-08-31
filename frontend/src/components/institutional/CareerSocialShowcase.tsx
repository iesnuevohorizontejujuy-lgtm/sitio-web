"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ExternalLink, Facebook, Instagram, Play, Youtube } from "lucide-react";
import type { CareerSocialPlatform, CareerSocialPost } from "@/types/career";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

const platformLabels: Record<CareerSocialPlatform, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  facebook: "Facebook",
  tiktok: "TikTok",
};

const typeLabels: Record<CareerSocialPost["type"], string> = {
  reel: "Reel",
  publicacion: "Publicación",
  video: "Video",
  actividad: "Actividad institucional",
};

export function CareerSocialShowcase({ posts, fallbackImage }: { posts: CareerSocialPost[]; fallbackImage?: string | null }) {
  const visiblePosts = posts.slice(0, 3);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showEmbed, setShowEmbed] = useState(false);
  const reduceMotion = useReducedMotion();
  const activePost = visiblePosts[activeIndex];

  if (!activePost) return null;

  const canEmbed = activePost.platform === "instagram";
  const date = formatDate(activePost.publishedAt);

  function selectPost(index: number) {
    setActiveIndex(index);
    setShowEmbed(false);
  }

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-12">
      <article className="min-w-0 overflow-hidden rounded-2xl border border-[#B7CADB] bg-white lg:col-span-8">
        <div className="relative min-h-[430px] bg-[#073A57] sm:min-h-[560px]">
          {showEmbed && canEmbed ? (
            <div className="flex min-h-[560px] items-center justify-center bg-[#F4F7F9] px-2 py-5">
              <InstagramEmbed url={activePost.url} title={activePost.title} />
            </div>
          ) : (
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={activePost.id}
                initial={reduceMotion ? false : { opacity: 0, scale: 1.01 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.35 }}
                className="absolute inset-0"
              >
                {activePost.previewImage || fallbackImage ? (
                  <Image src={activePost.previewImage || fallbackImage || ""} alt={activePost.previewAlt || `Actividad: ${activePost.title}`} fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col justify-between p-8 text-white sm:p-10">
                    <PlatformIcon platform={activePost.platform} className="size-10 text-[#8CDDF3]" />
                    <p className="mb-28 text-xs font-semibold uppercase tracking-[0.18em] text-[#8CDDF3]">IES Nuevo Horizonte</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {!showEmbed ? (
            <div className="absolute inset-x-0 bottom-0 bg-[#031D2C]/92 p-6 text-white sm:p-8">
              <div className="flex items-end justify-between gap-6">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8CDDF3]">{platformLabels[activePost.platform]} · {typeLabels[activePost.type]}</p>
                  <h3 className="mt-3 text-balance text-2xl font-semibold leading-tight sm:text-3xl">{activePost.title}</h3>
                  {activePost.description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">{activePost.description}</p> : null}
                </div>
                {canEmbed ? (
                  <button type="button" onClick={() => setShowEmbed(true)} className="grid size-14 shrink-0 place-items-center rounded-full bg-[#2CBEE7] text-[#073A57] transition-[background-color,transform] hover:scale-105 hover:bg-white" aria-label={`Reproducir ${activePost.title}`}>
                    <Play className="ml-0.5 size-6 fill-current" aria-hidden="true" />
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 border-t border-[#D8E1E8] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#52606D]">
            <span>{activePost.account || "IES Nuevo Horizonte"}</span>
            {date ? <time dateTime={activePost.publishedAt ?? undefined} className="ml-3">{date}</time> : null}
          </div>
          <a href={activePost.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0A496C] underline decoration-[#2CBEE7] decoration-2 underline-offset-4">
            Abrir publicación original
            <ExternalLink className="size-4" aria-hidden="true" />
          </a>
        </div>
      </article>

      {visiblePosts.length > 1 ? (
        <aside className="min-w-0 lg:col-span-4" aria-label="Más actividades de la carrera">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#0A496C]">Más actividades</p>
          <div className="flex snap-x gap-4 overflow-x-auto pb-3 lg:grid lg:overflow-visible lg:pb-0">
            {visiblePosts.map((post, index) => (
              <button key={post.id} type="button" onClick={() => selectPost(index)} aria-pressed={index === activeIndex} className={`group grid min-w-[270px] snap-start grid-cols-[104px_1fr] overflow-hidden rounded-xl border bg-white text-left transition-[border-color,box-shadow] lg:min-w-0 ${index === activeIndex ? "border-[#0A496C] shadow-[0_6px_18px_rgba(10,73,108,0.1)]" : "border-[#C6D7E5] hover:border-[#2CBEE7]"}`}>
                <span className="relative min-h-28 bg-[#E0ECF8]">
                  {post.previewImage || fallbackImage ? <Image src={post.previewImage || fallbackImage || ""} alt="" fill sizes="104px" className="object-cover" /> : <span className="grid h-full place-items-center bg-[#073A57] text-[#8CDDF3]"><PlatformIcon platform={post.platform} className="size-6" /></span>}
                </span>
                <span className="min-w-0 p-4">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#0A6F94]">{typeLabels[post.type]}</span>
                  <span className="mt-2 line-clamp-3 block text-sm font-semibold leading-5 text-[#0A496C]">{post.title}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#52606D]">Ver actividad <Play className="size-3" aria-hidden="true" /></span>
                </span>
              </button>
            ))}
          </div>
        </aside>
      ) : null}
    </div>
  );
}

function InstagramEmbed({ url, title }: { url: string; title: string }) {
  useEffect(() => {
    const processEmbeds = () => window.instgrm?.Embeds.process();
    const existingScript = document.getElementById("instagram-embed-script") as HTMLScriptElement | null;

    if (window.instgrm) {
      processEmbeds();
      return;
    }
    if (existingScript) {
      existingScript.addEventListener("load", processEmbeds);
      return () => existingScript.removeEventListener("load", processEmbeds);
    }

    const script = document.createElement("script");
    script.id = "instagram-embed-script";
    script.async = true;
    script.src = "https://www.instagram.com/embed.js";
    script.addEventListener("load", processEmbeds);
    document.body.appendChild(script);
    return () => script.removeEventListener("load", processEmbeds);
  }, [url]);

  return (
    <blockquote className="instagram-media mx-auto" data-instgrm-permalink={url} data-instgrm-version="14" style={{ background: "#fff", border: 0, margin: "0 auto", maxWidth: 540, minWidth: 280, width: "100%" }}>
      <a href={url} target="_blank" rel="noreferrer" className="sr-only">{title} en Instagram</a>
    </blockquote>
  );
}

function PlatformIcon({ platform, className }: { platform: CareerSocialPlatform; className?: string }) {
  if (platform === "instagram") return <Instagram className={className} aria-hidden="true" />;
  if (platform === "youtube") return <Youtube className={className} aria-hidden="true" />;
  if (platform === "facebook") return <Facebook className={className} aria-hidden="true" />;
  return <Play className={className} aria-hidden="true" />;
}

function formatDate(value?: string | null): string | null {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("es-AR", { month: "short", year: "numeric" }).format(date);
}
