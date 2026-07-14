import { apiFetch } from '@/lib/api';
import { BeneficiosClient } from './components/BeneficiosClient';
import { HeartHandshake } from 'lucide-react';

export default async function BeneficiosPage() {
    let beneficios = [];
    let apiError = null;
    try {
        const res = await apiFetch('/beneficios', { cache: 'no-store' });
        if (res.ok) {
            beneficios = await res.json();
        } else {
            apiError = `HTTP ${res.status}: ${await res.text()}`;
            console.error("API ERROR FETCHING BENEFICIOS:", apiError);
        }
    } catch (e) {
        apiError = `Fetch Exception: ${e.message}`;
        console.error('Error fetching beneficios', e);
    }

    return (
        <div className="max-w-6xl mx-auto pb-20 px-4 md:px-8 mt-6">
            <div className="mb-10 text-center md:text-left">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6 md:hidden">
                     <HeartHandshake className="w-8 h-8" />
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground flex items-center justify-center md:justify-start gap-4">
                    <HeartHandshake className="w-10 h-10 text-primary hidden md:block" />
                    Beneficios del Estudiante
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-muted-foreground mx-auto md:mx-0">
                    Aprovechá los beneficios exclusivos que el Instituto tiene para vos. Explorá las opciones, inscribite y seguí creciendo con nosotros.
                </p>
            </div>

            <div className="mt-12">
                {apiError ? (
                    <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
                        <strong className="block mb-2">Error de conexión con la API:</strong>
                        <pre className="text-xs whitespace-pre-wrap">{apiError}</pre>
                        <p className="mt-2 text-sm">Por favor captura una imagen de este error o repórtalo.</p>
                    </div>
                ) : (
                    <BeneficiosClient beneficios={beneficios} />
                )}
            </div>
        </div>
    );
}