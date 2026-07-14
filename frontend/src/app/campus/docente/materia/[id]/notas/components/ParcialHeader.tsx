'use client';

import { Pencil, Plus } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { es } from 'date-fns/locale';
import type { ParcialMapped } from '../types/planilla';

interface ParcialHeaderProps {
    parcial: ParcialMapped;
    index: number;
    popoverOpen: boolean;
    onPopoverChange: (val: boolean) => void;
    onCrear: (nombre: string, fecha: Date) => void;
    onActualizar: (id: number, fecha: Date) => void;
    cursoAbierto: boolean;
}

export function ParcialHeader({
    parcial,
    popoverOpen,
    onPopoverChange,
    onCrear,
    onActualizar,
}: ParcialHeaderProps) {
    const fechaDisplay = parcial.fecha
        ? parcial.fecha.substring(0, 10).split('-').slice(1).reverse().join('/')
        : '';

    const fechaSeleccionada = parcial.fecha
        ? new Date(parcial.fecha.substring(0, 10) + 'T00:00:00')
        : undefined;

    return (
        <div className="mt-0.5 flex justify-center">
            {parcial.existe ? (
                <Popover open={popoverOpen} onOpenChange={onPopoverChange}>
                    <PopoverTrigger asChild>
                        <button className="flex items-center gap-0.5 text-[9px] text-primary-foreground/70 hover:text-primary-foreground font-mono normal-case transition-colors">
                            {fechaDisplay}
                            <Pencil className="w-2 h-2" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
                        <Calendar
                            mode="single"
                            locale={es}
                            selected={fechaSeleccionada}
                            onSelect={(date) => {
                                if (date && parcial.id != null) {
                                    onPopoverChange(false);
                                    onActualizar(parcial.id, date);
                                }
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            ) : (
                <Popover open={popoverOpen} onOpenChange={onPopoverChange}>
                    <PopoverTrigger asChild>
                        <button className="flex items-center gap-0.5 text-[9px] normal-case text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors">
                            <Plus className="w-2 h-2" /> Habilitar
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
                        <Calendar
                            mode="single"
                            locale={es}
                            onSelect={(date) => {
                                if (date) {
                                    onPopoverChange(false);
                                    onCrear(parcial.backendName, date);
                                }
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            )}
        </div>
    );
}
