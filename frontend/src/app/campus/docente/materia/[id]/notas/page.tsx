'use client';

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { usePlanillaNotas } from './hooks/usePlanillaNotas';
import { PlanillaHeader } from './components/PlanillaHeader';
import { PlanillaFooter } from './components/PlanillaFooter';
import { NotasTable } from './components/NotasTable';

export default function PlanillaEvaluacion({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [searchInputValue, setSearchInputValue] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchInputValue);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInputValue]);

    const planilla = usePlanillaNotas(id, debouncedSearchQuery);
    const {
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
    } = planilla;

    // ── Guard: cargando ──
    if (loading) return <Loader2 className="animate-spin mx-auto mt-20" />;

    // ── Guard: error ──
    if (!data || (data as unknown as { error?: string }).error || !data.alumnos) {
        return (
            <div className="bg-background min-h-[calc(100vh-100px)] p-6 md:p-8 flex flex-col items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="text-xl font-bold text-foreground">Error al cargar la planilla</h2>
                    <p className="text-muted-foreground">La clase solicitada no existe o no tienes permisos.</p>
                    <button
                        onClick={() => router.back()}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                    >
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    const cursoAbierto = data.alumnos.length > 0
        ? data.alumnos.some(a => ['cursando', 'regularizado', 'promocionado', 'libre'].includes(a.estado_actual))
        : true;

    return (
        <div className="flex flex-col flex-1 min-h-[calc(100vh-120px)]">
            <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col flex-1 overflow-hidden">

                {/* ── Header ── */}
                <PlanillaHeader
                    data={data}
                />

                {/* ── Tabla ── */}
                <NotasTable
                    data={data}
                    cursoAbierto={!data.alumnos.every(a => a.estado_actual !== 'cursando')}
                    notasLocales={notasLocales}
                    searchValue={searchInputValue}
                    onSearchChange={setSearchInputValue}
                    onChangeParcial={handleChangeParcial}
                    handleCrearParcialFijo={handleCrearParcialFijo}
                    handleActualizarFechaParcial={handleActualizarFechaParcial}
                />

                {/* ── Footer ── */}
                <PlanillaFooter 
                    saving={saving}
                    dirtyCount={dirtySet.size}
                    showCerrarNotas={cursoAbierto}
                    onGuardar={handleGuardar}
                    onCerrarNotas={() => setShowCerrarNotas(true)}
                />

                {/* ── Dialog: Cerrar cursada ── */}
                <AlertDialog open={showCerrarNotas} onOpenChange={setShowCerrarNotas}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Cerrar la cursada?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción calculará la condición final de cada alumno y bloqueará la edición de notas.
                                <strong className="block mt-2 text-destructive">Esta acción no se puede deshacer.</strong>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleCerrarNotas}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Cerrar Cursada
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
        </div>
    );
}
