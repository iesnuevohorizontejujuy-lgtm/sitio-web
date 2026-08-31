"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  ClipboardCheck,
  ExternalLink,
  Facebook,
  Files,
  FileText,
  GraduationCap,
  House,
  Instagram,
  MapPin,
  Menu,
  Newspaper,
  Phone,
  UserPlus,
  X,
  type LucideIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { institution } from "@/config/institution";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  { label: "Inicio", description: "Portada institucional", href: "/", icon: House },
  { label: "Institución", description: "Historia, propuesta y ubicación", href: "/institucion", icon: Building2 },
  { label: "Carreras", description: "Conocé nuestra oferta académica", href: "/carreras", icon: GraduationCap },
  { label: "Ingresantes", description: "Requisitos y proceso de inscripción", href: "/ingresantes", icon: UserPlus },
  { label: "Permisos de examen", description: "Solicitud de permisos en línea", href: "/permisos-examen", icon: ClipboardCheck },
  { label: "Vida institucional", description: "Noticias, actividades y agenda", href: "/vida-institucional", icon: Newspaper },
  { label: "NHDocs", description: "Documentación institucional", href: "/nhdocs", icon: Files },
  { label: "Contacto", description: "Canales de atención del instituto", href: "/#contacto", icon: MapPin },
] as const;

const featuredAccess = [
  { eyebrow: "Elegí tu futuro", title: "Explorá las carreras", href: "/carreras", image: "/institutional/software-students.png" },
  { eyebrow: "Comunidad IESNH", title: "Noticias y actividades", href: "/vida-institucional", image: "/institutional/students-collaboration.png" },
] as const;

const menuListVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.08, staggerChildren: 0.045 },
  },
};

const menuItemVariants = {
  hidden: { opacity: 0, x: -18 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.28, ease: "easeOut" as const },
  },
};

