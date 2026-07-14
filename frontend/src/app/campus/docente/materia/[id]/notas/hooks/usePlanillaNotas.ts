'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
    fetchPlanillaNotas,
    crearParcialAction,
    actualizarParcialAction,
    guardarNotaParcialAction,
    cerrarNotasAction,
} from '../../../../actions';
import type { PlanillaData } from '../types/planilla';

type NotasLocales = Record<number, { parciales: Record<string, string>; notaFinal: string }>;

export function usePlanillaNotas(claseId: string, searchQuery?: string) {
    const [data, setData] = useState<PlanillaData | null>(null);
    const [loading, setLoading] = useState(true);
    const [notasLocales, setNotasLocales] = useState<NotasLocales>({});
    const [dirtySet, setDirtySet] = useState<Set<number>>(new Set());
    const [saving, setSaving] = useState(false);
    const [showCerrarNotas, setShowCerrarNotas] = useState(false);

    // ── Inicializar notas locales desde la API ──
    const initNotasLocales = (apiData: PlanillaData) => {
        const inicial: NotasLocales = {};
        apiData.alumnos.forEach(al => {
            inicial[al.id] = {
                parciales: Object.fromEntries(
                    Object.entries(al.notas_parciales || {}).map(([k, v]) => [k, v != null ? String(v) : ''])
                ),
                notaFinal: al.nota_final != null ? String(al.nota_final) : '',
            };
        });
        setNotasLocales(inicial);
        setDirtySet(new Set());
    };

    // ── Fetch principal ──
    const fetchData = async () => {
        try {
            const result = await fetchPlanillaNotas(claseId, searchQuery);
            setData(result);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (claseId) fetchData(); }, [claseId, searchQuery]);
    useEffect(() => { if (data?.alumnos) initNotasLocales(data); }, [data]);

    // ── Handlers de notas ──
    const handleChangeParcial = (cursadaId: number, parcId: number, val: string) => {
        if (val !== '') {
            const num = parseFloat(val);
            if (isNaN(num) || num < 1 || num > 10) {
                toast.error('La nota debe estar entre 1 y 10');
                return;
            }
        }
        setNotasLocales(prev => ({
            ...prev,
            [cursadaId]: {
                ...prev[cursadaId],
                parciales: { ...(prev[cursadaId]?.parciales || {}), [parcId]: val }
            }
        }));
        setDirtySet(prev => { const next = new Set(prev); next.add(cursadaId); return next; });
    };

    // ── Guardar por lotes ──
    const handleGuardar = async () => {
        if (dirtySet.size === 0) { toast.info('No hay cambios pendientes para guardar'); return; }
        setSaving(true);
        try {
            const promises: Promise<unknown>[] = [];
            for (const cursadaId of dirtySet) {
                const local = notasLocales[cursadaId];
                if (!local) continue;
                Object.entries(local.parciales || {}).forEach(([parcialId, valor]) => {
                    if (valor !== '' && valor != null) {
                        promises.push(guardarNotaParcialAction({
                            cursada_id: Number(cursadaId),
                            parcial_id: Number(parcialId),
                            valor
                        }));
                    }
                });

            }
            await Promise.all(promises);
            toast.success('Notas guardadas correctamente');
            setDirtySet(new Set());
            await fetchData();
        } catch {
            toast.error('Error al guardar las notas');
        } finally {
            setSaving(false);
        }
    };

    // ── Cerrar cursada ──
    const handleCerrarNotas = async () => {
        setShowCerrarNotas(false);
        try {
            setLoading(true);
            await cerrarNotasAction({ clase_id: claseId });
            toast.success('Cursada cerrada correctamente');
            fetchData();
        } catch {
            setLoading(false);
            toast.error('Error al cerrar notas');
        }
    };

    // ── Crear parcial ──
    const handleCrearParcialFijo = async (nombre: string, fecha: Date) => {
        try {
            const fechaStr = format(fecha, 'yyyy-MM-dd');
            await crearParcialAction({ clase_id: claseId, nombre, fecha: fechaStr });
            toast.success(`${nombre} habilitado correctamente`);
            fetchData();
        } catch {
            toast.error(`Error al habilitar ${nombre}`);
        }
    };

    // ── Actualizar fecha de parcial ──
    const handleActualizarFechaParcial = async (parcialId: number, nuevaFecha: Date) => {
        try {
            const fechaStr = format(nuevaFecha, 'yyyy-MM-dd');
            await actualizarParcialAction({ parcial_id: parcialId, fecha: fechaStr });
            toast.success('Fecha del parcial actualizada');
            fetchData();
        } catch {
            toast.error('Error al actualizar la fecha del parcial');
        }
    };

    return {
        data,
        loading,
        notasLocales,
        dirtySet,
        saving,
        showCerrarNotas,
        setShowCerrarNotas,
        handleChangeParcial,
        handleGuardar,
        handleCerrarNotas,
        handleCrearParcialFijo,
        handleActualizarFechaParcial,
        fetchData,
    };
}
