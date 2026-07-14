'use client';

import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { inscribirseAction } from '@/app/campus/dashboard/actions';
import { Button } from '@/components/ui/button';
import { MateriaCard } from './MateriaCard';
import { CarreraFilter } from './CarreraFilter';

/**
 * Client Component delgado para manejar la interactividad de inscripción.
 * Las materias llegan como props desde el Server Component padre.
 */
export function MateriasClient({ materias: rawMaterias, carreras = [], selectedCarreraId = null }) {
    const materias = Array.isArray(rawMaterias) ? rawMaterias : [];
    const [processing, setProcessing] = useState(null);
    const [search, setSearch] = useState('');

    const normalizedSearch = useMemo(() => {
        return search
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .trim();
    }, [search]);

    const materiasFiltradas = useMemo(() => {
        if (!normalizedSearch) {
            return materias;
        }

        return materias.filter((materia) => {
            const nombre = (materia?.nombre ?? '')
                .toLowerCase()
                .normalize('NFD')
                .replace(/\p{Diacritic}/gu, '');
            const codigo = String(materia?.codigo ?? '')
                .toLowerCase()
                .normalize('NFD')
                .replace(/\p{Diacritic}/gu, '');

            return nombre.includes(normalizedSearch) || codigo.includes(normalizedSearch);
        });
    }, [materias, normalizedSearch]);

    const handleInscribirse = async (materiaId, estado) => {
        setProcessing(materiaId);
        try {
            const result = await inscribirseAction(materiaId, estado);
            if (result.success) {
                toast.success('¡Inscripción exitosa!');
            } else {
                toast.error(result.error || 'Error al inscribirse. Intenta nuevamente.');
            }
        } catch {
            toast.error('Error al inscribirse. Intenta nuevamente.');
        } finally {
            setProcessing(null);
        }
    };

    return (
        <div>
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end">
                <div className="w-full md:w-[700px]">
                    <label htmlFor="buscar-materia" className="block text-sm font-semibold text-foreground mb-2">
                    
                    </label>
                    <div className="relative w-full">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            id="buscar-materia"
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Buscar Materia"
                            className="w-full rounded-lg border border-border bg-background pl-9 pr-10 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                        />
                        {search && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setSearch('')}
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                aria-label="Limpiar busqueda"
                            >
                                <X size={14} />
                            </Button>
                        )}
                    </div>
                </div>

                <CarreraFilter
                    carreras={carreras}
                    selectedCarreraId={selectedCarreraId}
                    className="w-full md:w-[320px]"
                />
            </div>

            {materiasFiltradas.length === 0 ? (
                <div className="text-center py-10 bg-card rounded-xl border border-border shadow-sm">
                    <p className="text-sm text-muted-foreground">
                        {search 
                            ? `No se encontró la materia:  "${search}".`
                            : 'Sin materias pendientes por inscribir.'
                        }
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {materiasFiltradas.map((materia) => (
                        <MateriaCard
                            key={materia.id}
                            materia={materia}
                            processingId={processing}
                            onInscribirse={handleInscribirse}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
