'use client';

import React, { useState, useEffect, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    Loader2,
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    Users,
    Save,
    Lock,
    CheckCircle2,
    XCircle,
    MinusCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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
import { fetchActaMesa, guardarNotaMesaAction, cerrarMesaAction } from '../../actions';

// ── Helpers ──

function formatFecha(fecha) {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-AR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

function formatLlamado(llamado) {
    return llamado === 'primer_llamado' ? '1° Llamado' : '2° Llamado';
}

function estadoBadge(estado) {
    const map = {
        inscripto: { label: 'Inscripto', variant: 'outline' },
        aprobado: { label: 'Aprobado', variant: 'default', className: 'bg-green-600 hover:bg-green-700' },
        aplazado: { label: 'Aplazado', variant: 'destructive' },
        ausente: { label: 'Ausente', variant: 'secondary' },
    };
    const cfg = map[estado] || { label: estado, variant: 'outline' };
    return <Badge variant={cfg.variant} className={cfg.className}>{cfg.label}</Badge>;
}

function condicionBadge(condicion) {
    if (condicion === 'regular') {
        return <Badge variant="outline" className="border-blue-500 text-blue-600">Regular</Badge>;
    }
    return <Badge variant="outline" className="border-amber-500 text-amber-600">Libre</Badge>;
}

// ── Página ──

export default function ActaMesaPage({ params }) {
    const { id } = use(params);
    const router = useRouter();

    const [mesa, setMesa] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCerrar, setShowCerrar] = useState(false);
    const [cerrando, setCerrando] = useState(false);

    // Estado local por inscripción: { [inscId]: { nota, folio, libro } }
    const [locales, setLocales] = useState({});
    const [dirty, setDirty] = useState(new Set());
    const [saving, setSaving] = useState(new Set());

    const cargar = useCallback(async () => {
        try {
            const data = await fetchActaMesa(id);
            setMesa(data);

            // Init locales
            const init = {};
            (data.inscripciones_mesa || []).forEach((insc) => {
                init[insc.id] = {
                    nota: insc.nota != null ? String(insc.nota) : '',
                    folio: insc.folio ?? '',
                    libro: insc.libro ?? '',
                };
            });
            setLocales(init);
            setDirty(new Set());
        } catch {
            toast.error('Error al cargar el acta de examen');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        cargar();
    }, [cargar]);

    const handleChange = (inscId, field, value) => {
        setLocales((prev) => ({
            ...prev,
            [inscId]: { ...prev[inscId], [field]: value },
        }));
        setDirty((prev) => new Set(prev).add(inscId));
    };

    const handleGuardarNota = async (inscId) => {
        const local = locales[inscId];
        if (!local?.nota || local.nota === '') {
            toast.error('Ingresá una nota antes de guardar.');
            return;
        }

        const nota = parseFloat(local.nota);
        if (isNaN(nota) || nota < 1 || nota > 10) {
            toast.error('La nota debe ser un número entre 1 y 10.');
            return;
        }

        setSaving((prev) => new Set(prev).add(inscId));
        try {
            const result = await guardarNotaMesaAction({
                inscripcion_mesa_id: inscId,
                nota,
                folio: local.folio || undefined,
                libro: local.libro || undefined,
            });

            // Actualizar la inscripción en el estado
            setMesa((prev) => ({
                ...prev,
                inscripciones_mesa: prev.inscripciones_mesa.map((insc) =>
                    insc.id === inscId ? { ...insc, ...result.inscripcion } : insc
                ),
            }));
            setDirty((prev) => {
                const next = new Set(prev);
                next.delete(inscId);
                return next;
            });
            toast.success(nota >= 4 ? 'Aprobado — Nota guardada' : 'Aplazado — Nota guardada');
        } catch (e) {
            toast.error(e.message || 'Error al guardar la nota');
        } finally {
            setSaving((prev) => {
                const next = new Set(prev);
                next.delete(inscId);
                return next;
            });
        }
    };

    const handleCerrarMesa = async () => {
        setCerrando(true);
        try {
            await cerrarMesaAction({ mesa_id: mesa.id });
            toast.success('Acta de examen cerrada exitosamente.');
            await cargar();
        } catch (e) {
            toast.error(e.message || 'Error al cerrar el acta');
        } finally {
            setCerrando(false);
            setShowCerrar(false);
        }
    };

    // ── Guards ──

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
            </div>
        );
    }

    if (!mesa || mesa.error) {
        return (
            <div className="max-w-screen-xl mx-auto p-6 text-center space-y-4">
                <h2 className="text-xl font-bold">Error al cargar el acta</h2>
                <p className="text-muted-foreground">La mesa no existe o no tenés permisos.</p>
                <Button variant="outline" onClick={() => router.back()}>
                    Volver
                </Button>
            </div>
        );
    }

    const cerrada = mesa.estado === 'cerrada';
    const inscripciones = mesa.inscripciones_mesa || [];

    const resumen = {
        total: inscripciones.length,
        aprobados: inscripciones.filter((i) => i.estado === 'aprobado').length,
        aplazados: inscripciones.filter((i) => i.estado === 'aplazado').length,
        ausentes: inscripciones.filter((i) => i.estado === 'ausente').length,
        pendientes: inscripciones.filter((i) => i.estado === 'inscripto').length,
    };

    return (
        <div className="h-[calc(100vh-3.5rem-2rem)] flex flex-col overflow-hidden">
            <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col flex-1 overflow-hidden">
                {/* ── Header ── */}
                <div className="px-6 py-4 border-b border-border space-y-3">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => router.push('/campus/docente/mesas')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-xl font-bold truncate">
                                {mesa.materia?.nombre ?? 'Mesa de Examen'}
                            </h1>
                            <p className="text-sm text-muted-foreground truncate">
                                {mesa.materia?.modulo?.plan?.carrera?.nombre ?? ''}
                            </p>
                        </div>
                        <Badge variant={cerrada ? 'secondary' : 'default'} className="text-sm">
                            {cerrada ? 'Acta Cerrada' : 'Acta Abierta'}
                        </Badge>
                    </div>

                    {/* Info row */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            {formatFecha(mesa.fecha)}
                        </span>
                        {mesa.hora && (
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                {mesa.hora?.slice(0, 5)}
                            </span>
                        )}
                        {mesa.aula && (
                            <span className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                {mesa.aula}
                            </span>
                        )}
                        <Badge variant="outline">{formatLlamado(mesa.llamado)}</Badge>
                        <span className="flex items-center gap-1.5">
                            <Users className="h-4 w-4" />
                            {resumen.total} inscriptos
                        </span>
                    </div>

                    {/* Resumen de estado */}
                    {resumen.total > 0 && (
                        <div className="flex flex-wrap gap-3 text-xs">
                            {resumen.aprobados > 0 && (
                                <span className="flex items-center gap-1 text-green-600">
                                    <CheckCircle2 className="h-3.5 w-3.5" /> {resumen.aprobados} aprobados
                                </span>
                            )}
                            {resumen.aplazados > 0 && (
                                <span className="flex items-center gap-1 text-red-500">
                                    <XCircle className="h-3.5 w-3.5" /> {resumen.aplazados} aplazados
                                </span>
                            )}
                            {resumen.ausentes > 0 && (
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <MinusCircle className="h-3.5 w-3.5" /> {resumen.ausentes} ausentes
                                </span>
                            )}
                            {resumen.pendientes > 0 && (
                                <span className="flex items-center gap-1 text-blue-500">
                                    <Users className="h-3.5 w-3.5" /> {resumen.pendientes} pendientes
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Tabla ── */}
                <div className="flex-1 overflow-auto">
                    {inscripciones.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                            <Users className="h-12 w-12 mb-4 opacity-40" />
                            <p>No hay alumnos inscriptos en esta mesa.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-[50px]">#</TableHead>
                                    <TableHead>Alumno</TableHead>
                                    <TableHead className="w-[100px]">DNI</TableHead>
                                    <TableHead className="w-[100px] text-center">Condición</TableHead>
                                    <TableHead className="w-[100px] text-center">Nota</TableHead>
                                    <TableHead className="w-[100px]">Folio</TableHead>
                                    <TableHead className="w-[100px]">Libro</TableHead>
                                    <TableHead className="w-[120px] text-center">Estado</TableHead>
                                    {!cerrada && <TableHead className="w-[80px]" />}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {inscripciones.map((insc, idx) => {
                                    const local = locales[insc.id] || { nota: '', folio: '', libro: '' };
                                    const isSaving = saving.has(insc.id);
                                    const yaCalificado = insc.estado !== 'inscripto';

                                    return (
                                        <TableRow key={insc.id} className={yaCalificado ? 'opacity-80' : ''}>
                                            <TableCell className="text-muted-foreground text-xs">
                                                {idx + 1}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {insc.alumno
                                                    ? `${insc.alumno.apellido}, ${insc.alumno.nombre}`
                                                    : '—'}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {insc.alumno?.dni ?? '—'}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {condicionBadge(insc.condicion_inscripcion)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {cerrada || yaCalificado ? (
                                                    <span className="font-semibold">
                                                        {insc.nota != null ? Number(insc.nota).toFixed(0) : '—'}
                                                    </span>
                                                ) : (
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        max={10}
                                                        step={1}
                                                        className="w-20 h-8 text-center mx-auto"
                                                        value={local.nota}
                                                        onChange={(e) =>
                                                            handleChange(insc.id, 'nota', e.target.value)
                                                        }
                                                        disabled={isSaving}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {cerrada || yaCalificado ? (
                                                    <span className="text-sm">{insc.folio || '—'}</span>
                                                ) : (
                                                    <Input
                                                        className="w-20 h-8"
                                                        value={local.folio}
                                                        onChange={(e) =>
                                                            handleChange(insc.id, 'folio', e.target.value)
                                                        }
                                                        disabled={isSaving}
                                                        placeholder="Folio"
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {cerrada || yaCalificado ? (
                                                    <span className="text-sm">{insc.libro || '—'}</span>
                                                ) : (
                                                    <Input
                                                        className="w-20 h-8"
                                                        value={local.libro}
                                                        onChange={(e) =>
                                                            handleChange(insc.id, 'libro', e.target.value)
                                                        }
                                                        disabled={isSaving}
                                                        placeholder="Libro"
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {estadoBadge(insc.estado)}
                                            </TableCell>
                                            {!cerrada && (
                                                <TableCell>
                                                    {!yaCalificado && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            disabled={isSaving || !dirty.has(insc.id)}
                                                            onClick={() => handleGuardarNota(insc.id)}
                                                        >
                                                            {isSaving ? (
                                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                            ) : (
                                                                <Save className="h-3.5 w-3.5" />
                                                            )}
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </div>

                {/* ── Footer ── */}
                {!cerrada && inscripciones.length > 0 && (
                    <div className="px-6 py-3 border-t border-border flex items-center justify-between bg-muted/30">
                        <p className="text-xs text-muted-foreground">
                            {resumen.pendientes > 0
                                ? `${resumen.pendientes} alumno(s) sin calificar — serán marcados como ausentes al cerrar.`
                                : 'Todos los alumnos fueron calificados.'}
                        </p>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setShowCerrar(true)}
                            className="gap-1.5"
                        >
                            <Lock className="h-3.5 w-3.5" />
                            Cerrar Acta
                        </Button>
                    </div>
                )}
            </div>

            {/* ── Dialog: Cerrar Acta ── */}
            <AlertDialog open={showCerrar} onOpenChange={setShowCerrar}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Cerrar el acta de examen?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Los alumnos que no hayan sido calificados serán marcados como <strong>ausentes</strong>.
                            <strong className="block mt-2 text-destructive">
                                Esta acción no se puede deshacer.
                            </strong>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={cerrando}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCerrarMesa}
                            disabled={cerrando}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {cerrando ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Lock className="h-4 w-4 mr-2" />
                            )}
                            Cerrar Acta
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
