import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Facebook, Instagram, MapPin, Phone } from "lucide-react";
import { institution } from "@/config/institution";

const usefulLinks = [
  { label: "Carreras", href: "/carreras" },
  { label: "Ingresantes", href: "/ingresantes" },
  { label: "Permisos de examen", href: "/permisos-examen" },
  { label: "Vida institucional", href: "/vida-institucional" },
  { label: "NHDocs", href: "/nhdocs" },
  { label: "Acceso académico", href: institution.academicSystemUrl, external: true },
] as const;

export default function Footer() {
  return (
    <footer id="contacto" className="bg-[#073A57] text-white">
      <section aria-labelledby="useful-links-title" className="border-b border-white/15 bg-[#0A496C]">
        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div><p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#8CDDF3]">Portal institucional</p><h2 id="useful-links-title" className="mt-2 text-2xl font-semibold">Enlaces útiles</h2></div>
            <p className="text-sm text-white/65">Accesos frecuentes para nuestra comunidad educativa.</p>
          </div>
          <div className="mt-6 grid gap-px overflow-hidden rounded-lg bg-white/20 sm:grid-cols-2 lg:grid-cols-3">
            {usefulLinks.map((item) => {
              const className = "group flex min-h-16 items-center justify-between gap-4 bg-[#073A57] px-5 py-4 text-sm font-semibold transition-colors hover:bg-[#0B577E] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#2CBEE7]/45";
              const content = <>{item.label}<ArrowUpRight className="size-4 text-[#8CDDF3] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></>;
              return "external" in item && item.external ? <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className={className}>{content}</a> : <Link key={item.label} href={item.href} className={className}>{content}</Link>;
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1.05fr]">
          <div>
            <div className="flex items-center gap-4">
              <span className="grid size-16 place-items-center rounded-full bg-white"><Image src="/IsnhLogo.png" alt="" width={58} height={58} className="size-14 object-contain" /></span>
              <div><h2 className="text-xl font-semibold">IES Nuevo Horizonte</h2><p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#8CDDF3]">Educación superior · Jujuy</p></div>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-6 text-white/70">Educación superior comprometida con la formación técnica, el acompañamiento cercano y el desarrollo de Jujuy.</p>
            <div className="mt-6 flex gap-3">
              <a href={institution.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 hover:border-[#2CBEE7] hover:text-[#2CBEE7]"><Facebook className="size-5" aria-hidden="true" /></a>
              <a href={institution.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 hover:border-[#2CBEE7] hover:text-[#2CBEE7]"><Instagram className="size-5" aria-hidden="true" /></a>
            </div>
          </div>
          <FooterColumn title="Institución" links={[{ label: "Quiénes somos", href: "/institucion" }, { label: "Ubicación y cómo llegar", href: "/institucion#ubicacion" }, { label: "Vida institucional", href: "/vida-institucional" }, { label: "NHDocs", href: "/nhdocs" }]} />
          <FooterColumn title="Académico" links={[{ label: "Carreras", href: "/carreras" }, { label: "Ingresantes", href: "/ingresantes" }, { label: "Permisos de examen", href: "/permisos-examen" }, { label: "Orientación", href: "/ingresantes#orientacion" }]} />
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8CDDF3]">Contacto</h3>
            <ul className="mt-5 space-y-5 text-sm leading-6 text-white/70">
              <li className="flex gap-3"><MapPin className="mt-1 size-4 shrink-0 text-[#2CBEE7]" aria-hidden="true" /><span>{institution.address}, {institution.postalCode} {institution.city}</span></li>
              <li className="flex gap-3"><Phone className="mt-1 size-4 shrink-0 text-[#2CBEE7]" aria-hidden="true" /><div>{institution.phones.map((phone) => <a key={phone.whatsapp} href={`https://wa.me/${phone.whatsapp}`} className="block hover:text-white">{phone.label}</a>)}</div></li>
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

function FooterColumn({ title, links }: { title: string; links: ReadonlyArray<{ label: string; href: string }> }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8CDDF3]">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm text-white/70">
        {links.map((link) => <li key={link.href}><Link href={link.href} className="hover:text-white">{link.label}</Link></li>)}
      </ul>
    </div>
  );
}
