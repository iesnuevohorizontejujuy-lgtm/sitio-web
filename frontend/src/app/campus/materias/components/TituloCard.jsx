import { GraduationCap } from 'lucide-react';

export function TituloCard({ title = "Inscripción Académica" }) {
    const añoActual = new Date().getFullYear();
    const sub = `Ciclo Lectivo ${añoActual}`;

    return (
        <div className="flex flex-col mb-8">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary text-white rounded-lg">
                    <GraduationCap size={24} />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                    {title}
                </h1>
            </div>
            <p className="text-muted-foreground font-medium ml-12">
                {sub}
            </p>
        </div>
    );
}
