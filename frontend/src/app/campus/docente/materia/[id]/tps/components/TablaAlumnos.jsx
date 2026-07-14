import { Loader2, CheckSquare, Square } from 'lucide-react';

export function TablaAlumnos({ alumnos, tpId, claseCerrada, toggling, onToggle }) {
    if (!alumnos || alumnos.length === 0) {
        return (
            <p className="text-sm text-muted-foreground px-8 py-4">
                No hay alumnos inscriptos en esta clase.
            </p>
        );
    }

    return (
        <table className="w-full text-sm">
            <thead>
                <tr className="border-b">
                    <th className="text-left px-8 py-2 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                        Alumno
                    </th>
                    <th className="text-center px-4 py-2 font-medium text-muted-foreground text-xs uppercase tracking-wide w-28">
                        DNI
                    </th>
                    <th className="text-center px-4 py-2 font-medium text-muted-foreground text-xs uppercase tracking-wide w-28">
                        Entregado
                    </th>
                </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
                {alumnos.map(al => {
                    const key = `${tpId}-${al.cursada_id}`;
                    const cargando = !!toggling[key];
                    const partes = al.nombre.split(', ');

                    return (
                        <tr key={al.cursada_id} className="hover:bg-muted/50 transition">
                            <td className="px-8 py-2">
                                <span className="font-semibold">{partes[0]?.toUpperCase()}</span>
                                {partes[1] ? `, ${partes[1]}` : ''}
                            </td>
                            <td className="px-4 py-2 text-center text-muted-foreground">
                                {al.dni}
                            </td>
                            <td className="px-4 py-2 text-center">
                                {cargando ? (
                                    <Loader2
                                        size={16}
                                        className="animate-spin mx-auto text-muted-foreground"
                                    />
                                ) : (
                                    <button
                                        onClick={() => !claseCerrada && onToggle(tpId, al.cursada_id)}
                                        disabled={claseCerrada}
                                        className={[
                                            'mx-auto flex items-center justify-center w-7 h-7 rounded transition-all',
                                            al.aprobado
                                                ? 'text-teal-600 bg-teal-50 hover:bg-teal-100'
                                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100',
                                            claseCerrada
                                                ? 'cursor-default opacity-60'
                                                : 'cursor-pointer',
                                        ].join(' ')}
                                        title={al.aprobado ? 'Marcar como no entregado' : 'Marcar como entregado'}
                                    >
                                        {al.aprobado
                                            ? <CheckSquare size={18} strokeWidth={2.5} />
                                            : <Square size={18} strokeWidth={2} />}
                                    </button>
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
