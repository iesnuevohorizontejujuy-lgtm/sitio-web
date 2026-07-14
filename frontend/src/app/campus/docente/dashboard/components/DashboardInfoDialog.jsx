'use client';
import { useState } from 'react';
import {
    AlertDialog, AlertDialogContent, AlertDialogHeader,
    AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
    AlertDialogCancel
} from '@/components/ui/alert-dialog';
import {
    HelpCircle, ClipboardList, Users, BarChart2,
    GraduationCap, UserCheck, UserX, TrendingUp, CheckSquare
} from 'lucide-react';

// ─── Sección con icono ────────────────────────────────────────────────────────
function InfoSection({ icon: Icon, iconClass, title, children }) {
    return (
        <div className="flex gap-3">
            <div className={`p-1.5 rounded-lg shrink-0 h-fit mt-0.5 ${iconClass}`}>
                <Icon size={14} />
            </div>
            <div>
                <p className="font-semibold text-foreground text-sm">{title}</p>
                <div className="text-muted-foreground text-xs mt-1 space-y-1">{children}</div>
            </div>
        </div>
    );
}

// ─── Badge de condición ───────────────────────────────────────────────────────
function CondBadge({ icon: Icon, label, colorClass }) {
    return (
        <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold border ${colorClass}`}>
            <Icon size={9} /> {label}
        </span>
    );
}

export function DashboardInfoDialog() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                aria-label="¿Cómo interpretar el dashboard?"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-medium border border-border hover:border-primary/40 rounded-lg px-3 py-1.5"
            >
                <HelpCircle size={14} /> ¿Cómo funciona?
            </button>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <BarChart2 size={20} className="text-primary" />
                            Cómo interpretar tu Panel
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-5 text-sm">

                                <p className="text-muted-foreground text-xs">
                                    Los datos se calculan en tiempo real a partir de las planillas de asistencia y notas de cada materia.
                                </p>

                                {/* ── ASISTENCIA ── */}
                                <InfoSection
                                    icon={Users}
                                    iconClass="bg-chart-2/10 text-chart-2"
                                    title="Asistencia"
                                >
                                    <p>Cada vez que marcás presente/ausente en una clase, el sistema recalcula el porcentaje de asistencia del alumno:</p>
                                    <p className="font-mono bg-muted rounded px-2 py-1 text-foreground">
                                        % = Clases presentes ÷ Total clases × 100
                                    </p>
                                    <p>El promedio que aparece en el dashboard es la media de todos los alumnos de esa materia.</p>
                                </InfoSection>

                                {/* ── NOTAS ── */}
                                <InfoSection
                                    icon={ClipboardList}
                                    iconClass="bg-primary/10 text-primary"
                                    title="Notas y condición académica"
                                >
                                    <p>La condición se calcula automáticamente comparando notas y asistencia contra los criterios que configuraste en cada materia:</p>
                                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                                        <CondBadge icon={GraduationCap} label="Promoción" colorClass="bg-chart-2/10 text-chart-2 border-chart-2/20" />
                                        <CondBadge icon={UserCheck} label="Regular" colorClass="bg-primary/10 text-primary border-primary/20" />
                                        <CondBadge icon={UserX} label="Libre" colorClass="bg-destructive/10 text-destructive border-destructive/20" />
                                    </div>
                                    <p className="mt-1.5">
                                        Mientras el alumno sigue cursando, se muestra la <strong>condición proyectada</strong> según el estado actual de notas y asistencia (puede cambiar durante la cursada).
                                    </p>
                                </InfoSection>

                                {/* ── TPs ── */}
                                <InfoSection
                                    icon={CheckSquare}
                                    iconClass="bg-chart-3/10 text-chart-3"
                                    title="Trabajos Prácticos (TPs)"
                                >
                                    <p>El porcentaje de TPs es:</p>
                                    <p className="font-mono bg-muted rounded px-2 py-1 text-foreground">
                                        % = TPs aprobados ÷ Total TPs × 100
                                    </p>
                                    <p>Se marca cada TP como aprobado desde la planilla de notas de la materia.</p>
                                </InfoSection>

                                {/* ── CONTADORES KPI ── */}
                                <InfoSection
                                    icon={TrendingUp}
                                    iconClass="bg-chart-1/10 text-chart-1"
                                    title="Contadores del panel (KPIs)"
                                >
                                    <ul className="space-y-1 list-none">
                                        <li><strong className="text-foreground">Total alumnos:</strong> suma de todos los alumnos inscriptos en tus materias activas.</li>
                                        <li><strong className="text-foreground">Materias activas:</strong> materias con al menos un alumno inscripto.</li>
                                        <li><strong className="text-foreground">En Promoción:</strong> alumnos que ya cumplen los criterios máximos.</li>
                                        <li><strong className="text-foreground">En condición Libre:</strong> alumnos que no alcanzan asistencia o nota mínima.</li>
                                    </ul>
                                </InfoSection>

                                {/* ── GRÁFICOS ── */}
                                <InfoSection
                                    icon={BarChart2}
                                    iconClass="bg-chart-4/10 text-chart-4"
                                    title="Gráficos"
                                >
                                    <ul className="space-y-1">
                                        <li><strong className="text-foreground">Donut:</strong> distribución de condiciones académicas proyectadas en todos tus alumnos.</li>
                                        <li><strong className="text-foreground">Barras de asistencia:</strong> promedio de asistencia por materia.</li>
                                        <li><strong className="text-foreground">Barras de TPs:</strong> promedio de TPs completados por materia.</li>
                                    </ul>
                                </InfoSection>

                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Entendido</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
