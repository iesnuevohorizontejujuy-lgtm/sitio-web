import Link from 'next/link';
import { Clock, Award, CheckCircle, XCircle, FileText } from 'lucide-react';

export function HistorialTable({ finalizadas, emptyMessage = 'Aún no has finalizado ninguna materia.' }) {
    if (finalizadas.length === 0) {
        return (
            <p className="text-muted-foreground text-sm bg-card p-6 rounded-lg border border-border shadow-sm text-center">
                {emptyMessage}
            </p>
        );
    }

    return (
        <div className="bg-card rounded-xl shadow overflow-hidden border border-border">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted text-muted-foreground uppercase text-xs font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Materia</th>
                            <th className="px-6 py-4">Módulo</th>
                            <th className="px-6 py-4 text-center">Año</th>
                            <th className="px-6 py-4 text-center">Condición</th>
                            <th className="px-6 py-4 text-center bg-muted">Nota Final</th>
                            <th className="px-6 py-4 text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {finalizadas.map(m => {
                            const condicion = m.condicion ?? m.estado;
                            let icon = <Clock size={14} />;
                            let colorClass = "bg-muted text-muted-foreground border-border";

                            if (condicion === 'Promoción' || condicion === 'Promocionado' || condicion === 'Examen Final' || condicion === 'Aprobado' || condicion === 'Equivalencia') { icon = <Award size={14} />; colorClass = "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"; }
                            if (condicion === 'Regularizado') { icon = <CheckCircle size={14} />; colorClass = "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"; }
                            if (condicion === 'Adeuda' || condicion === 'Libre') { icon = <XCircle size={14} />; colorClass = "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"; }

                            return (
                                <tr key={m.id} className="hover:bg-muted/50 transition">
                                    <td className="px-6 py-4 font-bold text-foreground">{m.materia}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{m.modulo ?? '-'}</td>
                                    <td className="px-6 py-4 text-muted-foreground text-center">{m.anio_cursada}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${colorClass} shadow-sm`}>
                                            {icon} {condicion}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold text-foreground bg-muted/20">
                                        {m.nota_final !== '-' ? (
                                            <span className="text-lg">{m.nota_final}</span>
                                        ) : (
                                            <span className="text-muted-foreground/40">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {(condicion === 'Regularizado' || condicion === 'Libre') ? (
                                            <Link
                                                href="/campus/mesas"
                                                className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition"
                                            >
                                                <FileText className="w-3 h-3" /> Inscribirse a Final
                                            </Link>
                                        ) : (
                                            <span className="text-muted-foreground/40">—</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
