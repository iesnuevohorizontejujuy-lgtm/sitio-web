'use client';

import { ArrowLeft, BookOpen, GraduationCap, TrendingUp, User, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { NotasInfoDialog } from './NotasInfoDialog';
import type { PlanillaData, AlumnoData } from '../types/planilla';

interface PlanillaHeaderProps {
    data: PlanillaData;
}

function getCondicion(al: AlumnoData): string | null {
    return al.estado_actual === 'cursando' ? al.condicion_proyectada : al.estado_actual;
}

export function PlanillaHeader({ data }: PlanillaHeaderProps) {
    const router = useRouter();
    const alumnos = data.alumnos;

    // Resumen de cursada
    const condiciones = alumnos.map(a => getCondicion(a)?.toLowerCase());
    const count = (estado: string) => condiciones.filter(c => c === estado).length;

    const promocionados = count('promocionado');
    const regulares = count('regularizado');
    const libres = count('libre');
    const total = alumnos.length;

    const porcPromocionados = total > 0 ? (promocionados / total) * 100 : 0;
    const porcRegulares = total > 0 ? (regulares / total) * 100 : 0;
    const porcLibres = total > 0 ? (libres / total) * 100 : 0;

    // Asistencia Promedio
    const asistencias = alumnos.map(a => a.stats?.asistencia || 0);
    const sumaAsistencias = asistencias.reduce((acc, curr) => acc + curr, 0);
    const asistPromedio = total > 0 ? Math.round(sumaAsistencias / total) : 0;

    return (
        <div className="p-6 space-y-6 shrink-0">
            {/* Topbar: Title & Info */}
            <section className="flex flex-col md:flex-row gap-6 justify-between items-start">
                <div className="space-y-1">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2 font-medium"
                    >
                        <ArrowLeft size={16} /> Volver
                    </button>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">Planilla de Notas</h2>
                    <p className="text-muted-foreground text-sm flex items-center gap-2">
                        Ciclo Lectivo · {data.anio}
                    </p>
                </div>
                <div className="flex gap-3 items-end">
                    <NotasInfoDialog />
                </div>
            </section>

            {/* Metadata Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Carrera */}
                <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground dark:bg-teal-900/30 dark:text-teal-400 flex items-center justify-center shrink-0">
                        <GraduationCap size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Carrera</p>
                        <p className="font-semibold text-foreground text-sm leading-tight">{data.carrera}</p>
                    </div>
                </div>
                {/* Materia / Curso */}
                <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-primary dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <BookOpen size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Espacio Curricular</p>
                        <p className="font-semibold text-foreground text-xs leading-tight">{data.materia} <br/><span className="text-primary font-normal">{data.curso_nombre} ({data.turno})</span></p>
                    </div>
                </div>
                {/* Docente */}
                <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 text-primary dark:bg-indigo-900/30 dark:text-indigo-400 flex items-center justify-center shrink-0">
                        <User size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Docente</p>
                        <p className="font-semibold text-foreground text-sm uppercase">{data.profesor}</p>
                    </div>
                </div>
                {/* Inscriptos */}
                <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 text-primary dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center shrink-0">
                        <Users size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Inscriptos</p>
                        <p className="font-semibold text-foreground text-sm">{total} Alumnos</p>
                    </div>
                </div>
            </div>

            {/* Stats Summary Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/30 p-2 rounded-2xl">
                {/* Promocionados */}
                <div className="bg-card rounded-xl p-4 flex items-center justify-between shadow-sm border border-border/50">
                    <div>
                        <span className="text-xs text-muted-foreground font-medium">Promocionados</span>
                        <h4 className="text-xl font-extrabold text-teal-600 dark:text-teal-400">{promocionados}</h4>
                    </div>
                    <div className="w-10 h-1.5 flex bg-muted rounded-full overflow-hidden">
                        <div className="bg-teal-500 h-full transition-all" style={{ width: `${porcPromocionados}%` }}></div>
                    </div>
                </div>
                {/* Regulares */}
                <div className="bg-card rounded-xl p-4 flex items-center justify-between shadow-sm border border-border/50">
                    <div>
                        <span className="text-xs text-muted-foreground font-medium">Regulares</span>
                        <h4 className="text-xl font-extrabold text-primary">{regulares}</h4>
                    </div>
                    <div className="w-10 h-1.5 flex bg-muted rounded-full overflow-hidden">
                        <div className="bg-primary h-full transition-all" style={{ width: `${porcRegulares}%` }}></div>
                    </div>
                </div>
                {/* Libres */}
                <div className="bg-card rounded-xl p-4 flex items-center justify-between shadow-sm border border-border/50">
                    <div>
                        <span className="text-xs text-muted-foreground font-medium">Libres/Abandono</span>
                        <h4 className="text-xl font-extrabold text-destructive">{libres}</h4>
                    </div>
                    <div className="w-10 h-1.5 flex bg-muted rounded-full overflow-hidden">
                        <div className="bg-destructive h-full transition-all" style={{ width: `${porcLibres}%` }}></div>
                    </div>
                </div>
                {/* Asistencia */}
               
            </div>
        </div>
    );
}
