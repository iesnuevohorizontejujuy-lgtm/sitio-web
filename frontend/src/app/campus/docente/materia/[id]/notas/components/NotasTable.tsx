'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { ParcialHeader } from './ParcialHeader';
import { NotaInput } from './NotaInput';
import { CondicionBadge } from './CondicionBadge';
import type { PlanillaData, ParcialMapped, AlumnoData } from '../types/planilla';

const PAGE_SIZE = 10;

const PARCIALES_BACKEND_NAMES = [
    '1°er Parcial',
    'Rec. 1°er Parcial',
    '2° Parcial',
    'Recup 2°do Parcial',
];

const PARCIALES_LABELS: { label: string; backendName: string; rec: boolean }[] = [
    { label: '1° Parcial', backendName: PARCIALES_BACKEND_NAMES[0], rec: false },
    { label: 'Rec. 1°', backendName: PARCIALES_BACKEND_NAMES[1], rec: true },
    { label: '2° Parcial', backendName: PARCIALES_BACKEND_NAMES[2], rec: false },
    { label: 'Rec. 2°', backendName: PARCIALES_BACKEND_NAMES[3], rec: true },
];

interface NotasTableProps {
    data: PlanillaData;
    cursoAbierto: boolean;
    notasLocales: Record<number, { parciales: Record<string, string>; notaFinal: string }>;
    searchValue: string;
    onSearchChange: (val: string) => void;
    onChangeParcial: (cursadaId: number, parcId: number, val: string) => void;
    handleCrearParcialFijo: (nombre: string, fecha: Date) => void;
    handleActualizarFechaParcial: (parcId: number, nuevaFecha: Date) => void;
}

function getCondicion(al: AlumnoData): string | null {
    return al.estado_actual === 'cursando' ? al.condicion_proyectada : al.estado_actual;
}

// Para avatares
function getInitials(apellido: string, nombre: string) {
    return `${apellido?.charAt(0) || ''}${nombre?.charAt(0) || ''}`.toUpperCase();
}
const AVATAR_COLORS = [
    'bg-primary text-primary-foreground dark:bg-blue-900/40 dark:text-blue-400',
];

