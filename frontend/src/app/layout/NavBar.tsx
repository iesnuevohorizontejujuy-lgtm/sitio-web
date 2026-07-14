'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ModeToggle } from '@/components/mode-toggle';

const NAV_LINKS = [
    { label: 'Inicio', href: '/' },
    { label: 'Carreras', href: '/#carreras' },
    { label: 'Institución', href: '/#institucion' },
    { label: 'Contacto', href: '/#contacto' },
    { label: 'Noticias', href: '/noticias' },
    { label: 'NHDocs', href: '/nhdocs' },
];

const SHOW_PERMISO_EXAMEN = false;

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeHash, setActiveHash] = useState('');
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Revisamos si la URL tiene un # al cargar la página
        setActiveHash(window.location.hash);
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Cuando cambiamos de página, cerramos el menú y leemos la URL
    useEffect(() => {
        setIsOpen(false);
        setActiveHash(window.location.hash);
    }, [pathname]);

    if (pathname?.startsWith('/campus')) return null;

    // CORRECCIÓN CLAVE: Solo es transparente en la URL exacta '/' o '/noticias'. 
    // Si entras a un slug (/noticias/algo), se vuelve SÓLIDA para que no se rompa el diseño.
    const canBeTransparent = pathname === '/' || pathname === '/noticias';
    
    const isTransparent = canBeTransparent && !scrolled && !isOpen;

    return (
        <nav
            style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
            className={`
                fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b
                ${!isTransparent
                    ? 'bg-background/95 backdrop-blur-md border-border shadow-sm py-0' 
                    : 'bg-transparent border-transparent shadow-none py-2' 
                }
            `}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 gap-4">

                    {/* ── LOGO ── */}
                    <Link
                        href="/"
                        onClick={() => setActiveHash('')}
                        className="flex items-center gap-2.5 shrink-0 group focus-visible:outline-none"
                    >
                        <div className="relative h-10 w-10 md:h-12 md:w-12 shrink-0">
                            <Image
                                src="/IsnhLogo.png"
                                alt="IESNH Logo"
                                fill
                                sizes="48px"
                                className="object-contain transition-transform duration-200 group-hover:scale-105"
                            />
                        </div>
                        <div className="flex flex-col leading-none justify-center mt-0.5">
                            <span className={`text-lg md:text-xl tracking-tight transition-all duration-300 ${
                                isTransparent 
                                    ? 'text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]' 
                                    : 'text-primary dark:text-blue-400 font-extrabold'
                            }`}>
                                IESNH
                            </span>
                            <span className={`hidden md:block text-[10px] uppercase tracking-[0.15em] mt-0.5 transition-all duration-300 ${
                                isTransparent 
                                    ? 'text-white/90 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]' 
                                    : 'text-muted-foreground font-bold'
                            }`}>
                                Nuevo Horizonte
                            </span>
                        </div>
                    </Link>

                    {/* ── NAV LINKS (Escritorio) ── */}
                    <div className="hidden lg:flex flex-1 justify-center items-center gap-2 xl:gap-4">
                        {NAV_LINKS.map(({ label, href }) => (
                            <NavLink 
                                key={label} 
                                href={href} 
                                pathname={pathname} 
                                activeHash={activeHash} 
                                isTransparent={isTransparent}
                                onClick={() => href.includes('#') ? setActiveHash('#' + href.split('#')[1]) : setActiveHash('')}
                            >
                                {label}
                            </NavLink>
                        ))}
                    </div>

                    {/* ── ACCIONES (Escritorio) ── */}
                    <div className="hidden lg:flex items-center gap-4 shrink-0">
                        <ModeToggle />
                        {SHOW_PERMISO_EXAMEN && (
                            <Link
                                href="/PermisoExamen"
                                className="
                                    inline-flex items-center gap-2
                                    bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground
                                    border border-white dark:border-transparent
                                    px-5 py-2 rounded-full
                                    text-[10px] xl:text-xs font-bold uppercase tracking-widest
                                    shadow-sm hover:shadow-md hover:bg-opacity-90
                                    transition-all duration-200
                                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
                                    active:scale-95 whitespace-nowrap
                                "
                            >
                                Permiso Examen
                            </Link>
                        )}
                        <Link
                            href="/campus"
                            className="
                                inline-flex items-center gap-2
                                bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground
                                border border-white dark:border-transparent
                                px-5 py-2 rounded-full
                                text-[10px] xl:text-xs font-bold uppercase tracking-widest
                                shadow-sm hover:shadow-md hover:bg-opacity-90
                                transition-all duration-200
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
                                active:scale-95 whitespace-nowrap
                            "
                        >
                            Campus Virtual
                        </Link>
                    </div>

                    {/* ── BOTÓN MENÚ MÓVIL ── */}
                    <div className="lg:hidden flex items-center gap-2">
                        <ModeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`
                                p-2 rounded-lg transition-colors 
                                focus-visible:outline-none
                                ${!isTransparent 
                                    ? 'text-foreground hover:bg-accent' 
                                    : 'text-white bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 drop-shadow-md'}
                            `}
                            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── MENÚ MÓVIL ── */}
            <div
                className={`
                    lg:hidden overflow-hidden transition-all duration-300 ease-in-out absolute w-full top-full left-0
                    ${isOpen ? 'max-h-[600px] opacity-100 border-b border-border shadow-xl' : 'max-h-0 opacity-0'}
                `}
            >
                <div className={`bg-background/95 backdrop-blur-md px-4 space-y-1 ${isOpen ? 'py-4' : 'py-0'}`}>
                    {NAV_LINKS.map(({ label, href }) => (
                        <NavLink
                            key={label}
                            href={href}
                            pathname={pathname}
                            activeHash={activeHash}
                            isMobile={true}
                            isTransparent={false} 
                            onClick={() => {
                                setIsOpen(false);
                                href.includes('#') ? setActiveHash('#' + href.split('#')[1]) : setActiveHash('');
                            }}
                        >
                            {label}
                        </NavLink>
                    ))}

                    <div className={`pt-4 mt-2 border-t border-border/50 space-y-4 ${!isOpen && 'hidden'}`}>
                        {SHOW_PERMISO_EXAMEN && (
                            <Link
                                href="/PermisoExamen"
                                onClick={() => setIsOpen(false)}
                                className="
                                    flex justify-center w-full
                                    bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground
                                    border border-white dark:border-transparent
                                    px-4 py-2.5 rounded-full
                                    text-xs font-bold uppercase tracking-widest
                                    hover:bg-opacity-90 transition-all duration-200 shadow-sm
                                "
                            >
                                Permiso Examen
                            </Link>
                        )}
                        <Link
                            href="/campus"
                            onClick={() => setIsOpen(false)}
                            className="
                                flex justify-center w-full
                                bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground
                                border border-white dark:border-transparent
                                px-4 py-2.5 rounded-full
                                text-xs font-bold uppercase tracking-widest
                                hover:bg-opacity-90 transition-all duration-200 shadow-sm
                            "
                        >
                            Campus Virtual
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}


