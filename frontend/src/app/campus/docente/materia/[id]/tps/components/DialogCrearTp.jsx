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

export function DialogCrearTp({ open, onOpenChange, nombre, onNombreChange, onConfirmar, creando }) {
    return (
        <AlertDialog open={open} onOpenChange={v => { onOpenChange(v); }}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Nuevo Trabajo Práctico</AlertDialogTitle>
                    <AlertDialogDescription>
                        Ingresá el nombre del TP para agregar a esta clase.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="px-1 py-2">
                    <Label htmlFor="nuevo-tp">Nombre del TP</Label>
                    <Input
                        id="nuevo-tp"
                        value={nombre}
                        onChange={e => onNombreChange(e.target.value)}
                        placeholder="Ej: TP N° 1 — Introducción"
                        className="mt-1"
                        onKeyDown={e => e.key === 'Enter' && !creando && onConfirmar()}
                        autoFocus
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={creando}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirmar} disabled={creando}>
                        {creando && <Loader2 size={14} className="animate-spin mr-1" />}
                        Agregar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
