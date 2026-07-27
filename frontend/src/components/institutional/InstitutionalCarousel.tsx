import Image from "next/image";

export function InstitutionalCarousel() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#B7CADB] bg-white">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#E0ECF8] md:aspect-[16/8]">
        <Image
          src="/instituto.jpg"
          alt="Instalaciones del IES Nuevo Horizonte"
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1200px"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-[#073A57]/90 p-5 text-white md:max-w-xl md:p-7">
          <p className="text-xl font-semibold md:text-2xl">Una institución que acompaña</p>
          <p className="mt-2 text-sm leading-6 text-white/75 md:text-base">
            Formación superior, cercanía y compromiso con cada recorrido académico.
          </p>
        </div>
      </div>
    </div>
  );
}
