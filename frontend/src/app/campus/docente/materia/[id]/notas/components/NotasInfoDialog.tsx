'use client';

import { useState } from 'react';
import {
    AlertDialog, AlertDialogContent, AlertDialogHeader,
    AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
    AlertDialogCancel
} from '@/components/ui/alert-dialog';
import {
    HelpCircle, ClipboardList, GraduationCap,
    UserCheck, UserX, FileText
} from 'lucide-react';

interface RowProps {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    iconClass: string;
    title: string;
    children: React.ReactNode;
}

function Row({ icon: Icon, iconClass, title, children }: RowProps) {
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

interface CondBadgeProps {
    icon: React.ComponentType<{ size?: number }>;
    label: string;
    colorClass: string;
}

function CondBadge({ icon: Icon, label, colorClass }: CondBadgeProps) {
    return (
        <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold border ${colorClass}`}>
            <Icon size={9} /> {label}
        </span>
    );
}

export function NotasInfoDialog() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button
                onClick={() => setOpen(true)}
                aria-label="Cómo usar la planilla de notas"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-medium border border-border hover:border-primary/40 rounded-lg px-3 py-2"
            >
                <HelpCircle size={14} /> Ayuda
            </button>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <ClipboardList size={20} className="text-primary" />
                            Cómo usar la planilla de notas
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-4 text-sm">
                                <Row icon={ClipboardList} iconClass="bg-chart-3/10 text-chart-3" title="Parciales">
                                    <p>Ingresá la nota (1 a 10) en la celda. Los cambios se guardan con el botón <strong>Guardar notas</strong>.</p>
                                    <p>Si la nota es menor a 6, la celda se destaca en rojo.</p>
                                </Row>

                                <Row icon={GraduationCap} iconClass="bg-chart-2/10 text-chart-2" title="Condición proyectada">
                                    <p>Se calcula automáticamente comparando notas y asistencia con los criterios configurados:</p>
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        <CondBadge icon={GraduationCap} label="Promoción" colorClass="bg-chart-2/10 text-chart-2 border-chart-2/20" />
                                        <CondBadge icon={UserCheck} label="Regular" colorClass="bg-primary/10 text-primary border-primary/20" />
                                        <CondBadge icon={UserX} label="Libre" colorClass="bg-destructive/10 text-destructive border-destructive/20" />
                                    </div>
                                    <p className="mt-1">Es <strong>proyectada</strong>: puede cambiar mientras sigue cursando.</p>
                                </Row>

                                <Row icon={FileText} iconClass="bg-chart-3/10 text-chart-3" title="Nota final">
                                    <p>Solo aparece editable para alumnos en condición <strong>Regular</strong> o <strong>Libre</strong> (rinden examen final). Para los demás se muestra en modo lectura.</p>
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
