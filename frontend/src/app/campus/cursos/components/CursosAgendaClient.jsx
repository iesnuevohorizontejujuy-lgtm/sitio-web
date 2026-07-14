'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays } from 'lucide-react';

import { CalendarioSemanal } from './CalendarioSemanal';
import { ProximoExamenCard } from './ProximoExamenCard';
import { TrabajoPracticoCard } from './TrabajoPractico';

export default function CursosAgendaClient({ cursos = [] }) {
    const cursosSeguros = useMemo(() => (Array.isArray(cursos) ? cursos : []), [cursos]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState(0);
    const [mostrarContenido, setMostrarContenido] = useState(true);
    const cambioCursoTimeoutRef = useRef(null);

    const cursoActual = cursosSeguros[cursoSeleccionado] ?? null;

    useEffect(() => {
        return () => {
            if (cambioCursoTimeoutRef.current) {
                clearTimeout(cambioCursoTimeoutRef.current);
            }
        };
    }, []);

    const handleSeleccionCurso = (index) => {
        if (index === cursoSeleccionado) {
            return;
        }

        setMostrarContenido(false);

        if (cambioCursoTimeoutRef.current) {
            clearTimeout(cambioCursoTimeoutRef.current);
        }

        cambioCursoTimeoutRef.current = setTimeout(() => {
            setCursoSeleccionado(index);
            setMostrarContenido(true);
        }, 160);
    };

    return (
        <div className="space-y-8 pb-10 max-w-6xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2 mb-1">
                    <CalendarDays className="text-primary" /> Mis Cursos
                </h1>
                <p className="text-muted-foreground text-sm">Cronograma semanal y evaluaciones pendientes.</p>
            </div>

            {cursosSeguros.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
                    No tenes cursos asignados en este momento.
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="rounded-xl border border-border bg-muted/40 p-2 dark:bg-zinc-950/90">
                        <div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-1 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                            {cursosSeguros.map((curso, index) => {
                                const isActive = index === cursoSeleccionado;
                                const nombreCurso = curso.division || curso.nombre;

                                return (
                                    <button
                                        key={curso.id ?? index}
                                        type="button"
                                        onClick={() => handleSeleccionCurso(index)}
                                        className={[
                                            'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                                            isActive
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : 'border-border bg-background text-foreground hover:bg-muted dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800',
                                        ].join(' ')}
                                    >
                                        {nombreCurso}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {cursoActual && (
                        <section
                            className={[
                                'space-y-5 transform transition-all duration-300 ease-out',
                                mostrarContenido ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
                            ].join(' ')}
                        >
                            <h2 className="text-lg font-bold text-primary border-b border-border pb-2">
                                Curso: {cursoActual.division || cursoActual.nombre}
                            </h2>

                            <CalendarioSemanal horarios={cursoActual.horarios} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ProximoExamenCard examenes={cursoActual.examenes} />
                                <TrabajoPracticoCard tps={cursoActual.tps} />
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}
