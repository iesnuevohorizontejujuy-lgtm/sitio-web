
import { ArrowLeft, ListChecks, Lock, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function CabeceraTps({ claseId, claseCerrada, onNuevoTp }) {
    return (
        <div className="p-4 border-b border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                    Trabajos Prácticos
                </h1>
                <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                    {claseCerrada
                        ? <span className="flex items-center gap-1 text-muted-foreground"><Lock size={11} /> Registro cerrado — solo auditoría</span>
                        : <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span> Gestionando calificaciones</span>}
                </p>
            </div>

            <div className="flex items-center gap-2">
                {claseCerrada ? (
                    <div className="flex items-center gap-2 text-muted-foreground bg-muted px-4 py-2 rounded-xl border border-border text-sm font-semibold">
                        <Lock size={14} /> <span>Edición bloqueada</span>
                    </div>
                ) : (
                    <div className="flex items-center bg-muted p-1.5 rounded-lg border border-border">
                        <button
                            onClick={onNuevoTp}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-1.5 rounded-md font-bold text-sm transition flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Nuevo TP
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
