import { apiFetch } from '@/lib/api';
import { GraduationCap } from 'lucide-react';
import { EgresadoHistorialView } from './components/EgresadoHistorialView';
import { SituacionAcademicaTabs } from './components/SituacionAcademicaTabs';

export default async function SituacionAcademica() {
    const [resHistorial, resPerfil] = await Promise.all([
        apiFetch('/alumno/historial', {
            next: { tags: ['alumno-historial'] },
        }),
        apiFetch('/alumno/perfil', {
            next: { tags: ['alumno-perfil'] },
        }),
    ]);

    const [historial, perfilRaw] = await Promise.all([
        resHistorial.json(),
        resPerfil.json(),
    ]);

    const estadoAlumno = (perfilRaw?.estado ?? perfilRaw?.alumno?.estado ?? '')
        .toString()
        .trim()
        .toLowerCase();

    const enCurso = historial.filter(h => h.estado === 'Cursando');
    const finalizadas = historial.filter(h => h.estado !== 'Cursando');

    if (estadoAlumno === 'egresado') {
        return (
            <EgresadoHistorialView
                historial={historial}
                carreras={Array.isArray(perfilRaw?.carreras) ? perfilRaw.carreras : []}
            />
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <GraduationCap className="text-primary" /> Situación Académica
                </h1>
                <p className="text-muted-foreground text-sm">Resumen de tu rendimiento, asistencias y notas.</p>
            </div>

            <SituacionAcademicaTabs enCurso={enCurso} finalizadas={finalizadas} />
        </div>
    );
}