function NavLink({
    href,
    pathname,
    activeHash,
    children,
    onClick,
    isMobile = false,
    isTransparent = false
}: {
    href: string;
    pathname: string | null;
    activeHash: string;
    children: React.ReactNode;
    onClick?: () => void;
    isMobile?: boolean;
    isTransparent?: boolean;
}) {
    // Analizamos qué tipo de enlace es
    const isHashLink = href.includes('#');
    const hrefPath = href.split('#')[0] || '/';
    const hrefHash = isHashLink ? '#' + href.split('#')[1] : '';

    let isActive = false;

    // Lógica inteligente para prender o apagar el color
    if (isHashLink) {
        // Para "#carreras", estamos en el inicio (/) y el hash debe coincidir
        isActive = pathname === hrefPath && activeHash === hrefHash;
    } else if (href === '/') {
        isActive = pathname === '/' && activeHash === '';
    } else if (href === '/noticias') {
        isActive = pathname?.startsWith('/noticias') || false;
    } else if (href === '/nhdocs') {
        isActive = pathname?.startsWith('/nhdocs') || false;
    } else {
        isActive = pathname?.startsWith(href) || false;
    }

    let styles = '';
    
    // LETRAS AZULES, CERO ÓVALOS DE FONDO
    if (isMobile) {
        styles = isActive 
            ? 'text-[#155dfc] dark:text-blue-400 font-bold' // Azul puro para activo en móvil
            : 'text-foreground font-medium hover:text-[#155dfc] transition-colors';
    } else {
        if (!isTransparent) {
            // Navbar sólido (Al hacer scroll o dentro de una noticia)
            styles = isActive 
                ? 'text-[#155dfc] dark:text-blue-400 font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]' 
                : 'text-muted-foreground font-medium hover:text-[#155dfc] dark:hover:text-blue-400 transition-colors';
        } else {
            // Navbar transparente (Arriba de todo en Inicio o Noticias)
            styles = isActive 
                ? 'text-[#4785ff] font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]' // Azul un poco más claro para que se lea sobre la foto
                : 'text-white/80 font-medium hover:text-white drop-shadow-sm transition-colors';
        }
    }

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`
                uppercase tracking-widest
                transition-all duration-300 ease-in-out
                focus-visible:outline-none 
                ${isMobile 
                    ? 'block px-4 py-3 text-base w-full rounded-md' 
                    : 'relative px-2 xl:px-3 py-2 text-[11px] xl:text-sm'
                }
                tracking-wide
                transition-all duration-300 ease-in-out
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
                ${styles}
            `}
        >
            {children}
        </Link>
    );
}