import { DocenteSidebar } from '@/components/docente-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { CampusTopbar } from '@/components/campus-topbar';

export default function DocenteLayout({ children }) {
    return (
        <SidebarProvider>
            <DocenteSidebar />

            <SidebarInset>
                {/* ── TOP BAR  ── */}
                <CampusTopbar />

                {/* ── CONTENIDO ── */}
                <main className="flex-1 p-4 bg-background overflow-hidden">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}