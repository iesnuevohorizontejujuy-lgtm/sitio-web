import { apiFetch } from '@/lib/api';
import CursosAgendaClient from './components/CursosAgendaClient';

export default async function CursosAgenda() {
    const res = await apiFetch('/alumno/agenda', {
        next: { tags: ['alumno-agenda'], revalidate: 0 },
    });
    const data = await res.json();
    const cursos = Array.isArray(data?.cursos) ? data.cursos : [];

    return <CursosAgendaClient cursos={cursos} />;
}