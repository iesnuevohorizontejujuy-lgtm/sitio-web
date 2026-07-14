'use client';

import { BeneficioCard } from './BeneficioCard';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function BeneficiosClient({ beneficios }) {
    const searchParams = useSearchParams();
    
    useEffect(() => {
        const pagoStatus = searchParams.get('pago');
        if (pagoStatus === 'success') {
            toast.success('El pago de su beneficio se ha registrado con éxito. Ya puede inscribirse.');
        } else if (pagoStatus === 'failure') {
            toast.error('Hubo un error al procesar el pago. Por favor, intente nuevamente.');
        } else if (pagoStatus === 'pending') {
            toast.info('Su pago está siendo procesado.');
        }
    }, [searchParams]);

    if (!beneficios || beneficios.length === 0) {
        return (
            <div className="text-center py-20 text-muted-foreground">
                No hay beneficios disponibles en este momento.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {beneficios.map(beneficio => (
                <BeneficioCard key={beneficio.id} beneficio={beneficio} />
            ))}
        </div>
    );
}
