import type { ReactNode } from "react";
import Image from "next/image";

type MastheadCaption = {
  eyebrow: string;
  title: string;
};

type InstitutionalPageMastheadProps = {
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  caption?: MastheadCaption;
  priority?: boolean;
  children?: ReactNode;
};

export function InstitutionalPageMasthead({
  eyebrow,
  title,
  description,
  image,
  imageAlt = "",
  caption,
  priority = false,
  children,
}: InstitutionalPageMastheadProps) {
  return (
    <section className="border-b border-[#C6D7E5] bg-[#F4F7F9]">
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-12 lg:px-8 lg:pb-16 lg:pt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0A6F94]">{eyebrow}</p>
        <div className="mt-4 grid gap-7 lg:grid-cols-12 lg:items-end">
          <h1 className="text-balance text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-[#0A496C] sm:text-6xl lg:col-span-7 lg:text-7xl">{title}</h1>
          <div className="lg:col-span-5 lg:justify-self-end">
            <p className="max-w-xl text-pretty text-lg leading-8 text-[#52606D]">{description}</p>
            {children ? <div className="mt-6">{children}</div> : null}
          </div>
        </div>

        {image ? (
          <div className="relative mt-10 min-h-[320px] overflow-hidden rounded-xl bg-[#E0ECF8] sm:min-h-[430px] lg:min-h-[500px]">
            <Image src={image} alt={imageAlt} fill priority={priority} sizes="(max-width: 1280px) 100vw, 1280px" className="object-cover" />
            {caption ? (
              <div className="absolute inset-x-0 bottom-0 bg-[#073A57]/82 p-6 text-white sm:inset-x-auto sm:bottom-7 sm:left-7 sm:max-w-md sm:rounded-lg sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8CDDF3]">{caption.eyebrow}</p>
                <p className="mt-2 text-xl font-semibold leading-snug">{caption.title}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
