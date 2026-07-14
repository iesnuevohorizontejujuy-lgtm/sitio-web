'use client';

import { useMemo, useState } from 'react';
import {
    Award,
    BarChart3,
    BookOpen,
    CheckCircle,
    GraduationCap,
    Search,
    ShieldCheck,
    XCircle,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

const ESTADOS_APROBADOS = ['Promocionado', 'Aprobado', 'Equivalencia'];

function normalizarNumero(valor) {
    if (typeof valor === 'number') {
        return Number.isFinite(valor) ? valor : null;
    }

    if (typeof valor !== 'string') {
        return null;
    }

    const limpio = valor.replace(',', '.').trim();
    if (!limpio || limpio === '-') {
        return null;
    }

    const numero = Number(limpio);
    return Number.isFinite(numero) ? numero : null;
}

function getEstadoBadge(estado) {
    switch (estado) {
        case 'Promoción':
        case 'Promocionado':
        case 'Examen Final':
        case 'Aprobado':
        case 'Equivalencia':
            return {
                icon: Award,
                className: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300',
            };
        case 'Regularizado':
            return {
                icon: CheckCircle,
                className: 'border-primary/20 bg-primary/10 text-primary',
            };
        case 'Adeuda':
        case 'Libre':
            return {
                icon: XCircle,
                className: 'border-destructive/20 bg-destructive/10 text-destructive',
            };
        default:
            return {
                icon: ShieldCheck,
                className: 'border-border bg-muted text-muted-foreground',
            };
    }
}

function StatCard({ icon: Icon, label, value, helper, accentClass }) {
    return (
        <Card className="gap-0 border-border/70 bg-card/95 shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                    <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', accentClass)}>
                        <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">
                        {label}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="space-y-1">
                <p className="text-3xl font-black tracking-tight text-foreground">{value}</p>
                <p className="text-sm font-medium text-muted-foreground">{helper}</p>
            </CardContent>
        </Card>
    );
}

export function EgresadoHistorialView({ historial = [] }) {
    const [search, setSearch] = useState('');

    const finalizadas = useMemo(
        () => historial.filter((materia) => materia.estado !== 'Cursando'),
        [historial],
    );

    const filtradas = useMemo(() => {
        const termino = search.trim().toLowerCase();

        if (!termino) {
            return finalizadas;
        }

        return finalizadas.filter((materia) =>
            materia.materia?.toLowerCase().includes(termino),
        );
    }, [finalizadas, search]);

    const materiasAprobadas = finalizadas.filter((materia) =>
        ESTADOS_APROBADOS.includes(materia.estado),
    ).length;

    const notasFinales = finalizadas
        .map((materia) => normalizarNumero(materia.nota_final))
        .filter((nota) => nota !== null);

    const promedioGeneral = notasFinales.length > 0
        ? (notasFinales.reduce((total, nota) => total + nota, 0) / notasFinales.length).toFixed(1)
        : '-';

    const anioEgreso = finalizadas.reduce((maximo, materia) => {
        const anio = Number(materia.anio_cursada);
        return Number.isFinite(anio) && anio > maximo ? anio : maximo;
    }, 0);

    return (
        <div className="space-y-8 pb-10">
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    icon={BookOpen}
                    label="Materias"
                    value={finalizadas.length}
                    helper="Total de materias cursadas"
                    accentClass="bg-primary/10 text-primary"
                />
                <StatCard
                    icon={CheckCircle}
                    label="Logro"
                    value={materiasAprobadas}
                    helper="Materias aprobadas"
                    accentClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                />
                <StatCard
                    icon={BarChart3}
                    label="Promedio"
                    value={promedioGeneral}
                    helper="Promedio general"
                    accentClass="bg-sky-500/10 text-sky-600 dark:text-sky-400"
                />
                <StatCard
                    icon={Award}
                    label="Egreso"
                    value={anioEgreso || '-'}
                    helper="Año de egreso"
                    accentClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
                />
            </section>

            <section>
                <Card className="gap-0 overflow-hidden border-border/70 shadow-sm">
                    <CardHeader className="border-b border-border/70 pb-4 md:flex md:flex-row md:items-center md:justify-between md:gap-6">
                        <div>
                            <CardTitle className="text-xl font-black tracking-tight">Listado de Materias</CardTitle>
                            <CardDescription>
                                Consultá tu historial completo y filtrá por nombre de materia.
                            </CardDescription>
                        </div>

                        <div className="relative mt-4 w-full md:mt-0 md:max-w-xs">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Buscar materia..."
                                className="h-10 w-full rounded-full border border-border bg-muted/60 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-primary/40 focus:bg-background focus:ring-2 focus:ring-primary/15"
                            />
                        </div>
                    </CardHeader>

                    <CardContent className="px-0">
                        {filtradas.length === 0 ? (
                            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
                                No hay materias que coincidan con la búsqueda.
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/60 hover:bg-muted/60">
                                        <TableHead className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                                            Materia
                                        </TableHead>
                                        <TableHead className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                                            Módulo
                                        </TableHead>
                                        <TableHead className="px-6 py-4 text-center text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                                            Año
                                        </TableHead>
                                        <TableHead className="px-6 py-4 text-center text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                                            Condición
                                        </TableHead>
                                        <TableHead className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                                            Nota Final
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtradas.map((materia) => {
                                        const condicion = materia.condicion ?? materia.estado;
                                        const badge = getEstadoBadge(condicion);
                                        const Icon = badge.icon;

                                        return (
                                            <TableRow key={materia.id}>
                                                <TableCell className="px-6 py-4 font-bold text-foreground">
                                                    {materia.materia}
                                                </TableCell>
                                                <TableCell className="px-6 py-4 font-medium text-muted-foreground">
                                                    {materia.modulo ?? '-'}
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-center font-medium text-muted-foreground">
                                                    {materia.anio_cursada}
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-center">
                                                    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold shadow-sm', badge.className)}>
                                                        <Icon className="h-3.5 w-3.5" />
                                                        {condicion}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-right text-lg font-black text-foreground">
                                                    {materia.nota_final !== '-' ? materia.nota_final : (
                                                        <span className="text-muted-foreground/40">-</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}