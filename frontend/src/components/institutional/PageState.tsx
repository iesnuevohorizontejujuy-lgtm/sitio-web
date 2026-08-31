import type { ReactNode } from "react";

type PageStateProps = {
  eyebrow: string;
  code: string;
  title: string;
  description: string;
  actions: ReactNode;
  note?: string;
};

export function PageState({
  eyebrow,
  code,
  title,
  description,
  actions,
  note,
}: PageStateProps) {
  return (
    <main className="institutional-shell text-[#121C28]">
      <section className="border-b border-[#D8E1E8]">
        <div className="mx-auto grid min-h-[62vh] max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-[0.8fr_1.2fr] md:py-24 lg:gap-20 lg:px-8">
          <div aria-hidden="true" className="border-l-4 border-[#2CBEE7] pl-6 md:pl-9">
            <p className="text-[clamp(5.5rem,16vw,12rem)] font-bold leading-[0.8] tracking-[-0.08em] text-[#E0ECF8]">
              {code}
            </p>
          </div>

          <div className="max-w-2xl">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#0A496C]">
              <span className="h-0.5 w-8 bg-[#2CBEE7]" aria-hidden="true" />
              {eyebrow}
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#0A496C] sm:text-5xl">
              {title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#52606D] md:text-lg">
              {description}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">{actions}</div>

            {note ? (
              <p className="mt-8 border-t border-[#D8E1E8] pt-5 text-sm leading-6 text-[#64748B]">
                {note}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
