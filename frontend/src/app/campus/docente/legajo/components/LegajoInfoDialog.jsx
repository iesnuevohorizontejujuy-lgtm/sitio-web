'use client';
import { useState } from 'react';
import {
    AlertDialog, AlertDialogContent, AlertDialogHeader,
    AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
    AlertDialogCancel
} from '@/components/ui/alert-dialog';
import { Info, FolderOpen, Upload, CheckCircle, Lock } from 'lucide-react';

export function LegajoInfoDialog() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                aria-label="Información sobre Mi Legajo"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-medium border border-border hover:border-primary/40 rounded-lg px-3 py-1.5"
            >
                <Info size={14} /> ¿Cómo funciona?
            </button>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <FolderOpen size={20} className="text-primary" />
                            Guía del Legajo Docente
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-4 text-sm text-foreground">

                                <p className="text-muted-foreground">
                                    El legajo es tu carpeta de documentación institucional. Cada ciclo lectivo se genera uno nuevo que debés completar.
                                </p>

                                <div className="space-y-3">
                                    <div className="flex gap-3">
                                        <div className="p-1.5 bg-primary/10 text-primary rounded-lg shrink-0 h-fit mt-0.5">
                                            <FolderOpen size={14} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">1. Seleccioná el período</p>
                                            <p className="text-muted-foreground text-xs">Usá las pills de año para ver el legajo del ciclo que querés gestionar. El más reciente ya estará seleccionado.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="p-1.5 bg-primary/10 text-primary rounded-lg shrink-0 h-fit mt-0.5">
                                            <Upload size={14} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">2. Subí cada documento</p>
                                            <p className="text-muted-foreground text-xs">Hacé clic en <strong>Subir</strong> en cada documento requerido. Se aceptan PDF, JPG o PNG de hasta 5 MB. Los pendientes aparecen primero.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="p-1.5 bg-chart-2/10 text-chart-2 rounded-lg shrink-0 h-fit mt-0.5">
                                            <CheckCircle size={14} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">3. Legajo completo</p>
                                            <p className="text-muted-foreground text-xs">Cuando todos los documentos estén cargados, verás el badge <strong>Legajo Completo</strong> y la barra de progreso llegará al 100%.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="p-1.5 bg-muted text-muted-foreground rounded-lg shrink-0 h-fit mt-0.5">
                                            <Lock size={14} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">Revisión administrativa</p>
                                            <p className="text-muted-foreground text-xs">Los documentos son revisados por el área de gestión. Si alguno es rechazado, podés volver a subirlo usando el botón <strong>Reemplazar</strong>.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Entendido</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
