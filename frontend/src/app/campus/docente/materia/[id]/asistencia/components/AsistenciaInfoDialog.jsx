'use client';
import { useState } from 'react';
import {
    AlertDialog, AlertDialogContent, AlertDialogHeader,
    AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
    AlertDialogCancel
} from '@/components/ui/alert-dialog';
import { HelpCircle, CalendarDays, Check, X, AlertTriangle, BookOpen } from 'lucide-react';

function Row({ icon: Icon, iconClass, title, children }) {
    return (
        <div className="flex gap-3">
            <div className={`p-1.5 rounded-lg shrink-0 h-fit mt-0.5 ${iconClass}`}>
                <Icon size={14} />
            </div>
            <div>
                <p className="font-semibold text-foreground text-sm">{title}</p>
                <div className="text-muted-foreground text-xs mt-0.5 space-y-1">{children}</div>
            </div>
        </div>
    );
}

export function AsistenciaInfoDialog() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button
                onClick={() => setOpen(true)}
                aria-label="Cómo registrar asistencia"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-medium border border-border hover:border-primary/40 rounded-lg px-3 py-2"
            >
                <HelpCircle size={14} /> Ayuda
            </button>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <CalendarDays size={20} className="text-primary" />
                            Cómo registrar asistencia
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-4 text-sm">
                                <p className="text-muted-foreground text-xs">
                                    La planilla de asistencia se organiza por fecha. Cada columna es una clase.
                                </p>

                                <Row icon={CalendarDays} iconClass="bg-primary/10 text-primary" title="Abrir un día">
                                    <p>Seleccioná la fecha con el selector y hacé clic en <strong>Abrir Día</strong>. Esto activa el modo edición para esa fecha.</p>
                                </Row>

                                <Row icon={Check} iconClass="bg-chart-2/10 text-chart-2" title="Marcar presente">
                                    <p>Hacé clic en la celda del alumno para la fecha activa. El ciclo es: sin marcar → <strong>Presente</strong> → Ausente → sin marcar.</p>
                                </Row>

                                <Row icon={X} iconClass="bg-destructive/10 text-destructive" title="Marcar ausente">
                                    <p>Al volver a hacer clic en una celda Presente, pasa a <strong>Ausente</strong>. Podés hacer clic también en cualquier fecha anterior para editarla.</p>
                                </Row>

                                <Row icon={BookOpen} iconClass="bg-chart-3/10 text-chart-3" title="Guardar cambios">
                                    <p>Cuando termines de marcar, hacé clic en <strong>GUARDAR CAMBIOS</strong> en la barra inferior. Los cambios no se guardan automáticamente hasta presionar ese botón.</p>
                                </Row>

                                <Row icon={AlertTriangle} iconClass="bg-chart-5/10 text-chart-5" title="Las celdas en gris">
                                    <p>Las columnas de fechas pasadas aparecen atenuadas (modo visualización). Podés hacer clic en cualquiera de ellas para activar la edición de ese día específico.</p>
                                </Row>
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
