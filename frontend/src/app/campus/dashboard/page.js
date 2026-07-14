import { apiFetch } from '@/lib/api';
import { PerfilCard } from './components/PerfilCard';
import { IngresoCard } from './components/IngresoCard';
import { DashboardClient } from './components/DashboardClient';

export default async function DashboardAlumno() {
    // ── Fetch de datos en el servidor (SSR) ──
    const [resPerfil, resLegajos] = await Promise.all([
        apiFetch('/user', { next: { tags: ['dashboard-perfil'] } }),
        apiFetch('/alumno/legajos', { next: { tags: ['dashboard-legajos'] } }),
    ]);

    const data = await resPerfil.json();
    const legajosRaw = await resLegajos.json();
    const legajos = Array.isArray(legajosRaw) ? legajosRaw : [];

    const docsIngreso = data?.documentacion || {};

    return (
        <div className="space-y-6 pb-20 max-w-6xl mx-auto">

            {/* Card de perfil con banner, avatar y datos personales */}
            <PerfilCard data={data} />

            {/* Grid: documentación de ingreso (izq) | legajos con upload interactivo (der) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-1">
                    <IngresoCard docsIngreso={docsIngreso} />
                </div>

                <div className="lg:col-span-2">
                    <DashboardClient legajos={legajos} />
                </div>

            </div>
        </div>
    );
}