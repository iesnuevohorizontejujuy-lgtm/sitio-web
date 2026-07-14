'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { subirDocumentoAction } from '../actions';
import { LegajosCard } from './LegajosCard';

/**
 * Client Component delgado que solo maneja la interactividad de subida de archivos.
 * Los datos de legajos llegan como props desde el Server Component padre.
 */
export function DashboardClient({ legajos: initialLegajos }) {
    const [uploadingId, setUploadingId] = useState(null);

    const handleFileUpload = async (e, docId) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('El archivo supera el límite de 5 MB.');
            return;
        }

        setUploadingId(docId);

        const formData = new FormData();
        formData.append('documento_id', docId);
        formData.append('archivo', file);

        try {
            const result = await subirDocumentoAction(formData);
            if (result.success) {
                toast.success('Documento subido correctamente.', {
                    description: 'Será revisado por el equipo de administración.',
                });
            } else {
                toast.error(result.error || 'Error al subir el documento.');
            }
        } catch {
            toast.error('Error al subir el documento.', {
                description: 'Verificá tu conexión e intentá nuevamente.',
            });
        } finally {
            setUploadingId(null);
        }
    };

    return (
        <LegajosCard
            legajos={initialLegajos}
            onUpload={handleFileUpload}
            uploadingId={uploadingId}
        />
    );
}
