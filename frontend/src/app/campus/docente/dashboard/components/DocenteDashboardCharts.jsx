'use client';

import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
} from '@/components/ui/chart';

// ─── Colores por condición académica ──────────────────────────────────────────
const CONDICION_COLORS = {
    Promocionado: 'var(--chart-2)',
    Regularizado:   'var(--chart-1)',
    Libre:     'var(--chart-5)',
    Cursando:  'var(--chart-3)',
};

const condicionChartConfig = {
    Promocionado: { label: 'Promocionado',  color: 'var(--chart-2)' },
    Regularizado:   { label: 'Regularizado',    color: 'var(--chart-1)' },
    Libre:     { label: 'Libre',      color: 'var(--chart-5)' },
    Cursando:  { label: 'Cursando',   color: 'var(--chart-3)' },
};

const asistenciaChartConfig = {
    asistencia: { label: '% Asistencia',    color: 'var(--chart-1)' },
};

const tpChartConfig = {
    tps: { label: '% TPs Aprobados', color: 'var(--chart-2)' },
};

// ─── Tooltips personalizados ──────────────────────────────────────────────────
function DonutTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    const { name, value } = payload[0];
    return (
        <div className="bg-popover border border-border rounded-lg px-3 py-2 text-xs shadow-xl">
            <span className="font-bold text-popover-foreground">{name}:</span>{' '}
            <span className="tabular-nums font-mono">{value} {value === 1 ? 'alumno' : 'alumnos'}</span>
        </div>
    );
}

function BarTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-popover border border-border rounded-lg px-3 py-2 text-xs shadow-xl max-w-[200px]">
            <p className="font-bold text-popover-foreground mb-1 truncate">{label}</p>
            <p className="text-muted-foreground">
                {payload[0].name}:{' '}
                <span className="font-mono font-bold text-foreground">{payload[0].value}%</span>
            </p>
        </div>
    );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ message }) {
    return (
        <div className="flex-1 flex items-center justify-center py-10 text-muted-foreground text-xs text-center">
            {message}
        </div>
    );
}

// ─── Componente principal ─────────────────────────────────────────────────────
/**
 * @param {{
 *   condicionData: Array<{name: string, value: number}>,
 *   asistenciaData: Array<{materia: string, asistencia: number}>,
 *   tpData: Array<{materia: string, tps: number}>
 * }} props
 */
export function DocenteDashboardCharts({ condicionData, asistenciaData, tpData }) {
    const hasCondicionData = condicionData.some(d => d.value > 0);
    const hasBarData = asistenciaData.length > 0;
    const barHeight = Math.max(200, asistenciaData.length * 54);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

            {/* ── DONUT: Condición académica ───────────────────────────────── */}
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col">
                <h3 className="text-sm font-bold text-foreground mb-0.5">Condición Académica</h3>
                <p className="text-xs text-muted-foreground mb-4">Distribución de todos los alumnos</p>

                {!hasCondicionData ? (
                    <EmptyState message="Sin datos de condición todavía" />
                ) : (
                    <ChartContainer config={condicionChartConfig} className="flex-1 min-h-[200px]">
                        <PieChart>
                            <Pie
                                data={condicionData}
                                cx="50%"
                                cy="50%"
                                innerRadius="52%"
                                outerRadius="78%"
                                paddingAngle={3}
                                dataKey="value"
                                nameKey="name"
                            >
                                {condicionData.map((entry) => (
                                    <Cell
                                        key={entry.name}
                                        fill={CONDICION_COLORS[entry.name] ?? 'var(--chart-3)'}
                                        stroke="transparent"
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<DonutTooltip />} />
                            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                        </PieChart>
                    </ChartContainer>
                )}
            </div>

            {/* ── BAR: Asistencia por materia ──────────────────────────────── */}
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col">
                <h3 className="text-sm font-bold text-foreground mb-0.5">Asistencia Promedio</h3>
                <p className="text-xs text-muted-foreground mb-4">Por materia — promedio del grupo</p>

                {!hasBarData ? (
                    <EmptyState message="Sin datos de asistencia todavía" />
                ) : (
                    <ChartContainer
                        config={asistenciaChartConfig}
                        className="w-full"
                        style={{ height: `${barHeight}px` }}
                    >
                        <BarChart
                            data={asistenciaData}
                            layout="vertical"
                            margin={{ top: 4, right: 44, bottom: 4, left: 0 }}
                        >
                            <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="var(--color-border)" />
                            <XAxis
                                type="number"
                                domain={[0, 100]}
                                tickFormatter={v => `${v}%`}
                                tick={{ fontSize: 10 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                type="category"
                                dataKey="materia"
                                width={108}
                                tick={{ fontSize: 10 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={v => v.length > 14 ? `${v.slice(0, 13)}…` : v}
                            />
                            <Tooltip content={<BarTooltip />} cursor={{ fill: 'var(--color-muted)' }} />
                            <Bar
                                dataKey="asistencia"
                                name="% Asistencia"
                                fill="var(--chart-1)"
                                radius={[0, 6, 6, 0]}
                                maxBarSize={22}
                                label={{ position: 'right', formatter: v => `${v}%`, fontSize: 10, fill: 'var(--color-muted-foreground)', fontWeight: 600 }}
                            />
                        </BarChart>
                    </ChartContainer>
                )}
            </div>

            {/* ── BAR: TPs por materia ─────────────────────────────────────── */}
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col">
                <h3 className="text-sm font-bold text-foreground mb-0.5">TPs Aprobados</h3>
                <p className="text-xs text-muted-foreground mb-4">Por materia — promedio del grupo</p>

                {!hasBarData ? (
                    <EmptyState message="Sin datos de TPs todavía" />
                ) : (
                    <ChartContainer
                        config={tpChartConfig}
                        className="w-full"
                        style={{ height: `${barHeight}px` }}
                    >
                        <BarChart
                            data={tpData}
                            layout="vertical"
                            margin={{ top: 4, right: 44, bottom: 4, left: 0 }}
                        >
                            <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="var(--color-border)" />
                            <XAxis
                                type="number"
                                domain={[0, 100]}
                                tickFormatter={v => `${v}%`}
                                tick={{ fontSize: 10 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                type="category"
                                dataKey="materia"
                                width={108}
                                tick={{ fontSize: 10 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={v => v.length > 14 ? `${v.slice(0, 13)}…` : v}
                            />
                            <Tooltip content={<BarTooltip />} cursor={{ fill: 'var(--color-muted)' }} />
                            <Bar
                                dataKey="tps"
                                name="% TPs Aprobados"
                                fill="var(--chart-2)"
                                radius={[0, 6, 6, 0]}
                                maxBarSize={22}
                                label={{ position: 'right', formatter: v => `${v}%`, fontSize: 10, fill: 'var(--color-muted-foreground)', fontWeight: 600 }}
                            />
                        </BarChart>
                    </ChartContainer>
                )}
            </div>
        </div>
    );
}
