'use server';

import { apiFetch } from '@/lib/api';

export async function generarPagoMatriculaAction() {
    try {
        const response = await apiFetch('/inscripciones/generar-pago', {
            method: 'POST',
            body: JSON.stringify({}),
        });

        const text = await response.text();
        let data;

        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error("Respuesta de Laravel NO es JSON:", text);
            return { success: false, error: `Error del servidor (${response.status}): Respuesta no válida.` };
        }

        if (response.ok && data.init_point) {
            return { success: true, init_point: data.init_point };
        } else {
            const errorMsg = data.error || data.message || `Error HTTP: ${response.status}`;
            return { success: false, error: errorMsg };
        }
    } catch (error) {
        console.error("Error en Server Action generarPagoMatricula:", error);
        return { success: false, error: "Ocurrió un error de conexión con el servidor interno." };
    }
}