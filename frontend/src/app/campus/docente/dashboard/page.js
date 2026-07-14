import Link from 'next/link';
import { BarChart2 } from 'lucide-react';
import { fetchDocentePerfil, fetchDocenteMaterias, fetchPlanillaNotas } from '../actions';
import { KpiCards } from './components/KpiCards';
import { DocenteDashboardCharts } from './components/DocenteDashboardCharts';
import { MateriasGrid } from './components/MateriasGrid';
import { DashboardInfoDialog } from './components/DashboardInfoDialog';

// ─── Cálculo de métricas (se ejecuta en el servidor) ─────────────────────────
function calcularEstadisticas(planillas) {
    const condicionCount = { Promocionado: 0, Regularizado: 0, Libre: 0, Cursando: 0 };
    let totalAlumnos = 0;
    const asistenciaData = [];
    const tpData = [];
    // Set global para deduplicar alumnos que cursan varias materias con el mismo docente
    const alumnosDnisGlobal = new Set();

    planillas.forEach(({ materiaNombre, data }) => {
        if (!data?.alumnos?.length) return;

        const alumnos = data.alumnos;
        alumnos.forEach(al => { if (al.dni) alumnosDnisGlobal.add(al.dni); });
        totalAlumnos = alumnosDnisGlobal.size;

        alumnos.forEach(al => {
            const raw = al.estado_actual === 'cursando'
                ? (al.condicion_proyectada ?? 'Cursando')
                : al.estado_actual;

            const cond = typeof raw === 'string'
                ? raw.charAt(0).toUpperCase() + raw.slice(1)
                : 'Cursando';

            if (cond === 'Promocionado' || cond === 'Promocion' || cond === 'Promoción') condicionCount.Promocionado++;
            else if (cond === 'Regularizado' || cond === 'Regular')  condicionCount.Regularizado++;
            else if (cond === 'Libre')    condicionCount.Libre++;
            else                          condicionCount.Cursando++;
        });

        const avgAsist = Math.round(alumnos.reduce((s, a) => s + (a.stats?.asistencia ?? 0), 0) / alumnos.length);
        const avgTps   = Math.round(alumnos.reduce((s, a) => s + (a.stats?.tps ?? 0), 0) / alumnos.length);

        asistenciaData.push({ materia: materiaNombre, asistencia: avgAsist });
        tpData.push({ materia: materiaNombre, tps: avgTps });
    });

    const condicionData = Object.entries(condicionCount)
        .filter(([, v]) => v > 0)
        .map(([name, value]) => ({ name, value }));

    return {
        kpis: {
            totalAlumnos,
            totalMaterias: planillas.length,
            enPromocion: condicionCount.Promocionado,
            enLibre: condicionCount.Libre,
        },
        condicionData,
        asistenciaData,
        tpData,
    };
}

// ─── Página ───────────────────────────────────────────────────────────────────
export default async function DashboardDocente() {
    // 1. Perfil + materias en paralelo
    const [user, materias] = await Promise.all([
        fetchDocentePerfil(),
        fetchDocenteMaterias(),
    ]);

    const materiasArray = Array.isArray(materias) ? materias : [];
    const materiasActivas = materiasArray.filter(m => !m.cerrada);
    const cicloLectivo = materiasActivas[0]?.ciclo_lectivo ?? new Date().getFullYear();

    // 2. Planillas de notas en paralelo (solo materias del ciclo lectivo actual)
    const settled = await Promise.allSettled(
        materiasActivas.map(async mat => {
            const data = await fetchPlanillaNotas(String(mat.id));
            return { materiaNombre: mat.nombre, claseId: mat.id, data };
        })
    );
    const planillas = settled
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);

    // 3. Métricas
    const { kpis, condicionData, asistenciaData, tpData } = calcularEstadisticas(planillas);

    // 4. Agrupamiento carrera → módulo (solo materias activas)
    const materiasAgrupadas = materiasActivas.reduce((acc, mat) => {
        if (!acc[mat.carrera]) acc[mat.carrera] = {};
        if (!acc[mat.carrera][mat.modulo]) acc[mat.carrera][mat.modulo] = [];
        acc[mat.carrera][mat.modulo].push(mat);
        return acc;
    }, {});

    const greeting = user?.nombre ? `${user.nombre} ${user.apellido}` : 'Docente';

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-screen-xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">

                {/* ── ENCABEZADO ── */}
                <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4">
                    <div>
                        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
                            Campus Virtual · Docentes
                        </p>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground leading-tight">
                            Panel de Gestión
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Bienvenido,{' '}
                            <span className="font-semibold text-foreground">{greeting}</span>
                        </p>
                    </div>

                    {materiasActivas.length > 0 && (
                        <div className="sm:ml-auto flex items-center gap-2 self-start sm:self-auto shrink-0">
                            <DashboardInfoDialog />
                            <div className="flex items-center gap-1.5 bg-muted text-muted-foreground border px-3 py-1.5 rounded-full text-xs font-semibold">
                                Ciclo {cicloLectivo}
                            </div>
                            <div className="flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full text-xs font-bold">
                                <BarChart2 size={14} />
                                {materiasActivas.length}{' '}
                                {materiasActivas.length === 1 ? 'materia' : 'materias'}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── KPI CARDS ── */}
                {materiasActivas.length > 0 && (
                    <section>
                        <KpiCards stats={kpis} />
                    </section>
                )}

                {/* ── CHARTS ── */}
                {materiasActivas.length > 0 && (
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart2 size={16} className="text-primary" />
                            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                                Métricas Académicas
                            </h2>
                        </div>
                        <DocenteDashboardCharts
                            condicionData={condicionData}
                            asistenciaData={asistenciaData}
                            tpData={tpData}
                        />
                    </section>
                )}

                {/* ── GRILLA DE MATERIAS (dropdown por carrera) ── */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                            Mis Materias
                        </h2>
                    </div>
                    <MateriasGrid
                        materiasAgrupadas={materiasAgrupadas}
                        planillas={planillas}
                    />
                </section>

            </div>
        </div>
    );
}
