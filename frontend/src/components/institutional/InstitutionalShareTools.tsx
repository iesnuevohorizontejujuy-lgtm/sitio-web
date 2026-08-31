"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";

export function InstitutionalShareTools({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  async function sharePublication() {
    const shareData = { title, url: window.location.href };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        return;
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${title} ${window.location.href}`)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex flex-wrap gap-2 lg:grid" aria-label="Compartir publicación">
      <button type="button" onClick={sharePublication} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#B7CADB] bg-white px-3 text-sm font-semibold text-[#0A496C] transition-colors hover:border-[#2CBEE7] hover:bg-[#EAF2FB]">
        <Share2 className="size-4" aria-hidden="true" /> Compartir
      </button>
      <button type="button" onClick={copyLink} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#B7CADB] bg-white px-3 text-sm font-semibold text-[#0A496C] transition-colors hover:border-[#2CBEE7] hover:bg-[#EAF2FB]">
        {copied ? <Check className="size-4 text-[#18794E]" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
        {copied ? "Enlace copiado" : "Copiar enlace"}
      </button>
      <p className="sr-only" role="status" aria-live="polite">{copied ? "El enlace fue copiado al portapapeles." : ""}</p>
    </div>
  );
}
