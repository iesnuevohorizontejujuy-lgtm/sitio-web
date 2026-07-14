"use client";

import Link from "next/link";
import { Facebook, Instagram, MapPin, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { institution } from "@/config/institution";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/campus")) return null;

  return (
    <footer id="contacto" className="bg-[#073A57] text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-xl font-semibold">IES Nuevo Horizonte</h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/70">
              Educación superior comprometida con la formación técnica, el acompañamiento cercano y el desarrollo de Jujuy.
            </p>
            <div className="mt-6 flex gap-3">
              <a href={institution.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="rounded-lg border border-white/20 p-2.5 hover:border-[#2CBEE7] hover:text-[#2CBEE7]"><Facebook className="size-5" /></a>
              <a href={institution.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-lg border border-white/20 p-2.5 hover:border-[#2CBEE7] hover:text-[#2CBEE7]"><Instagram className="size-5" /></a>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2CBEE7]">Institución</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li><Link href="/#institucion" className="hover:text-white">Quiénes somos</Link></li>
              <li><Link href="/noticias" className="hover:text-white">Vida institucional</Link></li>
              <li><Link href="/nhdocs" className="hover:text-white">NHDocs</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2CBEE7]">Académico</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li><Link href="/carreras" className="hover:text-white">Carreras</Link></li>
              <li><Link href="/campus" className="hover:text-white">Campus Virtual</Link></li>
              <li><a href={`https://wa.me/${institution.primaryPhone.whatsapp}`} className="hover:text-white">Inscripciones</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2CBEE7]">Contacto</h3>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-white/70">
              <li className="flex gap-3"><MapPin className="mt-1 size-4 shrink-0 text-[#2CBEE7]" /><span>{institution.address}, {institution.postalCode} {institution.city}</span></li>
              <li className="flex gap-3"><Phone className="mt-1 size-4 shrink-0 text-[#2CBEE7]" /><div>{institution.phones.map((phone) => <a key={phone.whatsapp} href={`https://wa.me/${phone.whatsapp}`} className="block hover:text-white">{phone.label}</a>)}</div></li>
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Instituto de Educación Superior Nuevo Horizonte.</p>
          <p>San Salvador de Jujuy, Argentina</p>
        </div>
      </div>
    </footer>
  );
}