function MenuSectionIcon({ icon: Icon, active }: { icon: LucideIcon; active: boolean }) {
  return (
    <span className={`relative flex size-14 shrink-0 items-center justify-center rounded-[18px] border transition-colors ${active ? "border-[#B8D8E8] bg-[#E8F5FA] text-[#0A496C]" : "border-white/20 bg-[#062F48] text-[#8CDDF3] group-hover:border-[#2CBEE7]/60 group-hover:bg-[#0A496C]"}`} aria-hidden="true">
      <Icon className="size-6" strokeWidth={1.7} />
      <span className={`absolute bottom-2 left-2 h-px w-4 ${active ? "bg-[#0A496C]/30" : "bg-white/25"}`} />
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.includes("#")) return false;
    return pathname?.startsWith(href.split("#")[0]);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="bg-[#073A57] text-white">
        <div className="mx-auto flex min-h-10 max-w-[1600px] items-center justify-between gap-4 px-5 py-1.5 text-xs lg:px-8">
          <div className="flex min-w-0 items-center gap-5">
            <a href={`https://wa.me/${institution.primaryPhone.whatsapp}`} className="inline-flex min-h-9 items-center gap-2 hover:text-[#8CDDF3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2CBEE7]">
              <Phone className="size-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{institution.primaryPhone.label}</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
            <span className="hidden items-center gap-2 text-white/70 md:inline-flex"><MapPin className="size-3.5" aria-hidden="true" />{institution.city}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/nhdocs" className="hidden min-h-9 items-center gap-2 font-medium text-white/80 hover:text-[#8CDDF3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2CBEE7] sm:inline-flex"><FileText className="size-3.5" aria-hidden="true" />NHDocs</Link>
            <span className="hidden h-4 w-px bg-white/20 sm:block" aria-hidden="true" />
            <a href={institution.academicSystemUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-9 items-center gap-2 font-semibold text-white hover:text-[#8CDDF3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2CBEE7]">Acceso académico <ExternalLink className="size-3" aria-hidden="true" /></a>

          </div>
        </div>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <header className="sticky top-0 z-40 border-b border-[#D8E1E8] bg-white shadow-[0_4px_18px_rgba(10,73,108,0.08)]">
          <div className="mx-auto grid h-[92px] max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 lg:h-[104px] lg:px-8">
            <div className="justify-self-start">
              <SheetTrigger asChild>
                <button type="button" className="inline-flex min-h-11 items-center gap-3 text-sm font-semibold uppercase tracking-[0.08em] text-[#0A496C] hover:text-[#0A6F94] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2CBEE7]/30" aria-label="Abrir menú de navegación">
                  <span className="inline-flex size-11 items-center justify-center rounded-full bg-[#0A496C] text-white"><Menu className="size-5" aria-hidden="true" /></span>
                  <span className="hidden sm:inline">Menú</span>
                </button>
              </SheetTrigger>
            </div>

            <Link href="/" onClick={closeMenu} className="flex items-center gap-3 justify-self-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2CBEE7]/30">
              <Image src="/IsnhLogo.png" alt="Logo IES Nuevo Horizonte" width={66} height={66} priority className="size-14 shrink-0 object-contain lg:size-[66px]" />
              <span className="hidden md:block">
                <span className="block whitespace-nowrap text-xl font-bold tracking-[-0.025em] text-[#0A496C] lg:text-2xl">IES Nuevo Horizonte</span>
                <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.19em] text-[#52606D]">Educación superior · Jujuy</span>
              </span>
            </Link>

            <div className="flex items-center justify-self-end lg:gap-1">
              <a href={institution.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="hidden size-11 items-center justify-center rounded-full text-[#0A496C] hover:bg-[#EAF2FB] sm:inline-flex"><Facebook className="size-5" aria-hidden="true" /></a>
              <a href={institution.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="inline-flex size-11 items-center justify-center rounded-full text-[#0A496C] hover:bg-[#EAF2FB]"><Instagram className="size-5" aria-hidden="true" /></a>
              <Link href="/ingresantes" className="ml-2 hidden min-h-11 items-center rounded-lg bg-[#0A496C] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#073A57] lg:inline-flex">Inscribite</Link>
            </div>
          </div>
        </header>

        <SheetContent side="left" showCloseButton={false} className="institutional-menu-shape w-full gap-0 overflow-hidden border-0 bg-[#073A57] p-0 text-white shadow-none sm:max-w-[768px]">
          <div className="institutional-menu-scroll relative z-10 h-full overflow-y-auto bg-transparent sm:mr-12">
          <div className="pointer-events-none absolute -left-[330px] top-20 z-0 hidden size-[620px] rounded-full border border-[#2CBEE7]/10 sm:block" aria-hidden="true" />
          <div className="pointer-events-none absolute -left-[260px] top-[150px] z-0 hidden size-[480px] rounded-full border border-[#2CBEE7]/10 sm:block" aria-hidden="true" />
          <div className="pointer-events-none absolute -left-[190px] top-[220px] z-0 hidden size-[340px] rounded-full border border-[#2CBEE7]/10 sm:block" aria-hidden="true" />
          <SheetHeader className="sticky top-0 z-20 border-b border-white/15 bg-[#073A57] px-5 py-5 sm:px-8 lg:px-10">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex items-center justify-between gap-5"
            >
              <div className="flex items-center gap-3">
                <Image src="/IsnhLogo.png" alt="" width={54} height={54} className="size-12 rounded-full bg-white object-contain p-1" />
                <div>
                  <SheetTitle className="text-lg text-white">IES Nuevo Horizonte</SheetTitle>
                  <SheetDescription className="mt-0.5 text-xs uppercase tracking-[0.15em] text-[#8CDDF3]">Navegación institucional</SheetDescription>
                </div>
              </div>
              <SheetClose asChild>
                <button type="button" className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white hover:text-[#073A57] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2CBEE7]/35" aria-label="Cerrar menú">
                  <X className="size-5" aria-hidden="true" />
                </button>
              </SheetClose>
            </motion.div>

          </SheetHeader>

          <div className="relative z-10 px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8CDDF3]">Explorá el sitio</p>

            <nav aria-label="Secciones del sitio">
                <motion.ul
                  variants={menuListVariants}
                  initial={reduceMotion ? false : "hidden"}
                  animate="visible"
                  className="grid gap-2 sm:grid-cols-2"
                >
                  {navigation.map((item) => {
                    const active = isActive(item.href);

                    return (
                    <motion.li key={item.href} variants={menuItemVariants}>
                      <Link href={item.href} onClick={closeMenu} aria-current={active ? "page" : undefined} className={`group flex min-h-[88px] items-center gap-4 rounded-xl border p-3 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2CBEE7]/40 ${active ? "border-[#2CBEE7] bg-white text-[#073A57]" : "border-white/15 bg-white/[0.055] hover:border-white/35 hover:bg-white/10"}`}>
                        <MenuSectionIcon icon={item.icon} active={active} />
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold leading-tight">{item.label}</span>
                          <span className={`mt-1 block text-xs leading-5 ${active ? "text-[#52606D]" : "text-white/65"}`}>{item.description}</span>
                        </span>
                        <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </Link>
                    </motion.li>
                    );
                  })}
                </motion.ul>
              </nav>

            <motion.section
              aria-labelledby="featured-access-title"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0 : 0.34, duration: 0.35, ease: "easeOut" }}
              className="mt-9 border-t border-white/15 pt-7"
            >
                <h2 id="featured-access-title" className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8CDDF3]">Accesos destacados</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {featuredAccess.map((item) => (
                    <Link key={item.href} href={item.href} onClick={closeMenu} className="group relative isolate min-h-44 overflow-hidden rounded-xl border border-white/15 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2CBEE7]/40">
                      <Image src={item.image} alt="" fill sizes="(max-width: 640px) 100vw, 320px" className="-z-20 object-cover transition-transform duration-500 group-hover:scale-105" />
                      <span className="absolute inset-0 -z-10 bg-[#031F30]/70" aria-hidden="true" />
                      <span className="flex h-full min-h-44 flex-col justify-end p-5">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8CDDF3]">{item.eyebrow}</span>
                        <span className="mt-2 flex items-end justify-between gap-4 text-lg font-semibold leading-tight text-white"><span>{item.title}</span><ArrowRight className="size-5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
                      </span>
                    </Link>
                  ))}
                </div>
            </motion.section>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/15 pt-6 text-sm">
              <a href={institution.academicSystemUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 font-semibold text-white hover:text-[#8CDDF3]">Acceso académico <ExternalLink className="size-4" aria-hidden="true" /></a>
              <Link href="/ingresantes" onClick={closeMenu} className="inline-flex min-h-11 items-center gap-2 font-semibold text-[#8CDDF3] hover:text-white">Inscribite <ArrowRight className="size-4" aria-hidden="true" /></Link>
            </div>
          </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
