'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
    ChevronDown, ChevronRight, GraduationCap, LayoutGrid,
    Users, ClipboardList, BookOpen, Settings
} from 'lucide-react';

/**
 * Sección colapsable por carrera, con módulos y materias dentro.
 */
function CarreraSection({ nombreCarrera, modulosObj, planillas }) {
    const [open, setOpen] = useState(true); // abierto por defecto

    const totalMaterias = Object.values(modulosObj).flat().length;

    return (
        <div className="border border-border rounded-xl overflow-hidden">
            {/* Header carrera - clickeable */}
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-4 py-3.5 bg-muted/40 hover:bg-muted/70 transition-colors text-left"
            >
                <div className="flex items-center gap-2.5">
                    <span className="p-1.5 bg-primary/10 text-primary rounded-lg">
                        <GraduationCap size={16} />
                    </span>
                    <div>
                        <h2 className="text-sm font-extrabold text-foreground uppercase tracking-tight">
                            {nombreCarrera}
                        </h2>
                        <p className="text-[10px] text-muted-foreground">
                            {totalMaterias} {totalMaterias === 1 ? 'materia' : 'materias'}
                        </p>
                    </div>
                </div>
                <div className="text-muted-foreground">
                    {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
            </button>

            {/* Cuerpo colapsable */}
            {open && (
                <div className="p-4 space-y-5 border-t border-border bg-background">
                    {Object.entries(modulosObj).map(([nombreModulo, listaMaterias]) => (
                        <div key={nombreModulo}>
                            {/* Subtítulo módulo */}
                            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5 ml-1 pb-1.5 border-b border-border">
                                <LayoutGrid size={11} /> {nombreModulo}
                            </h3>

                            {/* Grid de cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                {listaMaterias.map(materia => {
                                    const planilla = planillas.find(p => p.claseId === materia.id);
                                    const alumnos = planilla?.data?.alumnos ?? [];
                                    const avgAsist = alumnos.length > 0
                                        ? Math.round(alumnos.reduce((s, a) => s + (a.stats?.asistencia ?? 0), 0) / alumnos.length)
                                        : null;

                                    return (
                                        <MateriaCard
                                            key={materia.id}
                                            materia={materia}
                                            avgAsist={avgAsist}
                                            alumnosCount={alumnos.length}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/**
 * Card individual de una materia con acciones.
 */
function MateriaCard({ materia, avgAsist, alumnosCount }) {
    return (
        <div className="bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
            {/* Cuerpo */}
            <div className="p-4 flex-1">
                <p className="text-[10px] font-mono text-muted-foreground mb-1">{materia.codigo}</p>
                <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2">{materia.nombre}</h3>
                <p className="text-[11px] text-muted-foreground mt-1">
                    {materia.curso}{materia.anio && ` · ${materia.anio}° año`}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-3 mt-2.5">
                    {alumnosCount > 0 && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <Users size={13} className="text-primary" /> {alumnosCount} alumnos
                        </div>
                    )}
                </div>

                {/* Barra de asistencia */}
                {avgAsist !== null && (
                    <div className="mt-2.5 flex items-center gap-1.5">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${avgAsist >= 80 ? 'bg-chart-2' : avgAsist >= 50 ? 'bg-chart-3' : 'bg-chart-5'}`}
                                style={{ width: `${avgAsist}%` }}
                            />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-muted-foreground tabular-nums">
                            {avgAsist}%
                        </span>
                    </div>
                )}
            </div>

            {/* Footer – acciones */}
            <div className="px-3 pb-3 grid grid-cols-3 gap-2">
                <Link
                    href={materia.link_asistencia}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-card border border-border text-chart-2 text-xs font-bold hover:bg-chart-2/10 hover:border-chart-2/30 transition-colors"
                >
                    <Users size={13} /> Asistencia
                </Link>
                <Link
                    href={materia.link_notas}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-primary border border-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors"
                >
                    <ClipboardList size={13} /> Notas
                </Link>
                <Link
                    href={`/campus/docente/configuracion/${materia.id}`}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-card border border-border text-muted-foreground text-xs font-bold hover:bg-muted/50 hover:text-foreground transition-colors"
                >
                    <Settings size={13} /> Config.
                </Link>
            </div>
        </div>
    );
}

/**
 * Grilla principal de materias con carreras colapsables.
 * Recibe los datos ya calculados desde el Server Component.
 */
export function MateriasGrid({ materiasAgrupadas, planillas }) {
    const totalCarreras = Object.keys(materiasAgrupadas).length;

    if (totalCarreras === 0) {
        return (
            <div className="bg-card p-10 rounded-xl border border-border text-center">
                <BookOpen size={40} className="mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-base font-semibold text-foreground">Sin materias asignadas</h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Contactá con administración si creés que es un error.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {Object.entries(materiasAgrupadas).map(([nombreCarrera, modulosObj]) => (
                <CarreraSection
                    key={nombreCarrera}
                    nombreCarrera={nombreCarrera}
                    modulosObj={modulosObj}
                    planillas={planillas}
                />
            ))}
        </div>
    );
}
