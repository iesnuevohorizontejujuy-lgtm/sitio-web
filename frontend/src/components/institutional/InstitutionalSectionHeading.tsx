import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type InstitutionalSectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  inverse?: boolean;
  className?: string;
};

export function InstitutionalSectionHeading({
  eyebrow,
  title,
  description,
  action,
  inverse = false,
  className,
}: InstitutionalSectionHeadingProps) {
  return (
    <div className={cn("flex flex-col justify-between gap-6 md:flex-row md:items-end", className)}>
      <div className="max-w-3xl">
        <p className={cn("flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em]", inverse ? "text-[#8CDDF3]" : "text-[#0A6F94]")}>
          <span className="h-0.5 w-8 bg-[#2CBEE7]" aria-hidden="true" />
          {eyebrow}
        </p>
        <h2 className={cn("mt-4 text-3xl font-semibold tracking-[-0.025em] md:text-4xl", inverse ? "text-white" : "text-[#0A496C]")}>{title}</h2>
        {description ? <p className={cn("mt-5 text-lg leading-8", inverse ? "text-white/75" : "text-[#52606D]")}>{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
