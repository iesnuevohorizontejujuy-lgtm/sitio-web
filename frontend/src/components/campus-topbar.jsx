'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Bell, MessageCircle, PanelLeft, X, BellRing, Info, CheckCircle, AlertTriangle, UserRoundPen } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// Importamos nuestras Server Actions
import { getNotificacionesAction, marcarTodasComoLeidasAction, eliminarNotificacionAction } from './campus-topbar-actions';

const titleMap = {
    '/campus/dashboard': 'Mi Panel',
    '/campus/materias': 'Inscripción Académica',
    '/campus/cursos': 'Mis Cursos',
    '/campus/situacion-academica': 'Situación Académica',
    '/campus/beneficios': 'Beneficios',
    '/campus/perfil': 'Configuración de Perfil',
    '/campus/docente/perfil': 'Configuración de Perfil',
};

const NotificationIcon = ({ type }) => {
    switch (type) {
        case 'success':
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        case 'warning':
            return <AlertTriangle className="h-5 w-5 text-amber-500" />;
        default:
            return <Info className="h-5 w-5 text-blue-500" />;
    }
};

export function CampusTopbar() {
    const pathname = usePathname();
    const currentTitle = titleMap[pathname] || 'Campus Virtual';

    const [notificaciones, setNotificaciones] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchNotificaciones = async () => {
            const data = await getNotificacionesAction();
            setNotificaciones(data);
            setUnreadCount(data.filter(n => !n.read_at).length);
        };

        fetchNotificaciones();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggleDropdown = async () => {
        const willOpen = !isOpen;
        setIsOpen(willOpen);

        if (willOpen && unreadCount > 0) {
            setUnreadCount(0);
            setNotificaciones(prev =>
                prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
            );

            await marcarTodasComoLeidasAction();
        }
    };

    const eliminarNotificacion = async (id, e) => {
        e.stopPropagation();

        setNotificaciones(prev => prev.filter(n => n.id !== id));
        await eliminarNotificacionAction(id);
    };

    const isDocente = pathname.startsWith('/campus/docente');
    const perfilLink = isDocente ? '/campus/docente/perfil' : '/campus/perfil';
    const isPerfilActive = pathname === perfilLink;

    return (
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="flex h-14 items-center justify-between gap-3 px-4 md:h-16 md:px-6">

                {/* ── IZQUIERDA ── */}
                <div className="flex min-w-0 items-center gap-3">
                    <SidebarTrigger className="h-9 w-9 rounded-lg border border-border/70 hover:bg-muted">
                        <PanelLeft className="h-4 w-4" />
                    </SidebarTrigger>

                    <div className="hidden h-4 w-px bg-border sm:block" />

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground md:text-base">
                            {currentTitle}
                        </p>
                        <p className="hidden text-xs text-muted-foreground sm:block">
                            Campus Virtual
                        </p>
                    </div>
                </div>

                {/* ── DERECHA ── */}
                <div className="flex items-center gap-2">

                    <div className="relative" ref={dropdownRef}>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleToggleDropdown}
                            className={`relative h-10 w-10 rounded-xl border border-border/70 transition-colors ${isOpen ? 'bg-muted' : ''}`}
                            aria-label="Notificaciones"
                        >
                            <Bell className="h-5 w-5 text-foreground" />

                            {unreadCount > 0 && (
                                <>
                                    <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-background z-10" />
                                    <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 animate-ping opacity-75" />
                                </>
                            )}
                        </Button>

                        {isOpen && (
                            <div className="absolute right-0 mt-2 w-[320px] sm:w-[380px] rounded-2xl border border-border bg-card shadow-2xl origin-top-right animate-in fade-in zoom-in-95 duration-200 z-50 overflow-hidden flex flex-col max-h-[85vh]">

                                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30 shrink-0">
                                    <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                                        <BellRing size={16} className="text-primary" /> Notificaciones
                                    </h3>
                                </div>

                                <div className="overflow-y-auto overscroll-contain">
                                    {notificaciones.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                            <Bell className="h-10 w-10 text-muted-foreground/30 mb-3" />
                                            <p className="text-sm font-medium text-foreground">Al día</p>
                                            <p className="text-xs text-muted-foreground mt-1">No tienes notificaciones pendientes.</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col">
                                            {notificaciones.map((notif) => (
                                                <div
                                                    key={notif.id}
                                                    className="group relative px-4 py-4 border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors flex gap-3"
                                                >
                                                    <div className="shrink-0 mt-0.5">
                                                        <NotificationIcon type={notif.data.tipo} />
                                                    </div>

                                                    <div className="flex-1 min-w-0 pr-6">
                                                        <p className="text-sm font-bold text-foreground leading-tight mb-1">
                                                            {notif.data.titulo}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground leading-relaxed break-words">
                                                            {notif.data.mensaje}
                                                        </p>
                                                        <p className="text-[10px] font-medium text-muted-foreground/60 mt-2 uppercase tracking-wider">
                                                            {new Date(notif.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>

                                                    <button
                                                        onClick={(e) => eliminarNotificacion(notif.id, e)}
                                                        className="absolute right-2 top-2 p-1.5 text-muted-foreground/50 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                                                        title="Eliminar notificación"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="relative h-10 w-10 rounded-xl border border-border/70"
                        aria-label="Chat"
                    >
                        <MessageCircle className="h-5 w-5" />
                    </Button>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    asChild
                                    className={`relative h-10 w-10 rounded-xl border border-border/70 transition-colors ${isPerfilActive ? 'bg-muted' : ''}`}
                                    aria-label="Configuración"
                                >
                                    <Link href={perfilLink}>
                                        <UserRoundPen className="h-6 w-6" />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" sideOffset={8}>
                                Editar perfil
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </header>
    );
}