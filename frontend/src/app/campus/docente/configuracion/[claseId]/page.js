'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, Settings, Info, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { fetchCursoDocente, guardarCriteriosAction } from '../../actions';
import { SliderField, CondicionPreview } from './components/ConfigComponents';
import { DocBreadcrumb } from '../../components/DocBreadcrumb';

export default function ConfigurarCurso({ params }) {
    const { claseId } = use(params);
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [curso, setCurso] = useState(null);

    const [form, setForm] = useState({
        porcentaje_promocion: 80,
        porcentaje_regular: 60,
        nota_promocion: 7,
        nota_regularidad: 6,
    });

    // Para la preview interactiva
    const [preview, setPreview] = useState({ asistencia: 75, nota: 7 });

    const pf = v => v;
    const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

    const notaError = Number(form.nota_regularidad) > Number(form.nota_promocion);
    const asistError = Number(form.porcentaje_regular) > Number(form.porcentaje_promocion);

    useEffect(() => {
        fetchCursoDocente(claseId)
            .then(data => {
                setCurso(data);
                if (data.criterios) {
                    setForm({
                        porcentaje_promocion: data.criterios.porcentaje_asistencia_promocion,
                        porcentaje_regular: data.criterios.porcentaje_asistencia_regular,
                        nota_promocion: data.criterios.nota_promocion,
                        nota_regularidad: data.criterios.nota_regularidad || 6,
                    });
                }
            })
            .catch(() => toast.error('Error al cargar la información del curso'))
            .finally(() => setLoading(false));
    }, [claseId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (notaError) { toast.error('La nota de regularidad no puede superar la de promoción'); return; }
        if (asistError) { toast.error('El % para regularizar no puede superar el de promoción'); return; }
        setGuardando(true);
        try {
            await guardarCriteriosAction({
                clase_id: claseId,
                porcentaje_promocion: form.porcentaje_promocion,
                porcentaje_regular: form.porcentaje_regular,
                nota_promocion: form.nota_promocion,
                nota_regularidad: form.nota_regularidad,
            });
            toast.success('Configuración guardada');
            router.push('/campus/docente/dashboard');
        } catch {
            toast.error('Error al guardar los cambios');
        } finally {
            setGuardando(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-primary w-10 h-10" />
        </div>
    );

    return (
        <div className="max-w-2xl">
            <DocBreadcrumb items={[{ label: 'Configuración de Criterios' }]} />

            <div className="bg-card rounded-xl border border-border overflow-hidden">

                {/* Header */}
                <div className="p-5 border-b border-border bg-muted/30">
                    <h1 className="text-lg font-extrabold text-foreground flex items-center gap-2">
                        <Settings className="text-primary" size={20} />
                        Criterios de Evaluación
                    </h1>
                    <p className="text-muted-foreground text-sm mt-0.5">
                        {curso?.materia?.nombre}
                        {curso?.curso?.nombre && <span className="text-muted-foreground/60"> · {curso.curso.nombre}</span>}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">

                    {/* Info */}
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm flex gap-3 items-start">
                        <Info className="shrink-0 mt-0.5 text-primary" size={16} />
                        <div className="text-muted-foreground space-y-1">
                            <p className="font-bold text-foreground">¿Cómo funciona?</p>
                            <p className="text-xs">Libre si no alcanza asistencia o nota mínima · Regular si aprueba cursada · Promoción si cumple todos los máximos</p>
                        </div>
                    </div>

                    {/* Asistencia */}
                    <div className="space-y-5">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border pb-2">
                            Asistencia
                        </h3>
                        {asistError && (
                            <p className="text-xs text-destructive flex items-center gap-1 font-medium">
                                <AlertTriangle size={12} /> El % de regularidad no puede ser mayor al de promoción
                            </p>
                        )}
                        <SliderField
                            label="% mínimo para Regularizar"
                            hint="Debajo de esto → Libre"
                            value={form.porcentaje_regular}
                            min={0} max={100}
                            unit="%"
                            onChange={set('porcentaje_regular')}
                        />
                        <SliderField
                            label="% mínimo para Promoción"
                            value={form.porcentaje_promocion}
                            min={0} max={100}
                            unit="%"
                            onChange={set('porcentaje_promocion')}
                        />
                    </div>

                    {/* Notas */}
                    <div className="space-y-5">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border pb-2">
                            Calificaciones
                        </h3>
                        {notaError && (
                            <p className="text-xs text-destructive flex items-center gap-1 font-medium">
                                <AlertTriangle size={12} /> La nota de regularidad no puede superar la de promoción
                            </p>
                        )}
                        <SliderField
                            label="Nota mínima para Regularizar"
                            hint="Debajo de esto (con asistencia ok) → Libre"
                            value={form.nota_regularidad}
                            min={1} max={10} step={0.5}
                            unit=" pts"
                            onChange={set('nota_regularidad')}
                        />
                        <SliderField
                            label="Nota para Promoción directa"
                            hint="Con esta nota y asistencia → no rinde final"
                            value={form.nota_promocion}
                            min={1} max={10} step={0.5}
                            unit=" pts"
                            onChange={set('nota_promocion')}
                        />
                    </div>

                    {/* Preview interactiva */}
                    <div className="bg-muted/50 border border-border rounded-xl p-5">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                            Vista previa — simulá un alumno
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <SliderField
                                label="Asistencia del alumno"
                                value={preview.asistencia}
                                min={0} max={100}
                                unit="%"
                                onChange={v => setPreview(p => ({ ...p, asistencia: v }))}
                            />
                            <SliderField
                                label="Nota promedio"
                                value={preview.nota}
                                min={1} max={10} step={0.5}
                                unit=" pts"
                                onChange={v => setPreview(p => ({ ...p, nota: v }))}
                            />
                        </div>
                        <CondicionPreview asistencia={preview.asistencia} nota={preview.nota} form={form} />
                    </div>

                    {/* Guardar */}
                    <div className="pt-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={guardando || notaError || asistError}
                            className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-bold py-2.5 px-7 rounded-xl shadow-sm shadow-primary/20 flex items-center gap-2 transition active:scale-95"
                        >
                            {guardando ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Guardar Configuración
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}