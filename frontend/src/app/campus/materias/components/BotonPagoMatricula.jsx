'use client';

import { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { generarPagoMatriculaAction } from '../actions';

export function BotonPagoMatricula() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePago = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await generarPagoMatriculaAction();

            if (result.success && result.init_point) {
                window.location.href = result.init_point;
            } else {
                setError(result.error);
            }
        } catch {
            setError('Ocurrió un error inesperado al procesar la solicitud.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-3">
            {error && (
                <div className="text-sm font-medium text-destructive-foreground bg-destructive border border-destructive/20 py-2.5 px-5 rounded-xl">
                    {error}
                </div>
            )}

            <button
                onClick={handlePago}
                disabled={loading}
                className="
                    inline-flex items-center gap-2.5
                    bg-primary hover:bg-primary/90 active:scale-95
                    disabled:opacity-60 disabled:cursor-not-allowed
                    text-primary-foreground
                    font-bold text-sm uppercase tracking-widest
                    py-3.5 px-10 rounded-full
                    transition-all duration-150
                    shadow-lg shadow-primary/20
                "
            >
                {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                ) : (
                    <CreditCard size={18} />
                )}
                {loading ? 'Generando…' : 'Pagar Inscripción'}
            </button>

            <p className="text-xs text-muted-foreground mt-1">
                Serás redirigido a Mercado Pago de forma segura
            </p>
        </div>
    );
}