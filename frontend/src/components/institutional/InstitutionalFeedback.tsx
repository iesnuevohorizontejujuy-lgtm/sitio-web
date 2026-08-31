import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Clock3, Info, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type FeedbackProps = {
  eyebrow?: string;
  title: string;
  description: ReactNode;
  children?: ReactNode;
  className?: string;
};

type FeedbackTone = "success" | "error" | "notice" | "pending" | "loading";

const feedbackStyles: Record<FeedbackTone, { panel: string; icon: string; eyebrow: string }> = {
  success: { panel: "border-[#9DD7C0] bg-[#F0FBF6]", icon: "bg-[#DDF2E3] text-[#176B3A]", eyebrow: "text-[#176B3A]" },
  error: { panel: "border-[#F2C7C7] bg-[#FFF7F7]", icon: "bg-[#FBE5E5] text-[#8B2C2C]", eyebrow: "text-[#8B2C2C]" },
  notice: { panel: "border-[#C6D7E5] bg-white", icon: "bg-[#E0ECF8] text-[#0A496C]", eyebrow: "text-[#0A6F94]" },
  pending: { panel: "border-[#B8D8E8] bg-[#F3FAFC]", icon: "bg-[#E0ECF8] text-[#0A496C]", eyebrow: "text-[#0A496C]" },
  loading: { panel: "border-[#D8E1E8] bg-white", icon: "bg-[#E0ECF8] text-[#0A496C]", eyebrow: "text-[#0A6F94]" },
};

const feedbackIcons = {
  success: CheckCircle2,
  error: AlertTriangle,
  notice: Info,
  pending: Clock3,
  loading: LoaderCircle,
} satisfies Record<FeedbackTone, typeof Info>;

function Feedback({ tone, eyebrow, title, description, children, className }: FeedbackProps & { tone: FeedbackTone }) {
  const Icon = feedbackIcons[tone];
  const styles = feedbackStyles[tone];

  return (
    <div
      className={cn("rounded-2xl border p-7 md:p-9", styles.panel, className)}
      role={tone === "error" ? "alert" : tone === "notice" ? undefined : "status"}
      aria-live={tone === "error" ? "assertive" : tone === "notice" ? undefined : "polite"}
    >
      <div className={cn("grid size-12 place-items-center rounded-full", styles.icon)}>
        <Icon className={cn("size-6", tone === "loading" && "animate-spin")} aria-hidden="true" />
      </div>
      {eyebrow ? <p className={cn("mt-6 text-xs font-semibold uppercase tracking-[0.16em]", styles.eyebrow)}>{eyebrow}</p> : null}
      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-[#123A50] md:text-3xl">{title}</h2>
      <div className="mt-3 max-w-2xl text-sm leading-7 text-[#52606D] md:text-base">{description}</div>
      {children ? <div className="mt-7">{children}</div> : null}
    </div>
  );
}

export function InstitutionalFeedbackSuccess(props: FeedbackProps) {
  return <Feedback tone="success" {...props} />;
}

export function InstitutionalFeedbackError(props: FeedbackProps) {
  return <Feedback tone="error" {...props} />;
}

export function InstitutionalFeedbackNotice(props: FeedbackProps) {
  return <Feedback tone="notice" {...props} />;
}

export function InstitutionalFeedbackPending(props: FeedbackProps) {
  return <Feedback tone="pending" {...props} />;
}

export function InstitutionalFeedbackLoading(props: FeedbackProps) {
  return <Feedback tone="loading" {...props} />;
}
