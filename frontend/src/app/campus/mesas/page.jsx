import { apiFetch } from '@/lib/api';
import { redirect } from 'next/navigation';
import { GraduationCap } from 'lucide-react';
import { MesasAlumnoClient } from './components/MesasAlumnoClient';

export default async function MesasAlumnoPage() {
    const [resPerfil, resMesas, resInscripciones] = await Promise.all([
        apiFetch('/alumno/perfil', { next: { tags: ['alumno-perfil'] } }),
        apiFetch('/mesas-disponibles', { next: { tags: ['mesas-disponibles'] } }),
        apiFetch('/mis-inscripciones-mesa', { next: { tags: ['inscripciones-mesa'] } }),
    ]);

    const perfilRaw = await resPerfil.json();
    const estadoAlumno = (perfilRaw?.estado ?? perfilRaw?.alumno?.estado ?? '').toString().trim().toLowerCase();

    if (estadoAlumno === 'egresado') {
        redirect('/campus/dashboard');
    }

    const mesasRaw = await resMesas.json();
    const inscripcionesRaw = await resInscripciones.json();
    const mesasDisponibles = Array.isArray(mesasRaw) ? mesasRaw : [];
    const misInscripciones = Array.isArray(inscripcionesRaw) ? inscripcionesRaw : [];

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <GraduationCap className="text-primary" /> Mesas de Examen
                </h1>
                <p className="text-muted-foreground text-sm">
                    Consultá las mesas disponibles e inscribite para rendir tus finales.
                </p>
            </div>

            <MesasAlumnoClient
                mesasDisponibles={mesasDisponibles}
                misInscripciones={misInscripciones}
            />
        </div>
    );
}
