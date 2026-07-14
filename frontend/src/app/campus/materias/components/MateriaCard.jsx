import { useState } from 'react';
import { Loader2, BookOpen, Clock } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
export function MateriaCard({ materia, processingId, onInscribirse }) {
    const isProcessing = processingId === materia.id;
    const [estado, setEstado] = useState('regular');

    return (
        <Card className="flex flex-col overflow-hidden hover:border-primary/50 hover:shadow-md transition-all h-full">
            <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-primary text-white">
                        {materia.modulo?.nombre || 'General'}
                    </Badge>
                    <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded border shadow-sm">
                        {materia.codigo}
                    </span>
                </div>
                <CardTitle className="text-base leading-tight mt-2">
                    {materia.nombre}
                </CardTitle>
            </CardHeader>
            <CardFooter className="pt-0">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            disabled={!!processingId}
                            className="w-full font-bold uppercase tracking-wider text-xs"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={16} />
                                    PROCESANDO...
                                </>
                            ) : (
                                'INSCRIBIRSE'
                            )}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Confirmar inscripción?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Estás a punto de inscribirte en la materia <span className="font-bold text-foreground">{materia.nombre}</span>. Esta acción registrará tu voluntad de cursado para el ciclo lectivo actual.
                            </AlertDialogDescription>
                            <AlertDialogDescription>
                                Regimen de cursada a elegir:
                            </AlertDialogDescription>
                            <div className="mt-2 text-foreground">
                                <Select value={estado} onValueChange={setEstado}>
                                    <SelectTrigger className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                        <SelectValue placeholder="estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="regular">Regular</SelectItem>
                                            <SelectItem value="libre">Libre</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onInscribirse(materia.id, estado)}>
                                Confirmar Inscripción
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    );
}
