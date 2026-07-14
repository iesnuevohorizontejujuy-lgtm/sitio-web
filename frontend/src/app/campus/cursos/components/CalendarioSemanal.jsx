import { Clock, MapPin } from 'lucide-react';

export function CalendarioSemanal({ horarios = {} }) {
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const formatTime = (t) => (t ? t.slice(0, 5) : '');

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {diasSemana.map((dia) => (
                <div key={dia} className="flex flex-col gap-3">
                    <div className="bg-primary text-primary-foreground text-center py-2 rounded-t-lg font-bold text-xs uppercase tracking-wider shadow-sm">
                        {dia}
                    </div>
                    <div className="space-y-3 bg-muted p-2 rounded-b-lg min-h-[150px]">
                        {horarios[dia] && horarios[dia].length > 0 ? (
                            horarios[dia].map((clase) => (
                                <div
                                    key={clase.id}
                                    className="bg-card p-3 rounded shadow-sm border-l-4 border-primary hover:shadow-md transition group"
                                >
                                    <h3 className="font-bold text-foreground text-xs leading-tight mb-1 group-hover:text-primary">
                                        {clase.materia.nombre}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1 font-mono bg-muted w-fit px-1 rounded">
                                        <Clock size={10} />
                                        <span>
                                            {formatTime(clase.hora_inicio)} -{' '}
                                            {formatTime(clase.hora_fin)}
                                        </span>
                                    </div>
                                    {clase.aula && (
                                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                            <MapPin size={10} />
                                            <span>{clase.aula}</span>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <span className="text-[10px] text-muted-foreground/50 font-medium italic">
                                    Libre
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
