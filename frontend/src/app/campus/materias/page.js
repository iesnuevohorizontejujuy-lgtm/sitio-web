import { apiFetch } from '@/lib/api';
import { redirect } from 'next/navigation';
import { Lock, CreditCard, CalendarX2 } from 'lucide-react';
import { TituloCard } from './components/TituloCard';
import { MateriasClient } from './components/MateriasClient';
import { InscripcionAlert } from './components/MateriasInscripto';
import { BotonPagoMatricula } from './components/BotonPagoMatricula';

export default async function Inscripciones({ searchParams }) {
    const params = (await searchParams) ?? {};

    const resPerfil = await apiFetch('/alumno/perfil', {
        next: { tags: ['alumno-perfil'] },
    });
    const perfilRaw = await resPerfil.json();
    const estadoAlumno = (perfilRaw?.estado ?? perfilRaw?.alumno?.estado ?? '').toString().trim().toLowerCase();

    if (estadoAlumno === 'egresado') {
        redirect('/campus/dashboard');
    }

    const carreras = Array.isArray(perfilRaw?.carreras) ? perfilRaw.carreras : [];

    // VALIDACIONES
    const inscripcionAbierta = perfilRaw?.inscripcion_abierta ?? false;
    // DEV: se omite la validación de pago para poder probar el flujo de inscripción
    // sin necesidad de pasar por MercadoPago. Reactivar en producción.
    //const pagoAlDia = perfilRaw?.pago_matricula_al_dia ?? false;
    const pagoAlDia = true; // TODO: reemplazar por la línea de arriba en producción
    const nombrePeriodo = perfilRaw?.nombre_periodo ?? 'el periodo actual';
    const montoInscripcion = perfilRaw?.monto_inscripcion ?? 0;
    const periodoId = perfilRaw?.periodo_inscripcion_id ?? null;

    const queryCarreraId = Array.isArray(params?.carrera_id)
        ? params.carrera_id[0]
        : params?.carrera_id;
    const selectedCarreraIdFromQuery = queryCarreraId ? String(queryCarreraId) : null;
    const selectedCarrera = carreras.find(c => String(c.id) === selectedCarreraIdFromQuery) ?? carreras[0] ?? null;
    const queryCarrera = selectedCarrera ? `?carrera_id=${selectedCarrera.id}` : '';

    const [resMaterias, resInscripciones] = await Promise.all([
        apiFetch(`/materias-disponibles${queryCarrera}`, { next: { tags: ['materias-disponibles'] } }),
        apiFetch(`/inscripciones${queryCarrera}`, { next: { tags: ['inscripciones'] } }),
    ]);

    const materiasRaw = await resMaterias.json();
    const inscripcionesRaw = await resInscripciones.json();
    const materias = Array.isArray(materiasRaw) ? materiasRaw : [];
    const misInscripciones = Array.isArray(inscripcionesRaw) ? inscripcionesRaw : [];

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <TituloCard title="Inscripción Académica" />

            <InscripcionAlert misInscripciones={misInscripciones} />

            <div className="mb-10 mt-6">

                {/* BLOQUEO VISUAL */}

                {!inscripcionAbierta ? (
                    <div className="bg-card border border-border p-10 md:p-12 rounded-2xl text-center max-w-2xl mx-auto mt-10">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                            <CalendarX2 className="text-muted-foreground" size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-primary uppercase tracking-tight mb-2">
                            Inscripciones Cerradas
                        </h3>
                        <p className="text-muted-foreground">
                            El periodo de inscripción a materias no se encuentra activo en este momento.
                            Mantente atento a la sección de Noticias para próximas fechas.
                        </p>
                    </div>

                ) : !pagoAlDia ? (
                    <div className="bg-card border border-destructive/20 p-10 md:p-12 rounded-2xl text-center max-w-2xl mx-auto mt-10 relative overflow-hidden">
                        {/* Barra de alerta superior */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-destructive" />

                        <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lock className="text-destructive" size={40} />
                        </div>

                        <h3 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase tracking-tight mb-3">
                            Habilitación Requerida
                        </h3>
                        <p className="text-muted-foreground mb-8 text-base md:text-lg">
                            Para inscribirte a las materias de{' '}
                            <strong className="text-primary">{nombrePeriodo}</strong>{' '}
                            debés abonar el derecho a inscripción correspondiente.
                        </p>

                        <div className="bg-muted border border-border rounded-xl p-5 mb-8 inline-block min-w-[220px]">
                            <span className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                                Total a abonar
                            </span>
                            <span className="text-4xl font-extrabold text-primary tabular-nums">
                                ${montoInscripcion.toLocaleString('es-AR')}
                            </span>
                        </div>

                        <BotonPagoMatricula />
                    </div>

                ) : (
                    <>
                        <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
                            <h2 className="text-lg font-bold text-foreground">
                                Materias Disponibles para Cursar
                            </h2>
                            <span className="text-white bg-green-800 border border-chart-2/20 px-3 py-1 rounded-full ">
                                Alumno Habilitado
                            </span>
                        </div>

                        <MateriasClient
                            materias={materias}
                            carreras={carreras}
                            selectedCarreraId={selectedCarrera?.id ?? null}
                        />
                    </>
                )}
            </div>
        </div>
    );
}