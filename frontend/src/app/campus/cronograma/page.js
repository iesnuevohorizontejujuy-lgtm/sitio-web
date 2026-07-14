import { apiFetch } from '@/lib/api';
import { Calendar, Clock, MapPin, User, BookOpen } from 'lucide-react';

export default async function Cronograma() {
    const res = await apiFetch('/alumno/cronograma', {
        next: { tags: ['alumno-cronograma'], revalidate: 600 },
    });
    const horario = await res.json();

    const dias = Object.keys(horario);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Calendar className="text-primary" /> Mi Cronograma
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Horarios de cursada correspondientes a tu comisión asignada.
                </p>
            </div>

            {dias.length === 0 ? (
                <div className="bg-card p-8 rounded-xl shadow-sm border border-border text-center">
                    <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="text-muted-foreground" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Sin horarios asignados</h3>
                    <p className="text-muted-foreground text-sm mt-2">
                        Aún no has sido asignado a un curso con horarios definidos. Contacta a administración.
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {dias.map((dia) => (
                        <div key={dia} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Encabezado del Día */}
                            <h2 className="text-lg font-bold text-accent-foreground mb-4 border-l-4 border-primary pl-3 uppercase tracking-wide">
                                {dia}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {horario[dia].map((clase) => (
                                    <div key={clase.id} className="bg-card rounded-xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow relative overflow-hidden group">
                                        {/* Decoración lateral */}
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent-foreground"></div>

                                        <div className="pl-2">
                                            {/* Materia */}
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="font-bold text-foreground text-lg leading-tight">
                                                    {clase.materia.nombre}
                                                </h3>
                                                <BookOpen size={18} className="text-muted-foreground/30 group-hover:text-primary transition-colors" />
                                            </div>

                                            {/* Detalles */}
                                            <div className="space-y-2 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={16} className="text-accent-foreground" />
                                                    <span className="font-medium bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
                                                        {clase.hora_inicio.slice(0, 5)} - {clase.hora_fin.slice(0, 5)} hs
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <User size={16} className="text-muted-foreground" />
                                                    <span>Prof. {clase.docente.apellido}, {clase.docente.nombre}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={16} className="text-muted-foreground" />
                                                    <span className="text-muted-foreground">{clase.aula || 'Aula Base'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}