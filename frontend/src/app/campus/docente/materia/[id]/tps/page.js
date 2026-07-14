'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Loader2, ListChecks, Plus, ArrowLeft, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    fetchTpsAction,
    crearTpAction,
    eliminarTpAction,
    renombrarTpAction,
    toggleTpAction,
} from '../../../actions';
import { CabeceraTps }      from './components/CabeceraTps';
import { TablaGeneralTps }  from './components/TablaGeneralTps';
import { DialogCrearTp }    from './components/DialogCrearTp';
import { DialogRenombrarTp } from './components/DialogRenombrarTp';
import { DialogEliminarTp } from './components/DialogEliminarTp';

export default function TpsPage({ params }) {
    const { id } = use(params);

    const [tps, setTps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [claseCerrada, setClaseCerrada] = useState(false);

    // — Filas expandidas (set de ids de TP)
    const [expandidos, setExpandidos] = useState(new Set());
    // — Celdas con toggle en curso { `${tpId}-${cursadaId}`: bool }
    const [toggling, setToggling] = useState({});

    // — Estado del Dialog Crear
    const [showCrear, setShowCrear] = useState(false);
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [creando, setCreando] = useState(false);

    // — Estado del Dialog Renombrar
    const [tpEditando, setTpEditando] = useState(null);
    const [nombreEdit, setNombreEdit] = useState('');
    const [guardando, setGuardando] = useState(false);

    // — Estado del Dialog Eliminar
    const [tpAEliminar, setTpAEliminar] = useState(null);
    const [eliminando, setEliminando] = useState(false);

    // — Buscador
    const [searchInputValue, setSearchInputValue] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchInputValue);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInputValue]);

    // ── Carga de datos ──────────────────────────────────────────────────────
    const cargar = async () => {
        setLoading(true);
        try {
            const data = await fetchTpsAction(id, debouncedSearchQuery);
            setTps(data.tps ?? []);
            setClaseCerrada(data.clase_cerrada ?? false);
        } catch {
            toast.error('Error al cargar los trabajos prácticos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { cargar(); }, [id, debouncedSearchQuery]);

    // ── Handlers ────────────────────────────────────────────────────────────
    const toggleExpandido = (tpId) => {
        setExpandidos(prev => {
            const next = new Set(prev);
            next.has(tpId) ? next.delete(tpId) : next.add(tpId);
            return next;
        });
    };

    const handleToggleAlumno = async (tpId, cursadaId) => {
        const key = `${tpId}-${cursadaId}`;
        if (toggling[key]) return;
        setToggling(prev => ({ ...prev, [key]: true }));
        try {
            await toggleTpAction({ cursada_id: cursadaId, trabajo_practico_id: tpId });
            // Actualización optimista
            setTps(prev => prev.map(tp => {
                if (tp.id !== tpId) return tp;
                const alumnos = tp.alumnos.map(al =>
                    al.cursada_id === cursadaId ? { ...al, aprobado: !al.aprobado } : al
                );
                return { ...tp, alumnos, entregados: alumnos.filter(a => a.aprobado).length };
            }));
        } catch {
            toast.error('Error al actualizar el TP');
        } finally {
            setToggling(prev => { const n = { ...prev }; delete n[key]; return n; });
        }
    };

    const handleCrear = async () => {
        if (!nuevoNombre.trim()) { toast.error('Ingresá el nombre del TP'); return; }
        setCreando(true);
        try {
            await crearTpAction({ clase_id: id, nombre: nuevoNombre.trim() });
            toast.success('TP creado correctamente');
            setNuevoNombre('');
            setShowCrear(false);
            cargar();
        } catch {
            toast.error('Error al crear el TP');
        } finally {
            setCreando(false);
        }
    };

    const handleRenombrar = async () => {
        if (!nombreEdit.trim()) { toast.error('El nombre no puede estar vacío'); return; }
        setGuardando(true);
        try {
            await renombrarTpAction(tpEditando.id, nombreEdit.trim());
            toast.success('TP renombrado');
            setTpEditando(null);
            cargar();
        } catch {
            toast.error('Error al renombrar el TP');
        } finally {
            setGuardando(false);
        }
    };

    const handleEliminar = async () => {
        setEliminando(true);
        try {
            await eliminarTpAction(tpAEliminar.id);
            toast.success('TP eliminado');
            setTpAEliminar(null);
            cargar();
        } catch (e) {
            toast.error(e.message ?? 'Error al eliminar el TP');
            setTpAEliminar(null);
        } finally {
            setEliminando(false);
        }
    };

    // ── Render ──────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col gap-4 h-[calc(100vh-100px)]">
            <Link
                href={`/campus/docente/materia/${id}/notas`}
                className="flex items-center gap-2 w-fit px-4 py-2 bg-background border border-border hover:bg-accent hover:text-accent-foreground text-muted-foreground rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
                <ArrowLeft size={16} /> Volver
            </Link>

            <div className="flex-1 flex flex-col bg-card rounded-xl shadow border border-border overflow-hidden min-h-0">
                <CabeceraTps
                claseId={id}
                claseCerrada={claseCerrada}
                onNuevoTp={() => { setNuevoNombre(''); setShowCrear(true); }}
            />

            {/* Toolbar Búsqueda */}
            <div className="px-5 py-3 border-b border-border/50 bg-muted/10 flex items-center justify-between shrink-0">
                <div className="relative w-full md:max-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar alumno por nombre o DNI..."
                        value={searchInputValue}
                        onChange={(e) => setSearchInputValue(e.target.value)}
                        className="h-9 pl-9 pr-4 w-full rounded-md border border-input bg-background/50 hover:bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center p-10">
                    <Loader2 className="animate-spin text-primary" size={32} />
                </div>
            ) : tps.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-10 text-muted-foreground">
                    <ListChecks size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No hay trabajos prácticos cargados para esta clase.</p>
                    {!claseCerrada && (
                        <Button variant="outline" size="sm" className="mt-4"
                            onClick={() => { setNuevoNombre(''); setShowCrear(true); }}>
                            <Plus size={14} className="mr-1" /> Agregar el primero
                        </Button>
                    )}
                </div>
            ) : (
                <TablaGeneralTps
                    tps={tps}
                    claseCerrada={claseCerrada}
                    toggling={toggling}
                    onToggleAlumno={handleToggleAlumno}
                    onRenombrar={(tp) => { setTpEditando(tp); setNombreEdit(tp.nombre); }}
                    onEliminar={(tp) => setTpAEliminar(tp)}
                />
            )}

            <DialogCrearTp
                open={showCrear}
                onOpenChange={v => { setShowCrear(v); if (!v) setNuevoNombre(''); }}
                nombre={nuevoNombre}
                onNombreChange={setNuevoNombre}
                onConfirmar={handleCrear}
                creando={creando}
            />

            <DialogRenombrarTp
                tp={tpEditando}
                nombre={nombreEdit}
                onNombreChange={setNombreEdit}
                onConfirmar={handleRenombrar}
                onCancelar={() => setTpEditando(null)}
                guardando={guardando}
            />

            <DialogEliminarTp
                tp={tpAEliminar}
                onConfirmar={handleEliminar}
                onCancelar={() => setTpAEliminar(null)}
                eliminando={eliminando}
            />
            </div>
        </div>
    );
}
