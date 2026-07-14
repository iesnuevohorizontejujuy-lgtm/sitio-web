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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function DialogRenombrarTp({ tp, nombre, onNombreChange, onConfirmar, onCancelar, guardando }) {
    return (
        <AlertDialog open={!!tp} onOpenChange={v => { if (!v) onCancelar(); }}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Renombrar TP</AlertDialogTitle>
                    <AlertDialogDescription>
                        Modificá el nombre de <strong>{tp?.nombre}</strong>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="px-1 py-2">
                    <Label htmlFor="edit-tp">Nuevo nombre</Label>
                    <Input
                        id="edit-tp"
                        value={nombre}
                        onChange={e => onNombreChange(e.target.value)}
                        className="mt-1"
                        onKeyDown={e => e.key === 'Enter' && !guardando && onConfirmar()}
                        autoFocus
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={guardando} onClick={onCancelar}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirmar} disabled={guardando}>
                        {guardando && <Loader2 size={14} className="animate-spin mr-1" />}
                        Guardar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
