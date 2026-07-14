'use client';

import { GraduationCap, BookOpen, TrendingUp, AlertTriangle } from 'lucide-react';

const statConfigs = [
    {
        key: 'totalAlumnos',
        label: 'Alumnos Totales',
        icon: GraduationCap,
        colorClass: 'text-primary',
        bgClass: 'bg-primary/10',
    },
    {
        key: 'totalMaterias',
        label: 'Materias Activas',
        icon: BookOpen,
        colorClass: 'text-chart-2',
        bgClass: 'bg-chart-2/10',
    },
    {
        key: 'enPromocion',
        label: 'En Promoción',
        icon: TrendingUp,
        colorClass: 'text-chart-2',
        bgClass: 'bg-chart-2/10',
    },
    {
        key: 'enLibre',
        label: 'En Condición Libre',
        icon: AlertTriangle,
        colorClass: 'text-chart-5',
        bgClass: 'bg-chart-5/10',
    },
];

/**
 * Trae directamente los datos como props desde el fetch en el frontend
 * @param {{ totalAlumnos: number, totalMaterias: number, enPromocion: number, enLibre: number }} stats
 */
export function KpiCards({ stats }) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {statConfigs.map(({ key, label, icon: Icon, colorClass, bgClass, borderClass }) => (
                <div
                    key={key}
                    className={`bg-card border ${borderClass} rounded-xl p-4 md:p-5 flex items-center gap-3 md:gap-4 hover:shadow-md transition-shadow duration-200`}
                >
                    <div className={`${bgClass} ${colorClass} p-2.5 md:p-3 rounded-xl shrink-0`}>
                        <Icon size={20} strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs text-muted-foreground font-medium leading-tight truncate">
                            {label}
                        </p>
                        <p className={`text-2xl md:text-3xl font-extrabold ${colorClass} leading-none mt-0.5 tabular-nums`}>
                            {stats[key] ?? 0}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
