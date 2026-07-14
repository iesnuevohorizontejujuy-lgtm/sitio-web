'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/campus/actions';
import {
    LayoutDashboard,
    BookOpen,
    CalendarDays,
    BarChart3,
    LogOut,
    GraduationCap,
    Moon,
    Sun,
    ChevronsUpDown,
    FileText,
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
    SidebarRail,
    SidebarSeparator,
} from '@/components/ui/sidebar';
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


// ── Grupos de navegación separados por contexto ──────────────────────────────

const generalItems = [
    {
        label: 'Mi Panel',
        href: '/campus/dashboard',
        icon: LayoutDashboard,
    },
];

const academicItems = [
    {
        label: 'Inscripción Materias',
        href: '/campus/materias',
        icon: BookOpen,
    },
    {
        label: 'Mis Cursos',
        href: '/campus/cursos',
        icon: CalendarDays,
    },
    {
        label: 'Mesas de Examen',
        href: '/campus/mesas',
        icon: FileText,
    },
];

const estadisticasItems = [
    {
        label: 'Situación Académica',
        href: '/campus/situacion-academica',
        icon: BarChart3,
    },
];

// Items de estadísticas para egresados (solo historial)
const estadisticasItemsEgresado = [
    {
        label: 'Historial Académico',
        href: '/campus/situacion-academica?tab=historial',
        icon: BarChart3,
    },
];

const beneficiosItems = [
    {
        label: 'Beneficios',
        href: '/campus/beneficios',
        icon: GraduationCap,
    },
];

// ── Componente ────────────────────────────────────────────────────────────────

export function CampusSidebar({ userName, role, alumnoEstado = 'activo' }) {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // Determinar si es alumno egresado
    const normalizedEstado = (alumnoEstado ?? '').toString().trim().toLowerCase();
    const isEgresado = normalizedEstado === 'egresado';

    const renderMenuItems = (items) =>
        items.map((item) => (
            <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                >
                    <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        ));

    return (
        <Sidebar collapsible="icon">
            {/* ── HEADER ── */}
            <SidebarHeader className="border-b border-sidebar-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/campus/dashboard">
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

                {/* Grupo 1: General / Cuenta */}
                <SidebarGroup>
                    <SidebarGroupLabel>General</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {renderMenuItems(generalItems)}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                {/* Grupo 2: Académico */}
                {!isEgresado && (
                    <>
                        <SidebarGroup>
                            <SidebarGroupLabel>Académico</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {renderMenuItems(academicItems)}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                        <SidebarSeparator />
                    </>
                )}


                {/* Grupo 3: Estadísticas */}
                <SidebarGroup>
                    <SidebarGroupLabel>Estadísticas</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {renderMenuItems(isEgresado ? estadisticasItemsEgresado : estadisticasItems)}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {!isEgresado && (
                    <>
                        <SidebarSeparator />

                        {/* Grupo 4: Beneficios */}
                        <SidebarGroup>
                            <SidebarGroupLabel>Beneficios</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {renderMenuItems(beneficiosItems)}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </>
                )}

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
                                            {userName ? userName.charAt(0).toUpperCase() : 'A'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">
                                            {userName || 'Alumno'}
                                        </span>
                                        <span className="truncate text-xs text-muted-foreground">
                                            Alumno
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
                                                {userName ? userName.charAt(0).toUpperCase() : 'A'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">
                                                {userName || 'Alumno'}
                                            </span>
                                            <span className="truncate text-xs text-muted-foreground">
                                                Alumno
                                            </span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
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
