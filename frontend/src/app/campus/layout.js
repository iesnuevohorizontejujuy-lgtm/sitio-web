import { getSession } from '@/lib/auth';
import { CampusSidebar } from '@/components/campus-sidebar';
import { CampusTopbar } from '@/components/campus-topbar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Toaster } from 'sonner';
import { apiFetch } from '@/lib/api';

export default async function CampusLayout({ children }) {
    const session = await getSession();

    if (!session) {
        return (
            <>
                {children}
                <Toaster richColors position="top-right" />
            </>
        );
    }

    if (session.role === 'docente') {
        return (
            <>
                {children}
                <Toaster richColors position="top-right" />
            </>
        );
    }

    // Traer el estado del alumno desde la API
    let alumnoEstado = 'activo';
    try {
        const perfilRes = await apiFetch('/alumno/perfil', { cache: 'no-store' });
        const perfilData = await perfilRes.json();
        const estado = perfilData?.estado ?? perfilData?.alumno?.estado;

        if (typeof estado === 'string' && estado.trim()) {
            alumnoEstado = estado.trim().toLowerCase();
        }
    } catch (error) {
        console.error('Error fetching alumno profile:', error);
    }

    return (
        <SidebarProvider>
            <CampusSidebar userName={session.userName} role={session.role} alumnoEstado={alumnoEstado} />

            <SidebarInset>
                <CampusTopbar />

                <main className="min-h-[calc(100vh-3.5rem)] bg-background px-4 py-5 md:min-h-[calc(100vh-4rem)] md:px-6 md:py-6">
                    {children}
                </main>
            </SidebarInset>

            <Toaster richColors position="top-right" />
        </SidebarProvider>
    );
}