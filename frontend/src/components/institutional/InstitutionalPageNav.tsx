import { ArrowDown } from "lucide-react";

type InstitutionalPageNavItem = {
  href: `#${string}`;
  label: string;
};

type InstitutionalPageNavProps = {
  items: readonly InstitutionalPageNavItem[];
  label?: string;
};

export function InstitutionalPageNav({ items, label = "En esta página" }: InstitutionalPageNavProps) {
  return (
    <nav aria-label={label} className="border-b border-[#C6D7E5] bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:px-8">
        <p className="flex shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">
          <ArrowDown className="size-4 text-[#2A718F]" aria-hidden="true" />
          {label}
        </p>
        <div className="flex gap-x-7 gap-y-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:ml-auto lg:flex-wrap lg:justify-end lg:overflow-visible lg:pb-0">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative shrink-0 py-1 text-sm font-semibold text-[#0A496C]"
            >
              {item.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-[#2CBEE7] transition-transform group-hover:scale-x-100 group-focus-visible:scale-x-100" />
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
