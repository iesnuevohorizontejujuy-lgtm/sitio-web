import { Loader2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function DialogEliminarTp({ tp, onConfirmar, onCancelar, eliminando }) {
    return (
        <AlertDialog open={!!tp} onOpenChange={v => { if (!v) onCancelar(); }}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Eliminar TP</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción eliminará <strong>{tp?.nombre}</strong> de forma permanente.
                        Solo se puede eliminar si no tiene entregas registradas.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={eliminando} onClick={onCancelar}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirmar}
                        disabled={eliminando}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {eliminando && <Loader2 size={14} className="animate-spin mr-1" />}
                        Eliminar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
