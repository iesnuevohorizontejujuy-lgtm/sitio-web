'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone } from 'lucide-react';
import { Facebook, Instagram } from 'lucide-react';
import { usePathname } from 'next/navigation';

const PHONES = [
    { number: '5493886825633', label: '+54 9 388 682-5633' },
    { number: '5493884640637', label: '+54 9 388 464-0637' },
    { number: '5493884640570', label: '+54 9 388 464-0570' },
    { number: '5493884640651', label: '+54 9 388 464-0651' },
];

const NAV_LINKS = [
    { label: 'Inicio', href: '/' },
    { label: 'Carreras', href: '/#carreras' },
    { label: 'Institución', href: '/#institucion' },
    { label: 'Noticias', href: '/noticias' },
    { label: 'NHDocs', href: '/nhdocs' },
    { label: 'Campus Virtual', href: '/campus' },
];

export default function Footer() {
    const pathname = usePathname();
    if (pathname?.startsWith('/campus')) return null;

    return (
        <footer
            id="contacto"
            className="bg-primary text-primary-foreground"
        >
            {/* ── Franja superior de acento ── */}
            <div className="h-1 w-full bg-primary-foreground/20" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* ── Columna 1: Branding ── */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="inline-flex items-center gap-3 mb-5 group">
                            <div className="relative h-10 w-10 bg-primary-foreground/10 rounded-full p-1 shrink-0">
                                <Image
                                    src="/IsnhLogo.png"
                                    alt="IESNH Logo"
                                    fill
                                    className="object-contain rounded-full transition-transform duration-200 group-hover:scale-105"
                                />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-primary-foreground font-bold text-lg tracking-tight">IESNH</span>
                                <span className="text-primary-foreground/60 text-[10px] font-semibold uppercase tracking-widest">
                                    Nuevo Horizonte
                                </span>
                            </div>
                        </Link>
                        <p className="text-primary-foreground/70 text-sm leading-relaxed">
                            Tu futuro empieza aquí. Instituto de Educación Superior Nuevo Horizonte — líderes con excelencia académica y compromiso social en la provincia de Jujuy.
                        </p>
                    </div>

                    {/* ── Columna 2: Navegación ── */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-primary-foreground mb-5">
                            Navegación
                        </h4>
                        <ul className="space-y-2">
                            {NAV_LINKS.map(({ label, href }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-150"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Columna 3: Contacto ── */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-primary-foreground mb-5">
                            Contacto
                        </h4>
                        <ul className="space-y-4 text-sm text-primary-foreground/70">
                            <li className="flex items-start gap-3">
                                <MapPin size={16} className="text-primary-foreground/50 mt-0.5 shrink-0" />
                                <span className="leading-relaxed">
                                    Manuel Castellano 3323 Esq. Ildefonso M. de la Paz,
                                    B° 47 Hectáreas, Alto Comedero,
                                    4600 San Salvador de Jujuy, Argentina
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone size={16} className="text-primary-foreground/50 mt-0.5 shrink-0" />
                                <div className="space-y-1.5">
                                    <p className="text-primary-foreground font-semibold text-xs uppercase tracking-wide mb-2">
                                        WhatsApp corporativo
                                    </p>
                                    {PHONES.map((c) => (
                                        <a
                                            key={c.number}
                                            href={`https://wa.me/${c.number}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block hover:text-primary-foreground transition-colors duration-150"
                                        >
                                            {c.label}
                                        </a>
                                    ))}
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* ── Columna 4: Redes Sociales ── */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-primary-foreground mb-5">
                            Redes Sociales
                        </h4>
                        <div className="flex gap-3 mb-5">
                            <a
                                href="https://www.facebook.com/InstitutoDeEducacionSuperiorNuevoHorizonte"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Visitar Facebook"
                                className="
                                    p-3 rounded-full border border-primary-foreground/20
                                    text-primary-foreground/70
                                    hover:border-[#1877F2] hover:text-[#1877F2] hover:bg-[#1877F2]/15
                                    hover:scale-110
                                    transition-all duration-200
                                "
                            >
                                <Facebook size={20} />
                            </a>
                            <a
                                href="https://www.instagram.com/iesnuevohorizonte/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Visitar Instagram"
                                className="
                                    p-3 rounded-full border border-primary-foreground/20
                                    text-primary-foreground/70
                                    hover:border-[#E4405F] hover:text-[#E4405F] hover:bg-[#E4405F]/15
                                    hover:scale-110
                                    transition-all duration-200
                                "
                            >
                                <Instagram size={20} />
                            </a>
                        </div>
                        <p className="text-sm text-primary-foreground/70 leading-relaxed">
                            Seguinos para enterarte de las últimas novedades académicas y eventos institucionales.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Barra inferior de copyright ── */}
            <div className="border-t border-primary-foreground/15">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/50">
                    <p>
                        © {new Date().getFullYear()} Instituto de Educación Superior Nuevo Horizonte.
                        Todos los derechos reservados.
                    </p>
                    <p>
                        San Salvador de Jujuy, Argentina
                    </p>
                </div>
            </div>
        </footer>
    );
}