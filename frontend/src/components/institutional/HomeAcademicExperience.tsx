import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, Instagram, Images } from "lucide-react";

export type HomeExperienceItem = {
  id: string;
  career: string;
  title: string;
  description?: string | null;
  image?: string | null;
  imageAlt?: string | null;
  href: string;
  external: boolean;
  kind: "social";
};

export function HomeAcademicExperience({ items }: { items: HomeExperienceItem[] }) {
  const visibleItems = items.slice(0, 2);

  return (
    <section aria-labelledby="academic-experience-title" className="border-b border-[#D8E1E8] bg-[#EAF1F5] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-5 border-b border-[#B7CADB] pb-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#0A6F94]">Carreras en acción</p>
            <h2 id="academic-experience-title" className="mt-3 text-balance text-3xl font-semibold tracking-[-0.035em] text-[#0A496C] md:text-5xl">Aprender también es hacer y participar</h2>
          </div>
          <p className="max-w-xl leading-7 text-[#52606D] lg:col-span-5 lg:justify-self-end">Prácticas, proyectos y actividades que conectan cada carrera con experiencias reales.</p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <article className="group relative min-h-[420px] overflow-hidden rounded-xl bg-[#0A496C] sm:col-span-2 lg:min-h-[500px]">
            <Image src="/instituto.jpg" alt="Espacios académicos del IES Nuevo Horizonte" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
            <div className="absolute inset-0 bg-[#073A57]/55" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#8CDDF3]">Nuestros espacios</p>
              <h3 className="mt-3 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.03em]">Un entorno preparado para aprender, practicar y producir</h3>
              <Link href="/institucion" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white underline decoration-[#2CBEE7] decoration-2 underline-offset-4">Conocé el instituto <ArrowRight className="size-4" aria-hidden="true" /></Link>
            </div>
          </article>

          {visibleItems.length > 0 ? visibleItems.map((item) => <ExperienceCard key={item.id} item={item} />) : <EmptyExperience />}
        </div>

        <div className="mt-7 flex justify-end">
          <Link href="/carreras" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0A496C]">Ver todas las experiencias por carrera <ArrowRight className="size-4" aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}

function ExperienceCard({ item }: { item: HomeExperienceItem }) {
  const className = "group flex min-h-[300px] flex-col overflow-hidden rounded-xl border border-[#C4D3DF] bg-white transition-shadow hover:shadow-[0_10px_24px_rgba(10,73,108,0.09)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2CBEE7]/30";
  const content = (
    <>
      <span className="relative block aspect-[4/3] overflow-hidden bg-[#E0ECF8] text-[#0A496C]">
        {item.image ? <Image src={item.image} alt={item.imageAlt || item.title} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" /> : <span className="grid h-full place-items-center"><Instagram className="size-10" aria-hidden="true" /></span>}
        <span className="absolute bottom-0 left-0 bg-[#0A496C] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-white">{item.career}</span>
      </span>
      <span className="flex flex-1 flex-col p-5">
        <span className="line-clamp-3 block text-lg font-semibold leading-snug text-[#0A496C]">{item.title}</span>
        {item.description ? <span className="mt-3 line-clamp-3 block text-sm leading-6 text-[#64748B]">{item.description}</span> : null}
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-semibold text-[#0A496C]">Ver publicación{item.external ? <ExternalLink className="size-3.5" aria-hidden="true" /> : <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />}</span>
      </span>
    </>
  );

  return item.external ? <a href={item.href} target="_blank" rel="noreferrer" className={className}>{content}</a> : <Link href={item.href} className={className}>{content}</Link>;
}

function EmptyExperience() {
  return (
    <div className="flex min-h-[300px] flex-col justify-center rounded-xl border border-[#C4D3DF] bg-white p-7 sm:col-span-2">
      <Images className="size-9 text-[#0A6F94]" aria-hidden="true" />
      <h3 className="mt-5 text-xl font-semibold text-[#0A496C]">Experiencias de cada carrera</h3>
      <p className="mt-3 leading-7 text-[#52606D]">Las actividades, prácticas y proyectos cargados desde el CMS aparecerán automáticamente en este espacio.</p>
      <Link href="/carreras" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0A496C]">Explorar carreras <ArrowRight className="size-4" aria-hidden="true" /></Link>
    </div>
  );
}
