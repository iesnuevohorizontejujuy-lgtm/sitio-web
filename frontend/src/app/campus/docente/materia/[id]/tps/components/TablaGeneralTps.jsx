import React from 'react';
import { Check, X, Loader2, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function TablaGeneralTps({
    tps,
    claseCerrada,
    toggling,
    onToggleAlumno,
    onRenombrar,
    onEliminar,
}) {
    if (!tps || tps.length === 0) return null;

    // Aggregate unique alumnos from all TPs
    const alumnosMap = new Map();
    tps.forEach(tp => {
        tp.alumnos?.forEach(al => {
            if(!alumnosMap.has(al.cursada_id)) {
                alumnosMap.set(al.cursada_id, {
                    cursada_id: al.cursada_id,
                    nombre_completo: al.nombre_completo || al.nombre,
                    tpsState: {}
                });
            }
            alumnosMap.get(al.cursada_id).tpsState[tp.id] = al.aprobado;
        });
    });

    const alumnosList = Array.from(alumnosMap.values()).sort((a,b) => a.nombre_completo.localeCompare(b.nombre_completo));

    // Calculate Promedio per student:
    alumnosList.forEach(al => {
        let aprobados = 0;
        let evaluados = tps.length;
        tps.forEach(tp => {
            if(al.tpsState[tp.id]) aprobados++;
        });
        al.promedio = evaluados > 0 && aprobados === evaluados; 
    });

    return (
        <div className="flex-1 overflow-auto relative">
            <table className="w-full text-sm text-left border-collapse">
                <thead className="text-xs text-foreground uppercase bg-muted sticky top-0 z-20 shadow-sm">
                    <tr>
                        <th className="px-4 py-3 font-bold sticky left-0 z-30 bg-muted border-r border-border shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[200px]">
                            Alumno
                        </th>
                        {tps.map((tp, i) => (
                            <th key={tp.id} className="px-2 py-3 text-center min-w-[140px] border-r border-border">
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center justify-center gap-1.5 pb-1">
                                        <span className="font-bold text-sm leading-none">TP #{i + 1}</span>
                                        {!claseCerrada && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full text-muted-foreground hover:bg-muted-foreground/20 hover:text-foreground">
                                                        <MoreVertical size={13} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => onRenombrar(tp)}>
                                                        <Pencil className="mr-2 h-4 w-4" /> Renombrar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => onEliminar(tp)} className="text-destructive focus:bg-destructive focus:text-destructive-foreground">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground truncate max-w-[130px] block" title={tp.nombre}>{tp.nombre}</span>
                                </div>
                            </th>
                        ))}
                        <th className="px-2 py-3 text-center min-w-[100px] border-l border-border bg-muted">
                            Promedio
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {alumnosList.map(al => (
                        <tr key={al.cursada_id} className="hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-2 font-medium text-foreground sticky left-0 bg-card z-10 border-r border-border shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                <span className="truncate max-w-[180px] block">{al.nombre_completo}</span>
                            </td>
                            {tps.map(tp => {
                                const valor = al.tpsState[tp.id];
                                const key = `${tp.id}-${al.cursada_id}`;
                                const cargando = !!toggling[key];
                                return (
                                    <td key={tp.id} className="p-1 text-center border-r border-muted">
                                        {cargando ? (
                                            <div className="w-10 h-10 flex items-center justify-center mx-auto">
                                                <Loader2 size={18} className="animate-spin text-muted-foreground" />
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => !claseCerrada && onToggleAlumno(tp.id, al.cursada_id)}
                                                disabled={claseCerrada}
                                                className={`
                                                    w-10 h-10 rounded-full flex items-center justify-center transition-all mx-auto
                                                    ${valor === true ? 'bg-chart-2 text-white shadow-sm hover:bg-chart-2/85' :
                                                      'bg-card border-2 border-border text-muted-foreground/40 hover:border-muted-foreground'}
                                                    ${claseCerrada ? 'cursor-default opacity-80' : 'cursor-pointer scale-100'}`}
                                                title={claseCerrada ? 'Cursada cerrada — solo lectura' : 'Clic para alternar estado'}
                                            >
                                                {valor === true && <Check size={18} strokeWidth={3} />}
                                            </button>
                                        )}
                                    </td>
                                );
                            })}
                            <td className="p-2 text-center border-l border-border bg-card/50">
                                <div className="flex justify-center flex-col items-center gap-1.5">
                                    {al.promedio ? (
                                        <Badge className="bg-chart-2 hover:bg-chart-2/90 flex items-center gap-1">
                                            <Check size={12} strokeWidth={3} /> Aprobado
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="border-amber-500/50 text-amber-600 dark:text-amber-500 bg-amber-500/10">
                                            En Proceso
                                        </Badge>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
