import { apiFetch } from '@/lib/api';
import { publicFetch } from '@/lib/public-api';
import { PerfilForm } from './components/PerfilForm';

export default async function PerfilPage() {
    const [resPerfil, resLocalidades] = await Promise.all([
        apiFetch('/alumno/perfil', { next: { tags: ['dashboard-perfil'] } }),
        publicFetch('/public/localidades', { cache: 'no-store' }),
    ]);

    const [data, localidades] = await Promise.all([
        resPerfil.json(),
        resLocalidades.ok ? resLocalidades.json() : Promise.resolve([]),
    ]);

    return (
        <div className="w-full max-w-5xl mx-auto px-2 md:px-4 ">
            <PerfilForm data={data} localidades={localidades} />
        </div>
    );
}
