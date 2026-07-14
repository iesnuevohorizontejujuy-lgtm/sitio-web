'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CalendarDays, BookOpen, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { inscribirseMesaAction } from '@/app/campus/dashboard/actions';

function formatFecha(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatHora(timeStr) {
    if (!timeStr) return '';
    return timeStr.slice(0, 5);
}

function estadoBadge(estado) {
    const map = {
        inscripto: { label: 'Inscripto', variant: 'default' },
        presente: { label: 'Presente', variant: 'outline' },
        ausente: { label: 'Ausente', variant: 'destructive' },
        aprobado: { label: 'Aprobado', variant: 'default' },
        desaprobado: { label: 'Desaprobado', variant: 'destructive' },
    };
    const e = (estado || '').toLowerCase();
    const info = map[e] || { label: estado || '—', variant: 'secondary' };
    return <Badge variant={info.variant}>{info.label}</Badge>;
}

function MesaCard({ mesa, onInscribirse, isPending }) {
    const materia = mesa.materia?.nombre || mesa.materia_nombre || 'Materia';
    const fecha = formatFecha(mesa.fecha);
    const hora = formatHora(mesa.hora);
    const llamado = mesa.llamado || '—';
    const tribunal = [mesa.presidente_nombre, mesa.vocal1_nombre, mesa.vocal2_nombre].filter(Boolean).join(', ');

    return (
        <Card className="flex flex-col justify-between">
            <CardHeader className="pb-3">
                <CardTitle className="text-base">{materia}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-xs">
                    <CalendarDays className="w-3.5 h-3.5" /> {fecha} {hora && `· ${hora}`} · Llamado {llamado}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {tribunal && (
                    <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Tribunal:</span> {tribunal}
                    </p>
                )}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button size="sm" className="w-full" disabled={isPending}>
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <BookOpen className="w-4 h-4 mr-1" />}
                            Inscribirme
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar inscripción</AlertDialogTitle>
                            <AlertDialogDescription>
                                ¿Estás seguro de que querés inscribirte a la mesa de <strong>{materia}</strong> del {fecha}?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onInscribirse(mesa.id)}>
                                Confirmar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    );
}

export function MesasAlumnoClient({ mesasDisponibles, misInscripciones }) {
    const [isPending, startTransition] = useTransition();
    const [mensaje, setMensaje] = useState(null);

    function handleInscribirse(mesaExamenId) {
        startTransition(async () => {
            setMensaje(null);
            const res = await inscribirseMesaAction(mesaExamenId);
            if (res?.error) {
                setMensaje({ tipo: 'error', texto: res.error });
            } else {
                setMensaje({ tipo: 'ok', texto: res?.message || 'Inscripción exitosa.' });
            }
        });
    }

    return (
        <div className="space-y-4">
            {mensaje && (
                <div className={`flex items-center gap-2 rounded-md border px-4 py-3 text-sm ${mensaje.tipo === 'ok' ? 'border-green-300 bg-green-50 text-green-800 dark:border-green-700 dark:bg-green-950 dark:text-green-300' : 'border-red-300 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-950 dark:text-red-300'}`}>
                    {mensaje.tipo === 'ok' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {mensaje.texto}
                </div>
            )}

            <Tabs defaultValue="disponibles">
                <TabsList>
                    <TabsTrigger value="disponibles">
                        Disponibles ({mesasDisponibles.length})
                    </TabsTrigger>
                    <TabsTrigger value="inscripciones">
                        Mis Inscripciones ({misInscripciones.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="disponibles" className="mt-4">
                    {mesasDisponibles.length === 0 ? (
                        <p className="text-muted-foreground text-sm py-8 text-center">
                            No hay mesas de examen disponibles en este momento.
                        </p>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {mesasDisponibles.map((mesa) => (
                                <MesaCard
                                    key={mesa.id}
                                    mesa={mesa}
                                    onInscribirse={handleInscribirse}
                                    isPending={isPending}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="inscripciones" className="mt-4">
                    {misInscripciones.length === 0 ? (
                        <p className="text-muted-foreground text-sm py-8 text-center">
                            Todavía no te inscribiste a ninguna mesa.
                        </p>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Materia</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Llamado</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Nota</TableHead>
                                        <TableHead>Condición</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {misInscripciones.map((insc) => (
                                        <TableRow key={insc.id}>
                                            <TableCell className="font-medium">
                                                {insc.mesa_examen?.materia?.nombre || insc.materia_nombre || '—'}
                                            </TableCell>
                                            <TableCell>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                                    {formatFecha(insc.mesa_examen?.fecha || insc.fecha)}
                                                </span>
                                            </TableCell>
                                            <TableCell>{insc.mesa_examen?.llamado || insc.llamado || '—'}</TableCell>
                                            <TableCell>{estadoBadge(insc.estado)}</TableCell>
                                            <TableCell>{insc.nota ?? '—'}</TableCell>
                                            <TableCell>{insc.condicion_examen || '—'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
