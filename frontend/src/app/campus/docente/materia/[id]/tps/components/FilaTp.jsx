import { ChevronDown, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TablaAlumnos } from './TablaAlumnos';

export function FilaTp({
    tp,
    numero,
    expandido,
    claseCerrada,
    toggling,
    onToggleExpandir,
    onToggleAlumno,
    onRenombrar,
    onEliminar,
}) {
    return (
        <div>
            {/* Fila principal del TP */}
            <div className="flex items-center gap-3 px-4 py-3 bg-card hover:bg-muted/40 transition">
                <button
                    onClick={onToggleExpandir}
                    className="text-muted-foreground hover:text-foreground transition flex-shrink-0"
                    title={expandido ? 'Contraer' : 'Ver alumnos'}
                >
                    {expandido
                        ? <ChevronDown size={16} />
                        : <ChevronRight size={16} />}
                </button>

                <span className="text-muted-foreground text-sm w-5 text-center flex-shrink-0">
                    {numero}
                </span>

                <span className="font-medium flex-1">{tp.nombre}</span>

                <Badge variant="outline" className="font-mono text-xs flex-shrink-0">
                    {tp.entregados} / {tp.total}
                </Badge>

                {!claseCerrada && (
                    <div className="flex gap-1 flex-shrink-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            title="Renombrar"
                            onClick={onRenombrar}
                        >
                            <Pencil size={13} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            title="Eliminar"
                            onClick={onEliminar}
                            disabled={tp.entregados > 0}
                        >
                            <Trash2 size={13} />
                        </Button>
                    </div>
                )}
            </div>

            {/* Panel expandible con alumnos */}
            {expandido && (
                <div className="bg-muted/30 border-t">
                    <TablaAlumnos
                        alumnos={tp.alumnos}
                        tpId={tp.id}
                        claseCerrada={claseCerrada}
                        toggling={toggling}
                        onToggle={onToggleAlumno}
                    />
                </div>
            )}
        </div>
    );
}
