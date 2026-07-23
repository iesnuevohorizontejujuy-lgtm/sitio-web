"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, Facebook, Instagram, Play, Youtube } from "lucide-react";
import type { CareerSocialPlatform, CareerSocialPost } from "@/types/career";

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
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

export function CareerSocialShowcase({ posts }: { posts: CareerSocialPost[] }) {
  const visiblePosts = posts.slice(0, 3);
  const layoutClass = visiblePosts.length === 1
    ? "max-w-xl"
    : visiblePosts.length === 2
      ? "lg:grid-cols-2"
      : "lg:grid-cols-3";

  return (
    <div className={`grid gap-6 ${layoutClass}`}>
      {visiblePosts.map((post, index) => (
        <SocialPostCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
}

function SocialPostCard({ post, index }: { post: CareerSocialPost; index: number }) {
  const [showEmbed, setShowEmbed] = useState(false);
  const reduceMotion = useReducedMotion();
  const canEmbed = post.platform === "instagram";
  const date = formatDate(post.publishedAt);

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: reduceMotion ? 0 : index * 0.08 }}
      className="flex min-h-full flex-col overflow-hidden rounded-2xl border border-[#CBD5E1] bg-white"
    >
      {showEmbed && canEmbed ? (
        <div className="min-h-[520px] bg-[#F7F9FB] px-2 py-4">
          <InstagramEmbed url={post.url} title={post.title} />
        </div>
      ) : (
        <div className="relative aspect-[4/5] overflow-hidden bg-[#0A496C]">
          {post.previewImage ? (
            <Image
              src={post.previewImage}
              alt={post.previewAlt || post.title}
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col justify-between p-7 text-white">
              <PlatformIcon platform={post.platform} className="size-9 text-[#2CBEE7]" />
              <p className="mb-20 text-xs font-semibold uppercase tracking-[0.18em] text-[#8CDDF3]">IES Nuevo Horizonte</p>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-[#073A57]/92 p-5 text-white">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8CDDF3]">
                {platformLabels[post.platform]} · {typeLabels[post.type]}
              </p>
              {post.account && <p className="mt-1 text-sm text-white/80">{post.account}</p>}
            </div>
            {canEmbed && (
              <button
                type="button"
                onClick={() => setShowEmbed(true)}
                className="grid size-12 shrink-0 place-items-center rounded-full bg-[#2CBEE7] text-[#073A57] transition hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label={`Reproducir ${post.title}`}
              >
                <Play className="ml-0.5 size-5 fill-current" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">
          <span>{typeLabels[post.type]}</span>
          {date && <time dateTime={post.publishedAt ?? undefined}>{date}</time>}
        </div>
        <h3 className="mt-4 text-xl font-semibold leading-snug text-[#0A496C]">{post.title}</h3>
        {post.description && <p className="mt-3 text-sm leading-6 text-[#52606D]">{post.description}</p>}
        <div className="mt-auto pt-6">
          {canEmbed && !showEmbed ? (
            <button
              type="button"
              onClick={() => setShowEmbed(true)}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0A496C] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#073A57]"
            >
              <Play className="size-4" />
              {post.buttonLabel}
            </button>
          ) : (
            <a
              href={post.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#0A496C] px-4 py-2.5 text-sm font-semibold text-[#0A496C] transition hover:bg-[#E0ECF8]"
            >
              {post.buttonLabel}
              <ExternalLink className="size-4" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
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
    <blockquote
      className="instagram-media mx-auto"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{ background: "#fff", border: 0, margin: "0 auto", maxWidth: 540, minWidth: 280, width: "100%" }}
    >
      <a href={url} target="_blank" rel="noreferrer" className="sr-only">
        {title} en Instagram
      </a>
    </blockquote>
  );
}

function PlatformIcon({ platform, className }: { platform: CareerSocialPlatform; className?: string }) {
  if (platform === "instagram") return <Instagram className={className} />;
  if (platform === "youtube") return <Youtube className={className} />;
  if (platform === "facebook") return <Facebook className={className} />;
  return <Play className={className} />;
}

function formatDate(value?: string | null): string | null {
  if (!value) return null;

  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("es-AR", {
    month: "short",
    year: "numeric",
  }).format(date);
}
