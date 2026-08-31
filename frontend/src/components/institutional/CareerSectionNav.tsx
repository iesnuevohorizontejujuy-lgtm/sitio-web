export function CareerSectionNav({ shortTitle, hasExperiences }: { shortTitle: string; hasExperiences: boolean }) {
  return (
    <div className="sticky top-[76px] z-40 border-y border-[#D8E1E8] bg-white/96 shadow-[0_6px_18px_rgba(10,73,108,0.06)] backdrop-blur lg:top-[124px]">
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-5 py-2 [scrollbar-width:none] lg:px-8 [&::-webkit-scrollbar]:hidden">
        <nav aria-label="Secciones de la carrera" className="flex min-w-max items-center gap-1">
          <SectionLink href="#presentacion">La carrera</SectionLink>
          {hasExperiences ? <SectionLink href="#experiencias">Experiencias</SectionLink> : null}
          <SectionLink href="#perfil-profesional">Perfil</SectionLink>
          <SectionLink href="#plan-estudios">Plan de estudios</SectionLink>
          <SectionLink href="#documentacion">Documentación</SectionLink>
        </nav>
        <a href="#inscripcion" className="ml-auto hidden min-h-10 shrink-0 items-center rounded-lg bg-[#0A496C] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#073A57] md:inline-flex">
          Inscribirme en {shortTitle}
        </a>
      </div>
    </div>
  );
}

function SectionLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="inline-flex min-h-10 items-center rounded-lg px-3 py-2 text-sm font-semibold text-[#52606D] transition-colors hover:bg-[#EAF2FB] hover:text-[#0A496C]">
      {children}
    </a>
  );
}
