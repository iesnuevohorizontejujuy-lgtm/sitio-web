'use client';

import { useState } from 'react';
import { inscribirBeneficioAction, pagarBeneficioAction } from '../actions';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { CheckCircle2, Loader2, CreditCard, HeartHandshake } from 'lucide-react';
import { toast } from 'sonner';

export function BeneficioCard({ beneficio }) {
    const [loading, setLoading] = useState(false);
    const [inscripto, setInscripto] = useState(beneficio.inscripto);
    const [pagoInfo, setPagoInfo] = useState(beneficio.pago);

    const handleInscribir = async () => {
        setLoading(true);
        try {
            const res = await inscribirBeneficioAction(beneficio.id);
            if (res.success) {
                setInscripto(true);
                toast.success('¡Te has inscripto correctamente al beneficio!');
            } else {
                toast.error(res.message || 'Error al inscribirse');
            }
        } catch (err) {
            toast.error('Ocurrió un error inesperado. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handlePagar = async () => {
        setLoading(true);
        try {
            const res = await pagarBeneficioAction(beneficio.id);
            if (res.success && res.data?.init_point) {
                window.location.href = res.data.init_point;
            } else {
                if (res.message === 'El pago ya fue aprobado.') {
                    setPagoInfo({ status: 'approved' });
                    toast.success('El pago ya estaba aprobado. Ahora puedes inscribirte.');
                } else {
                    toast.error(res.message || 'Error al conectar con MercadoPago');
                }
            }
        } catch (err) {
            toast.error('Ocurrió un error inesperado al generar el pago.');
        } finally {
            setLoading(false);
        }
    };

    const requierePago = beneficio.requiere_pago;
    const isApproved = pagoInfo?.status === 'approved';
    const isPending = pagoInfo?.status === 'pending';
    
    // Formatting currency
    const formatter = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0
    });

    return (
        <Card className="flex flex-col h-full border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4 border-b border-border/20">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                    <HeartHandshake className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                    {beneficio.nombre}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pt-6 text-muted-foreground text-sm leading-relaxed">
                <p className="mb-4">{beneficio.descripcion || 'Sin descripción detallada.'}</p>
                
                {requierePago && !inscripto && (
                    <div className="mt-6 flex items-center justify-between bg-muted/50 p-4 rounded-xl">
                        <span className="font-semibold text-foreground tracking-wide uppercase text-xs">Arancel</span>
                        <span className="text-2xl font-black text-primary">{formatter.format(beneficio.monto)}</span>
                    </div>
                )}
            </CardContent>
            
            <CardFooter className="pt-2 pb-6 px-6">
                {inscripto ? (
                    <div className="w-full flex items-center justify-center gap-2 text-green-700 bg-green-100 dark:bg-green-900/40 px-4 py-3 rounded-xl font-semibold border border-green-200 dark:border-green-900 shadow-sm animate-in zoom-in-95 duration-300">
                        <CheckCircle2 className="w-5 h-5" />
                        Te has inscripto
                    </div>
                ) : requierePago && !isApproved ? (
                    <div className="w-full space-y-3">
                        {isPending && (
                            <div className="text-xs text-center text-amber-600 bg-amber-50 dark:bg-amber-950/50 p-2 rounded-md font-medium">
                                Hay un pago pendiente o en evaluación
                            </div>
                        )}
                        <Button 
                            onClick={handlePagar} 
                            disabled={loading}
                            className="w-full h-12 text-sm md:text-base font-bold shadow-md hover:shadow-lg transition-transform active:scale-95"
                            variant="default"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CreditCard className="w-5 h-5 mr-2" />}
                            {isPending ? 'Reintentar Pago' : 'Pagar para Inscribirse'}
                        </Button>
                    </div>
                ) : (
                    <Button 
                        onClick={handleInscribir} 
                        disabled={loading}
                        variant={requierePago ? "outline" : "default"}
                        className={`w-full h-12 text-sm md:text-base font-bold shadow-sm transition-transform active:scale-95 ${requierePago ? 'border-primary text-primary hover:bg-primary/5' : ''}`}
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                        {requierePago ? 'Completar Inscripción' : 'Inscribirme Gratis'}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
