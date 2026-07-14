'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, FileText, Calendar, Clock, MapPin, Users, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { fetchMisMesas } from '../actions';

function formatLlamado(llamado) {
    return llamado === 'primer_llamado' ? '1° Llamado' : '2° Llamado';
}

function formatFecha(fecha) {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

function formatHora(hora) {
    if (!hora) return null;
    return hora.slice(0, 5); // "HH:mm"
}

export default function MesasDocentePage() {
    const [mesas, setMesas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMisMesas()
            .then((data) => setMesas(Array.isArray(data) ? data : []))
            .catch(() => toast.error('Error al cargar las mesas de examen'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
            </div>
        );
    }

    const mesasAbiertas = mesas.filter((m) => m.estado === 'abierta');
    const mesasCerradas = mesas.filter((m) => m.estado === 'cerrada');

    return (
        <div className="max-w-screen-xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">
            {/* Encabezado */}
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground leading-tight">
                    Mesas de Examen
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Mesas donde participás como presidente o vocal del tribunal.
                </p>
            </div>

            {mesas.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
                        <p className="text-muted-foreground">No tenés mesas de examen asignadas.</p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Mesas Abiertas */}
                    {mesasAbiertas.length > 0 && (
                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-green-500" />
                                Mesas Abiertas ({mesasAbiertas.length})
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {mesasAbiertas.map((mesa) => (
                                    <MesaCard key={mesa.id} mesa={mesa} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Mesas Cerradas */}
                    {mesasCerradas.length > 0 && (
                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold text-muted-foreground flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-gray-400" />
                                Mesas Cerradas ({mesasCerradas.length})
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {mesasCerradas.map((mesa) => (
                                    <MesaCard key={mesa.id} mesa={mesa} />
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}
        </div>
    );
}

function MesaCard({ mesa }) {
    const carrera = mesa.materia?.modulo?.plan?.carrera?.nombre ?? '';
    const hora = formatHora(mesa.hora);
    const cerrada = mesa.estado === 'cerrada';

    return (
        <Link href={`/campus/docente/mesas/${mesa.id}`}>
            <Card className={`group hover:shadow-md transition-shadow cursor-pointer ${cerrada ? 'opacity-70' : ''}`}>
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <CardTitle className="text-base font-bold truncate">
                                {mesa.materia?.nombre ?? 'Materia'}
                            </CardTitle>
                            {carrera && (
                                <CardDescription className="text-xs truncate">
                                    {carrera}
                                </CardDescription>
                            )}
                        </div>
                        <Badge variant={cerrada ? 'secondary' : 'default'} className="shrink-0">
                            {cerrada ? 'Cerrada' : 'Abierta'}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatFecha(mesa.fecha)}
                        </span>
                        {hora && (
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                {hora}
                            </span>
                        )}
                        {mesa.aula && (
                            <span className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5" />
                                {mesa.aula}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                            {formatLlamado(mesa.llamado)}
                        </Badge>

                        <span className="flex items-center gap-1 text-xs">
                            <Users className="h-3.5 w-3.5" />
                            {mesa.inscripciones_mesa?.length ?? 0} inscriptos
                        </span>
                    </div>

                    {/* Tribunal */}
                    <div className="pt-1 border-t border-border text-xs space-y-0.5">
                        {mesa.presidente && (
                            <p>
                                <span className="font-medium">Pres.</span>{' '}
                                {mesa.presidente.apellido}, {mesa.presidente.nombre}
                            </p>
                        )}
                        {mesa.vocal1 && (
                            <p>
                                <span className="font-medium">Vocal 1:</span>{' '}
                                {mesa.vocal1.apellido}, {mesa.vocal1.nombre}
                            </p>
                        )}
                        {mesa.vocal2 && (
                            <p>
                                <span className="font-medium">Vocal 2:</span>{' '}
                                {mesa.vocal2.apellido}, {mesa.vocal2.nombre}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end pt-1">
                        <span className="text-xs text-primary flex items-center gap-1 group-hover:underline">
                            Ver acta <ChevronRight className="h-3 w-3" />
                        </span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
