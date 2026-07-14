'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/campus/actions';
import {
    LayoutDashboard,
    LogOut,
    Moon,
    Sun,
    FileText,
    ClipboardList,
    Users,
    Settings,
    BookOpen,
    ChevronRight,
    ChevronsUpDown,
    Loader2,
    Lock,
    History,
    ListChecks,
    UserRoundPen,
} from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    SidebarRail,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTheme } from "next-themes";
import { fetchDocenteMaterias, fetchDocentePerfil } from '@/app/campus/docente/actions';

// ── Componente ──
export function DocenteSidebar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [materias, setMaterias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [docenteNombre, setDocenteNombre] = useState('');

    useEffect(() => {
        setMounted(true);
        Promise.all([
            fetchDocenteMaterias().catch(() => []),
            fetchDocentePerfil().catch(() => null),
        ]).then(([mats, perfil]) => {
            setMaterias(Array.isArray(mats) ? mats : []);
            if (perfil?.nombre) {
                setDocenteNombre(`${perfil.apellido}, ${perfil.nombre}`);
            }
            setLoading(false);
        });
    }, []);

    const isMateriaActive = (claseId) => {
        return pathname.includes(`/campus/docente/materia/${claseId}`) ||
               pathname.includes(`/campus/docente/asistencia/${claseId}`) ||
               pathname.includes(`/campus/docente/configuracion/${claseId}`);
    };

    // Separar materias activas (año actual) de históricas (años anteriores)
    const anioActual = new Date().getFullYear();
    const materiasActivas = materias.filter(m => !m.cerrada);
    const materiasHistoricas = materias.filter(m => m.cerrada);

    // Agrupar históricas por ciclo_lectivo: { 2025: [...], 2024: [...] }
    const historicosPorAnio = materiasHistoricas.reduce((acc, mat) => {
        const anio = mat.ciclo_lectivo ?? 'Anterior';
        if (!acc[anio]) acc[anio] = [];
        acc[anio].push(mat);
        return acc;
    }, {});
    const aniosHistoricos = Object.keys(historicosPorAnio).sort((a, b) => b - a);

    return (
        <Sidebar collapsible="icon">
            {/* ── HEADER ── */}
            <SidebarHeader className="border-b border-sidebar-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/campus/docente/dashboard">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-primary text-white overflow-hidden shrink-0">
                                    <Image
                                        src="/IsnhLogo.png"
                                        width={32}
                                        height={32}
                                        alt="IESNH Logo"
                                        className="object-cover"
                                    />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">CAMPUS VIRTUAL</span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        IES Nuevo Horizonte
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* ── CONTENIDO ── */}
            <SidebarContent>

                {/* Grupo 1: Panel principal */}
                <SidebarGroup>
                    <SidebarGroupLabel>General</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === '/campus/docente/dashboard'}
                                    tooltip="Panel Principal"
                                >
                                    <Link href="/campus/docente/dashboard">
                                        <LayoutDashboard />
                                        <span>Panel Principal</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname.startsWith('/campus/docente/mesas')}
                                    tooltip="Mesas de Examen"
                                >
                                    <Link href="/campus/docente/mesas">
                                        <FileText />
                                        <span>Mesas de Examen</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                {/* Grupo 2: Materias activas */}
                <SidebarGroup>
                    <SidebarGroupLabel>Mis Materias</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {loading ? (
                                <SidebarMenuItem>
                                    <SidebarMenuButton disabled>
                                        <Loader2 className="animate-spin" />
                                        <span>Cargando...</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ) : materiasActivas.length === 0 && materiasHistoricas.length === 0 ? (
                                <SidebarMenuItem>
                                    <SidebarMenuButton disabled>
                                        <BookOpen />
                                        <span className="text-muted-foreground text-xs">Sin materias</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ) : materiasActivas.length === 0 ? (
                                <SidebarMenuItem>
                                    <SidebarMenuButton disabled>
                                        <BookOpen />
                                        <span className="text-muted-foreground text-xs">Sin materias activas</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ) : (
                                materiasActivas.map((mat) => (
                                    <Collapsible
                                        key={mat.id}
                                        asChild
                                        defaultOpen={isMateriaActive(mat.id)}
                                        className="group/collapsible"
                                    >
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton
                                                    tooltip={mat.nombre}
                                                    isActive={isMateriaActive(mat.id)}
                                                >
                                                    <BookOpen />
                                                    <span className="truncate">{mat.nombre}</span>
                                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    <SidebarMenuSubItem>
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={pathname === `/campus/docente/materia/${mat.id}/notas`}
                                                        >
                                                            <Link href={`/campus/docente/materia/${mat.id}/notas`}>
                                                                <ClipboardList />
                                                                <span>Notas</span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                    <SidebarMenuSubItem>
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={pathname === `/campus/docente/materia/${mat.id}/tps`}
                                                        >
                                                            <Link href={`/campus/docente/materia/${mat.id}/tps`}>
                                                                <ListChecks />
                                                                <span>Trabajos Prácticos</span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                    <SidebarMenuSubItem>
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={pathname === `/campus/docente/materia/${mat.id}/asistencia`}
                                                        >
                                                            <Link href={`/campus/docente/materia/${mat.id}/asistencia`}>
                                                                <Users />
                                                                <span>Asistencia</span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                ))
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Grupo 3: Historial de años anteriores */}
                {aniosHistoricos.length > 0 && (
                    <>
                        <SidebarSeparator />
                        <SidebarGroup>
                            <Collapsible defaultOpen={materiasActivas.length === 0} className="group/historial">
                                <SidebarGroupLabel asChild>
                                    <CollapsibleTrigger className="flex w-full items-center justify-between hover:text-foreground transition-colors">
                                        <span className="flex items-center gap-1.5">
                                            <History size={12} />
                                            Historial de Cursadas
                                        </span>
                                        <ChevronRight className="size-3 transition-transform duration-200 group-data-[state=open]/historial:rotate-90" />
                                    </CollapsibleTrigger>
                                </SidebarGroupLabel>
                                <CollapsibleContent>
                                    <SidebarGroupContent>
                                        <SidebarMenu>
                                            {aniosHistoricos.map(anio => (
                                                <Collapsible
                                                    key={anio}
                                                    defaultOpen={materiasActivas.length === 0 && aniosHistoricos[0] === anio}
                                                    className="group/anio"
                                                >
                                                    <SidebarMenuItem>
                                                        <CollapsibleTrigger asChild>
                                                            <SidebarMenuButton
                                                                className="text-muted-foreground"
                                                                tooltip={`Cursadas ${anio}`}
                                                            >
                                                                <Lock size={14} className="shrink-0" />
                                                                <span className="font-semibold text-xs">{anio}</span>
                                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/anio:rotate-90" />
                                                            </SidebarMenuButton>
                                                        </CollapsibleTrigger>
                                                        <CollapsibleContent>
                                                            <SidebarMenuSub>
                                                                {historicosPorAnio[anio].map(mat => (
                                                                    <Collapsible
                                                                        key={mat.id}
                                                                        defaultOpen={isMateriaActive(mat.id)}
                                                                        className="group/matold"
                                                                    >
                                                                        <SidebarMenuSubItem>
                                                                            <CollapsibleTrigger asChild>
                                                                                <SidebarMenuSubButton
                                                                                    isActive={isMateriaActive(mat.id)}
                                                                                    className="text-muted-foreground"
                                                                                >
                                                                                    <BookOpen size={13} className="shrink-0" />
                                                                                    <span className="truncate text-xs">{mat.nombre}</span>
                                                                                    <ChevronRight className="ml-auto size-3 transition-transform duration-200 group-data-[state=open]/matold:rotate-90" />
                                                                                </SidebarMenuSubButton>
                                                                            </CollapsibleTrigger>
                                                                            <CollapsibleContent>
                                                                                <SidebarMenuSub>
                                                                                    <SidebarMenuSubItem>
                                                                                        <SidebarMenuSubButton asChild isActive={pathname === `/campus/docente/materia/${mat.id}/notas`}>
                                                                                            <Link href={`/campus/docente/materia/${mat.id}/notas`}>
                                                                                                <ClipboardList size={12} />
                                                                                                <span className="text-xs">Notas</span>
                                                                                            </Link>
                                                                                        </SidebarMenuSubButton>
                                                                                    </SidebarMenuSubItem>
                                                                                    <SidebarMenuSubItem>
                                                                                        <SidebarMenuSubButton asChild isActive={pathname === `/campus/docente/materia/${mat.id}/asistencia`}>
                                                                                            <Link href={`/campus/docente/materia/${mat.id}/asistencia`}>
                                                                                                <Users size={12} />
                                                                                                <span className="text-xs">Asistencia</span>
                                                                                            </Link>
                                                                                        </SidebarMenuSubButton>
                                                                                    </SidebarMenuSubItem>
                                                                                </SidebarMenuSub>
                                                                            </CollapsibleContent>
                                                                        </SidebarMenuSubItem>
                                                                    </Collapsible>
                                                                ))}
                                                            </SidebarMenuSub>
                                                        </CollapsibleContent>
                                                    </SidebarMenuItem>
                                                </Collapsible>
                                            ))}
                                        </SidebarMenu>
                                    </SidebarGroupContent>
                                </CollapsibleContent>
                            </Collapsible>
                        </SidebarGroup>
                    </>
                )}

                <SidebarSeparator />

                {/* Grupo 3: Mi Cuenta */}
                <SidebarGroup>
                    <SidebarGroupLabel>Mi Cuenta</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname.startsWith('/campus/docente/legajo')}
                                    tooltip="Mi Legajo"
                                >
                                    <Link href="/campus/docente/legajo">
                                        <FileText />
                                        <span>Mi Legajo</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>

            {/* ── FOOTER ── */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold">
                                            {docenteNombre ? docenteNombre.charAt(0).toUpperCase() : 'D'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">
                                            {docenteNombre || 'Docente'}
                                        </span>
                                        <span className="truncate text-xs text-muted-foreground">
                                            Docente
                                        </span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                side="bottom"
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold">
                                                {docenteNombre ? docenteNombre.charAt(0).toUpperCase() : 'D'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">
                                                {docenteNombre || 'Docente'}
                                            </span>
                                            <span className="truncate text-xs text-muted-foreground">
                                                Docente
                                            </span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link href="/campus/docente/perfil" className="cursor-pointer">
                                            <UserRoundPen />
                                            Mi Perfil
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem
                                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                        className="cursor-pointer"
                                    >
                                        {mounted && theme === 'dark' ? <Sun /> : <Moon />}
                                        {mounted && theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onSelect={() => logoutAction()}
                                    className="cursor-pointer"
                                >
                                    <LogOut />
                                    Cerrar Sesión
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
