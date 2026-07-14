import { apiFetch } from '@/lib/api';
import { PerfilForm } from './components/PerfilForm';

export default async function DocentePerfilPage() {
    const resPerfil = await apiFetch('/docente/perfil', { cache: 'no-store' });
    const data = await resPerfil.json();

    return (
        <div className="w-full max-w-5xl mx-auto px-2 md:px-4">
            <PerfilForm data={data} />
        </div>
    );
}
