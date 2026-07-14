'use client';

import { Save, Lock } from 'lucide-react';

interface PlanillaFooterProps {
    saving: boolean;
    dirtyCount: number;
    showCerrarNotas: boolean;
    onGuardar: () => void;
    onCerrarNotas: () => void;
}

export function PlanillaFooter({
    saving,
    dirtyCount,
    showCerrarNotas,
    onGuardar,
    onCerrarNotas
}: PlanillaFooterProps) {
    // Simulando fecha de última modificación (podría venir del backend eventualmente)
    const ultimaMod = new Date().toLocaleDateString('es-AR', {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    return (
        <div className="p-6 shrink-0">
            <footer className="flex flex-col md:flex-row justify-between items-center bg-card p-6 rounded-2xl border border-border shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <p className="text-xs text-muted-foreground leading-tight hidden md:block">
                        Última actividad:<br />
                        <span className="font-bold text-foreground capitalize">{ultimaMod}</span>
                    </p>
                    <span className="w-px h-8 bg-border hidden md:block"></span>
                    <p className="text-xs text-muted-foreground leading-tight">
                        Estado de carga:<br />
                        <span className="font-bold text-primary">
                            {dirtyCount > 0 ? `${dirtyCount} cambios sin guardar` : 'Sincronizado'}
                        </span>
                    </p>
                </div>
                
                <div className="flex gap-4 w-full md:w-auto">
                    {showCerrarNotas && (
                        <button 
                            onClick={onCerrarNotas}
                            className="flex-1 md:flex-none px-6 py-3 rounded-xl border border-destructive/20 text-destructive font-bold text-xs uppercase tracking-widest hover:bg-destructive/10 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Lock size={16} /> Cerrar Acta
                        </button>
                    )}
                    
                    <button 
                        onClick={onGuardar}
                        disabled={saving || dirtyCount === 0}
                        className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
                            ${saving || dirtyCount === 0 
                                ? 'bg-muted text-muted-foreground shadow-none cursor-not-allowed' 
                                : 'bg-primary text-primary-foreground shadow-primary/20 hover:shadow-primary/30'
                            }`}
                    >
                        <Save size={16} />
                        {saving ? 'Guardando...' : 'Guardar Planilla'}
                    </button>
                </div>
            </footer>
        </div>
    );
}
