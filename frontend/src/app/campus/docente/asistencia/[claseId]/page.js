'use client';
import { useState, useEffect, use } from 'react';
import { Loader2, Plus, Check, X, Users, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';
import { fetchPlanillaAsistencia, guardarAsistenciaAction, guardarAsistenciaMasivaAction } from '../../../docente/actions';
import { AsistenciaBtn, PctBadge, GroupStats } from './components/AsistenciaComponents';
import { DocBreadcrumb } from '../../components/DocBreadcrumb';



export default function PlanillaAsistencia({ params }) {
    const { claseId } = use(params);   // ruta es asistencia/[claseId], no id
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showNewDate, setShowNewDate] = useState(false);
    const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);

    const loadData = async () => {
        try {
            const result = await fetchPlanillaAsistencia(claseId);
            setData(result);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadData(); }, [claseId]);

    // Toggle individual con guardado optimista
    const toggleAsistencia = async (cursadaId, fecha, valorActual) => {
        const nuevo = valorActual === true ? false : true;
        // Optimista
        setData(prev => ({
            ...prev,
            alumnos: prev.alumnos.map(al =>
                al.id === cursadaId
                    ? { ...al, historial: { ...al.historial, [fecha]: nuevo } }
                    : al
            )
        }));
        try {
            await guardarAsistenciaAction({ cursada_id: cursadaId, fecha, presente: nuevo });
        } catch {
            toast.error('Error al guardar asistencia');
            loadData(); // revert
        }
    };

    // Agregar columna de fecha + guardar ausentes para todos
    const handleAddDate = async () => {
        if (!newDate) return;
        if (data.fechas.includes(newDate)) {
            toast.error('Esa fecha ya existe');
            return;
        }
        setSaving(true);
        try {
            // Guardar asistencia inicial (ausente = false) para todos los alumnos en la nueva fecha
            const asistencias = data.alumnos.map(al => ({
                cursada_id: al.id,
                presente: false
            }));
            await guardarAsistenciaMasivaAction({ fecha: newDate, asistencias });
            setShowNewDate(false);
            toast.success('Nueva fecha agregada');
            await loadData();
        } catch {
            toast.error('Error al agregar la fecha');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-primary" size={32} />
        </div>
    );

    // Stats rápidas del grupo
    const totalFechas = data?.fechas?.length ?? 0;
    const promedioGrupo = data?.alumnos?.length > 0
        ? Math.round(
            data.alumnos.reduce((sum, al) => {
                const presentes = data.fechas.filter(f => al.historial[f] === true).length;
                return sum + (totalFechas > 0 ? (presentes / totalFechas) * 100 : 0);
            }, 0) / data.alumnos.length
        )
        : 0;

    return (
        <>
        <DocBreadcrumb items={[{ label: 'Asistencia', href: '' }]} />
        <div className="flex flex-col h-[calc(100vh-140px)] bg-card rounded-xl border border-border overflow-hidden">

            {/* ── HEADER ── */}
            <div className="p-5 border-b border-border bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-0.5">
                        Asistencia
                    </p>
                    <h1 className="text-xl font-extrabold text-foreground leading-tight">
                        {data?.materia}
                    </h1>
                    {data?.carrera && (
                        <p className="text-xs text-muted-foreground mt-0.5">{data.carrera}</p>
                    )}
                </div>

                {/* Mini-stats */}
                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">Clases</p>
                        <p className="text-lg font-extrabold text-foreground tabular-nums">{totalFechas}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">Prom. grupo</p>
                        <p className={`text-lg font-extrabold tabular-nums ${promedioGrupo >= 80 ? 'text-chart-2' : promedioGrupo >= 60 ? 'text-chart-3' : 'text-destructive'}`}>
                            {promedioGrupo}%
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {showNewDate ? (
                            <div className="flex items-center gap-2 bg-card border border-border rounded-xl p-2 shadow-sm">
                                <input
                                    type="date"
                                    value={newDate}
                                    onChange={e => setNewDate(e.target.value)}
                                    className="text-sm bg-transparent outline-none text-foreground"
                                />
                                <button
                                    onClick={handleAddDate}
                                    disabled={saving}
                                    className="p-1.5 rounded-lg bg-chart-2/15 text-chart-2 hover:bg-chart-2/25 transition"
                                >
                                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} strokeWidth={2.5} />}
                                </button>
                                <button
                                    onClick={() => setShowNewDate(false)}
                                    className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition"
                                >
                                    <X size={14} strokeWidth={2.5} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowNewDate(true)}
                                className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-2 rounded-xl text-xs font-bold hover:bg-primary/90 transition shadow-sm shadow-primary/20"
                            >
                                <Plus size={14} /> Nueva fecha
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ── TABLA ── */}
            <div className="flex-1 overflow-auto">
                {(!data?.alumnos?.length) ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                        <Users size={40} className="opacity-20" />
                        <p className="text-sm">No hay alumnos inscriptos en esta materia</p>
                    </div>
                ) : (
                    <table className="w-full text-sm border-collapse">
                        <thead className="sticky top-0 z-20 bg-muted text-xs uppercase">
                            <tr>
                                <th className="px-4 py-3 text-left sticky left-0 z-30 bg-muted border-r border-border min-w-[180px]">
                                    <div className="flex items-center gap-1">
                                        <Users size={12} className="text-muted-foreground" />
                                        Alumno
                                    </div>
                                </th>
                                {data.fechas.map(fecha => (
                                    <th key={fecha} className="px-2 py-3 text-center min-w-[56px] font-mono text-muted-foreground">
                                        {new Date(fecha + 'T00:00').toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })}
                                    </th>
                                ))}
                                <th className="px-3 py-3 text-center sticky right-0 bg-muted border-l border-border min-w-[56px]">
                                    %
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {data.alumnos.map(alumno => {
                                const presentes = data.fechas.filter(f => alumno.historial[f] === true).length;
                                const pct = totalFechas > 0 ? Math.round((presentes / totalFechas) * 100) : null;
                                const enRiesgo = pct !== null && pct < 60;

                                return (
                                    <tr key={alumno.id} className="hover:bg-muted/40 transition-colors">
                                        <td className="px-4 py-2 sticky left-0 bg-card z-10 border-r border-border">
                                            <div className="flex flex-col">
                                                <span className={`font-semibold text-sm truncate max-w-[160px] ${enRiesgo ? 'text-destructive' : 'text-foreground'}`}>
                                                    {alumno.alumno}
                                                </span>
                                                {enRiesgo && (
                                                    <span className="flex items-center gap-0.5 text-[10px] text-destructive font-medium">
                                                        <TrendingDown size={10} /> riesgo asistencia
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        {data.fechas.map(fecha => (
                                            <td key={fecha} className="p-1 text-center">
                                                <div className="flex justify-center">
                                                    <AsistenciaBtn
                                                        presente={alumno.historial[fecha]}
                                                        onClick={() => toggleAsistencia(alumno.id, fecha, alumno.historial[fecha])}
                                                    />
                                                </div>
                                            </td>
                                        ))}
                                        <td className="px-3 py-2 text-center sticky right-0 bg-card border-l border-border">
                                            <PctBadge pct={pct} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
        </>
    );
}