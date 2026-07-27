import Image from "next/image";

export function HeroMediaCarousel() {
  return (
    <div className="relative">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#CBD5E1] bg-[#E0ECF8]">
        <Image
          src="/instituto.jpg"
          alt="Instalaciones del IES Nuevo Horizonte"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-cover"
        />
      </div>

      <div className="absolute bottom-5 left-5 max-w-[280px] border-l-4 border-[#2CBEE7] bg-white p-5 shadow-[0_4px_20px_rgba(10,73,108,0.12)] sm:bottom-7 sm:left-7">
        <p className="font-semibold text-[#0A496C]">Espacios para aprender</p>
        <p className="mt-1 text-sm leading-5 text-[#52606D]">
          Formación superior en un entorno pensado para acompañar tu recorrido académico.
        </p>
      </div>
    </div>
  );
}
