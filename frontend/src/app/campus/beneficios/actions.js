'use server';

import { apiFetch } from '@/lib/api';

export async function inscribirBeneficioAction(beneficioId) {
    try {
        const res = await apiFetch(`/beneficios/${beneficioId}/inscribir`, {
            method: 'POST',
        });
        
        const data = await res.json();
        return { success: res.ok, message: data.message, data };
    } catch (e) {
        return { success: false, message: e.message || 'Error de conexión' };
    }
}

export async function pagarBeneficioAction(beneficioId) {
    try {
        const res = await apiFetch(`/beneficios/${beneficioId}/pagar`, {
            method: 'POST',
        });
        
        const data = await res.json();
        return { success: res.ok, message: data.message, data };
    } catch (e) {
        return { success: false, message: e.message || 'Error de conexión' };
    }
}
