'use server';

import { apiFetch } from '@/lib/api';
import { revalidateTag } from 'next/cache';

export async function getNotificacionesAction() {
    try {
        const res = await apiFetch('/notificaciones');
        if (res.ok) {
            return await res.json();
        }
        return [];
    } catch (error) {
        console.error("Error al obtener notificaciones:", error);
        return [];
    }
}

export async function marcarTodasComoLeidasAction() {
    try {
        await apiFetch('/notificaciones/read-all', { method: 'POST' });
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function eliminarNotificacionAction(id) {
    try {
        await apiFetch(`/notificaciones/${id}`, { method: 'DELETE' });
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function actualizarPerfilAction(formData) {
    const body = new FormData();

    body.set('nombre', formData.get('nombre'));
    body.set('apellido', formData.get('apellido'));
    body.set('telefono', formData.get('telefono') || '');
    body.set('domicilio', formData.get('domicilio') || '');
    body.set('fecha_nacimiento', formData.get('fecha_nacimiento') || '');
    body.set('localidad_id', formData.get('localidad_id') || '');

    const fotoPerfil = formData.get('foto_perfil');

    if (fotoPerfil instanceof File && fotoPerfil.size > 0) {
        body.set('foto_perfil', fotoPerfil);
    }

    const res = await apiFetch('/alumno/perfil', {
        method: 'PUT',
        body,
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return { error: data.message || 'Error al actualizar el perfil' };
    }

    const data = await res.json().catch(() => ({}));

    revalidateTag('dashboard-perfil');
    revalidateTag('alumno-perfil');
    return { success: true, foto_perfil: data.foto_perfil || null };
}