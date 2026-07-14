'use client';

import { useState } from 'react';
import { BookOpen, Clock, FileText } from 'lucide-react';
import Link from 'next/link';
import { CursoActualmenteCard } from './CursoActualmenteCard';
import { HistorialTable } from './HistorialTable';

export function SituacionAcademicaTabs({ enCurso = [], finalizadas = [] }) {
    const [activeTab, setActiveTab] = useState('cursando');

    const pendientesFinal = finalizadas.filter(
        (m) => (m.condicion ?? m.estado) === 'Regularizado' || (m.condicion ?? m.estado) === 'Libre'
    );

    return (
        <div className="space-y-5">
            {pendientesFinal.length > 0 && (
                <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300">
                    <FileText className="h-5 w-5 shrink-0" />
                    <span>
                        Tenés <strong>{pendientesFinal.length}</strong> materia{pendientesFinal.length > 1 ? 's' : ''} pendiente{pendientesFinal.length > 1 ? 's' : ''} de examen final.
                    </span>
                    <Link
                        href="/campus/mesas"
                        className="ml-auto whitespace-nowrap rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white hover:bg-blue-700 transition"
                    >
                        Ver Mesas
                    </Link>
                </div>
            )}
            <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
                <button
                    type="button"
                    onClick={() => setActiveTab('cursando')}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition ${
                        activeTab === 'cursando'
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-background text-muted-foreground hover:text-foreground'
                    }`}
                >
                    <Clock className="h-4 w-4" />
                    Cursando Actualmente
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('historial')}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition ${
                        activeTab === 'historial'
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-background text-muted-foreground hover:text-foreground'
                    }`}
                >
                    <BookOpen className="h-4 w-4" />
                    Historial Académico
                </button>
            </div>

            {activeTab === 'cursando' ? (
                <section>
                    {enCurso.length > 0 ? (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {enCurso.map((m) => (
                                <CursoActualmenteCard key={m.id} materia={m} />
                            ))}
                        </div>
                    ) : (
                        <p className="rounded-lg border border-border bg-muted p-6 text-center italic text-muted-foreground">
                            No estás cursando materias activamente en este momento.
                        </p>
                    )}
                </section>
            ) : (
                <section>
                    {finalizadas.length > 0 ? (
                        <HistorialTable finalizadas={finalizadas} />
                    ) : (
                        <p className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground shadow-sm">
                            Aún no has finalizado ninguna materia.
                        </p>
                    )}
                </section>
            )}
        </div>
    );
}
