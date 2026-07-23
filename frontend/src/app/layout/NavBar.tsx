"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { institution } from "@/config/institution";

const navigation = [
  { label: "Inicio", href: "/" },
  { label: "Institución", href: "/institucion" },
  { label: "Carreras", href: "/carreras" },
  { label: "Ingresantes", href: "/ingresantes" },
  { label: "Permisos de examen", href: "/permisos-examen" },
  { label: "Vida institucional", href: "/vida-institucional" },
  { label: "Contacto", href: "/#contacto" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname?.startsWith("/campus")) return null;

  return (
    <>
      <div className="bg-[#073A57] text-white">
        <div className="mx-auto flex min-h-9 max-w-7xl items-center justify-between gap-4 px-5 py-2 text-xs lg:px-8">
          <a href={`https://wa.me/${institution.primaryPhone.whatsapp}`} className="hover:text-[#2CBEE7]">
            {institution.primaryPhone.label} · San Salvador de Jujuy
          </a>
          <div className="flex items-center gap-3">
            <a href={institution.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
              <Facebook className="size-4" />
            </a>
            <a href={institution.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram className="size-4" />
            </a>
          </div>
        </div>
      </div>
      <header className="sticky top-0 z-50 border-b border-[#D8E1E8] bg-white/95 backdrop-blur">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 lg:px-8" aria-label="Navegación principal">
          <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
            <Image src="/IsnhLogo.png" alt="Logo IES Nuevo Horizonte" width={46} height={46} className="size-11 object-contain" />
            <span className="hidden text-base font-semibold tracking-[-0.01em] text-[#0A496C] sm:block">
              IES Nuevo Horizonte
            </span>
          </Link>

          <div className="hidden items-center gap-5 xl:flex">
            {navigation.map((item) => {
              const active =
                (item.href === "/carreras" && pathname?.startsWith("/carreras")) ||
                (item.href === "/institucion" && pathname?.startsWith("/institucion")) ||
                (item.href === "/ingresantes" && pathname?.startsWith("/ingresantes")) ||
                (item.href === "/permisos-examen" && pathname?.startsWith("/permisos-examen")) ||
                (item.href === "/vida-institucional" && pathname?.startsWith("/vida-institucional"));
              return (
                <Link key={item.href} href={item.href} className={`border-b-2 py-2 text-sm font-medium transition-colors ${active ? "border-[#0A496C] text-[#0A496C]" : "border-transparent text-[#52606D] hover:text-[#0A496C]"}`}>
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden items-center gap-3 xl:flex">
            <Link href="/campus" className="rounded-lg border border-[#0A496C] px-4 py-2.5 text-sm font-semibold text-[#0A496C] transition hover:bg-[#E0ECF8]">
              Acceso académico
            </Link>
            <Link href="/ingresantes" className="rounded-lg bg-[#0A496C] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#073A57]">
              Inscribite
            </Link>
          </div>

          <button type="button" onClick={() => setIsOpen((open) => !open)} className="rounded-lg border border-[#CBD5E1] p-2 text-[#0A496C] xl:hidden" aria-expanded={isOpen} aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}>
            {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </nav>

        {isOpen && (
          <div className="border-t border-[#D8E1E8] bg-white px-5 py-5 xl:hidden">
            <div className="mx-auto flex max-w-7xl flex-col">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className="border-b border-[#E2E8F0] py-3 text-sm font-medium text-[#0A496C]">
                  {item.label}
                </Link>
              ))}
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Link href="/campus" onClick={() => setIsOpen(false)} className="rounded-lg border border-[#0A496C] px-4 py-3 text-center text-sm font-semibold text-[#0A496C]">Acceso académico</Link>
                <Link href="/ingresantes" onClick={() => setIsOpen(false)} className="rounded-lg bg-[#0A496C] px-4 py-3 text-center text-sm font-semibold text-white">Inscribite</Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