export function NotasTable({
    data,
    cursoAbierto,
    notasLocales,
    searchValue,
    onSearchChange,
    onChangeParcial,
    handleCrearParcialFijo,
    handleActualizarFechaParcial,
}: NotasTableProps) {
    const [page, setPage] = useState(0);
    const [popoversOpen, setPopoversOpen] = useState<boolean[]>(
        Array(PARCIALES_LABELS.length).fill(false)
    );

    const setPopoverOpen = (i: number, val: boolean) =>
        setPopoversOpen(prev => prev.map((v, idx) => (idx === i ? val : v)));

    const parcialesMapped: ParcialMapped[] = useMemo(() => PARCIALES_LABELS.map((def, i) => {
        const definido = data.parciales_definidos[i] ?? null;
        return {
            ...def,
            id: definido?.id,
            fecha: definido?.fecha,
            existe: !!definido,
        };
    }), [data.parciales_definidos]);

    const totalAlumnos = data.alumnos.length;
    const totalPages = Math.max(1, Math.ceil(totalAlumnos / PAGE_SIZE));
    const alumnos = useMemo(() => data.alumnos.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE), [data.alumnos, page]);

    // Definimos las columnas dinámicamente para tener acceso a los métodos y estados de la tabla
    const columns = useMemo<ColumnDef<AlumnoData>[]>(() => {
        const cols: ColumnDef<AlumnoData>[] = [
            {
                accessorKey: 'dni',
                header: () => <div className="text-center">DNI</div>,
                cell: ({ row }) => (
                    <div className="text-xs font-medium text-muted-foreground text-center">
                        {row.original.dni}
                    </div>
                ),
            },
            {
                id: 'alumno',
                header: () => <div className="text-left w-full">ALUMNO</div>,
                cell: ({ row }) => {
                    const al = row.original;
                    const [apellido, nombre] = al.alumno.split(', ');
                    const colorClass = AVATAR_COLORS[al.id % AVATAR_COLORS.length];

                    return (
                        <div className="flex items-center gap-3 w-full">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${colorClass}`}>
                                {getInitials(apellido, nombre)}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-foreground truncate text-left">
                                    {apellido?.toUpperCase()} {nombre && `, ${nombre}`}
                                </p>
                                <p className="text-[10px] text-muted-foreground uppercase text-left">
                                    {al.modalidad === 'libre' ? 'Libre' : 'Regular'}
                                </p>
                            </div>
                        </div>
                    );
                },
            },
        ];

        // Añadir columnas de parciales
        parcialesMapped.forEach((p, i) => {
            cols.push({
                id: `parcial_${i}`,
                header: () => (
                    <div className="text-center w-full flex flex-col items-center">
                        <div className="mb-0.5">{p.label}</div>
                        <ParcialHeader
                            parcial={p}
                            index={i}
                            popoverOpen={popoversOpen[i]}
                            onPopoverChange={(val) => setPopoverOpen(i, val)}
                            onCrear={handleCrearParcialFijo}
                            onActualizar={handleActualizarFechaParcial}
                            cursoAbierto={cursoAbierto}
                        />
                    </div>
                ),
                cell: ({ row }) => {
                    const al = row.original;
                    const localData = notasLocales[al.id] ?? { parciales: {}, notaFinal: '' };
                    const esCursando = al.estado_actual === 'cursando';
                    const isEditable = p.existe && esCursando && cursoAbierto;
                    const val = (p.existe && p.id != null) ? (localData.parciales[String(p.id)] ?? '') : '';

                    return (
                        <div className="flex justify-center items-center w-full">
                            {p.existe ? (
                                <NotaInput
                                    value={val}
                                    onChange={(v) => p.id != null && onChangeParcial(al.id, p.id, v)}
                                    disabled={!isEditable}
                                    showLetras
                                />
                            ) : (
                                <span className="text-muted-foreground/30">—</span>
                            )}
                        </div>
                    );
                },
                meta: { rec: p.rec },
            });
        });

        // Columna Final
        cols.push({
            id: 'final',
            header: () => <div className="text-center">FINAL</div>,
            cell: ({ row }) => {
                const al = row.original;
                const localData = notasLocales[al.id] ?? { parciales: {}, notaFinal: '' };
                const esCursando = al.estado_actual === 'cursando';
                const puedeRendirFinal = ['regularizado', 'libre'].includes(al.estado_actual);

                // Calcular promedio de parciales efectivos (max entre parcial y su recup)
                const notasParciales = parcialesMapped.map(p =>
                    (p.existe && p.id != null) ? (parseFloat(localData.parciales[String(p.id)] || '') || null) : null
                );
                const ef1 = (notasParciales[0] !== null || notasParciales[1] !== null)
                    ? Math.max(notasParciales[0] ?? 0, notasParciales[1] ?? 0) : null;
                const ef2 = (notasParciales[2] !== null || notasParciales[3] !== null)
                    ? Math.max(notasParciales[2] ?? 0, notasParciales[3] ?? 0) : null;
                const promedioCursada = (ef1 !== null && ef2 !== null) ? ((ef1 + ef2) / 2) : null;

                return (
                    <div className="text-center">
                        {al.nota_final ? (
                            <span className={`font-bold text-sm ${Number(al.nota_final) < 6 ? 'text-destructive' : 'text-foreground'}`}>
                                {al.nota_final}
                            </span>
                        ) : promedioCursada !== null && !esCursando ? (
                            <div>
                                <span className={`font-bold text-sm ${promedioCursada < 6 ? 'text-destructive' : 'text-foreground'}`}>
                                    {promedioCursada % 1 === 0 ? promedioCursada : promedioCursada.toFixed(2)}
                                </span>
                                {puedeRendirFinal && (
                                    <span className="block text-[10px] text-muted-foreground mt-0.5 italic">
                                        {al.estado_actual === 'libre' ? 'libre' : 'pendiente mesa'}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span className="text-muted-foreground/30">—</span>
                        )}
                    </div>
                );
            },
        });

        // Columna de Condición
        cols.push({
            id: 'condicion',
            header: () => <div className="text-center">CONDICIÓN</div>,
            cell: ({ row }) => {
                const al = row.original;
                const condicion = getCondicion(al);
                return (
                    <div className="flex justify-center">
                        <CondicionBadge condicion={condicion} />
                    </div>
                );
            },
        });

        return cols;
    }, [
        parcialesMapped,
        popoversOpen,
        notasLocales,
        cursoAbierto,
        handleCrearParcialFijo,
        handleActualizarFechaParcial,
        onChangeParcial
    ]);

    const tableConfig = useReactTable({
        data: alumnos,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="flex-1 flex flex-col min-h-0 px-6 pb-6 overflow-hidden">
            {/* Table Container con fondo blanco y estilo de Stitch */}
            <div className="flex-1 flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden min-h-0">
                {/* Search Bar / Toolbar (Inside Card) */}
                <div className="px-5 py-4 border-b border-border/50 bg-muted/10 flex items-center justify-between shrink-0">
                    <div className="relative w-full md:max-w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Buscar alumno por nombre o DNI..."
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="h-9 pl-9 pr-4 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    <Table>
                        <TableHeader className="sticky top-0 z-20 bg-primary shadow-sm hover:bg-primary [&_tr]:hover:bg-primary">
                            {tableConfig.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="border-b border-primary-foreground/10 data-[state=selected]:bg-primary h-auto hover:bg-primary">
                                    {headerGroup.headers.map((header) => {
                                        // Recuperar info adicional como si es examen recuperatorio
                                        const meta = header.column.columnDef.meta as { rec?: boolean } | undefined;
                                        return (
                                            <TableHead
                                                key={header.id}
                                                className={`px-4 py-3 text-[10px] font-bold text-primary-foreground uppercase tracking-widest h-auto border-r border-primary-foreground/10 last:border-r-0 ${meta?.rec ? 'bg-primary-foreground/5' : ''
                                                    } ${header.column.id === 'alumno' ? 'w-full min-w-[200px] text-left' : 'text-center'} ${header.column.id === 'dni' ? 'w-16 min-w-[64px]' : ''} ${header.column.id.startsWith('parcial') ? 'w-32 min-w-[128px] px-3' : ''} ${header.column.id === 'final' ? 'w-24 min-w-[96px]' : ''} ${header.column.id === 'condicion' ? 'w-32 min-w-[128px]' : ''}`}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {tableConfig.getRowModel().rows?.length ? (
                                tableConfig.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && 'selected'}
                                        className="hover:bg-muted/30 transition-colors group border-b border-border"
                                    >
                                        {row.getVisibleCells().map((cell) => {
                                            const meta = cell.column.columnDef.meta as { rec?: boolean } | undefined;
                                            return (
                                                <TableCell 
                                                    key={cell.id} 
                                                    className={`px-4 py-2 border-r border-border/50 last:border-r-0 ${meta?.rec ? 'bg-muted/10' : ''} ${cell.column.id.startsWith('parcial') ? 'px-3' : ''} ${cell.column.id === 'alumno' ? 'w-full' : ''}`}
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            )
                                        })}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No hay alumnos registrados.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Paginación estilo Stitch */}
                {totalPages > 1 && (
                    <div className="px-6 py-3 bg-muted/40 border-t border-border flex items-center justify-between shrink-0">
                        <p className="text-xs text-muted-foreground font-medium hidden sm:block">
                            Mostrando {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, totalAlumnos)} de {totalAlumnos} alumnos
                        </p>
                        <div className="flex gap-1.5 ml-auto">
                            <button
                                onClick={() => setPage(p => p - 1)}
                                disabled={page === 0}
                                className="w-8 h-8 flex items-center justify-center rounded bg-card border border-border text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i)}
                                    className={`w-8 h-8 flex items-center justify-center rounded transition-all font-bold text-xs ${page === i
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-card border border-border text-muted-foreground hover:bg-primary/10 hover:text-primary'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={page === totalPages - 1}
                                className="w-8 h-8 flex items-center justify-center rounded bg-card border border-border text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
