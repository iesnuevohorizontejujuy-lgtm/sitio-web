import { Loader2, BookOpen, Clock, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';


// --- COMPONENTE AUXILIAR PARA LA TARJETA ---
export function CursoActualmenteCard({ materia }) {
    const getColorAsistencia = (pct) => {
        if (pct >= 80) return 'bg-green-500';
        if (pct >= 60) return 'bg-yellow-400';
        return 'bg-red-500';
    };

    return (
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden flex flex-col hover:shadow-md transition">
            <div className="p-4 border-b border-border bg-muted/30">
                <h3 className="font-bold text-primary truncate" title={materia.materia}>
                    {materia.materia}
                </h3>
                <span className="text-xs text-secondary-foreground font-medium">Ciclo {materia.anio_cursada}</span>
            </div>

            <div className="p-4 space-y-4 flex-1">
                {/* Barra de Asistencia */}
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-orange-400 font-bold flex items-center gap-1">
                            <BarChart3 size={12} /> Asistencia
                        </span>
                        <span className="font-bold text-foreground">{materia.asistencia_porcentaje}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                            className={`h-2 rounded-full ${getColorAsistencia(materia.asistencia_porcentaje)} transition-all duration-1000`}
                            style={{ width: `${materia.asistencia_porcentaje}%` }}
                        ></div>
                    </div>
                </div>

                {/* Notas Parciales */}
                <div>
                    <span className="text-xs text-secondary-foreground font-bold block mb-2">Notas Parciales</span>
                    <div className="flex flex-wrap gap-2">
                        {materia.notas_detalle && materia.notas_detalle.length > 0 ? (
                            materia.notas_detalle.map((nota, idx) => (
                                <div key={idx} className="bg-card border border-border rounded px-2 py-1 text-center min-w-[50px]">
                                    <span className="block text-[9px] text-secondary-foreground uppercase tracking-tighter">
                                        {nota.nombre}
                                    </span>
                                    <span className={`block font-bold text-sm ${nota.valor >= 6 ? 'text-green-800 dark:text-green-400' : (nota.valor === '-' ? 'text-muted-foreground/40' : 'text-red-600 dark:text-red-400')}`}>
                                        {nota.valor}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <span className="text-xs text-muted-foreground italic">Sin exámenes aún</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};