'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { actualizarPerfilDocenteAction } from '@/app/campus/docente/actions';
import { useRouter } from 'next/navigation';
import { UsernameForm } from './UsernameForm';
import { DatosPersonalesForm } from './DatosPersonales';

export function PerfilForm({ data }) {
    const docente = data?.docente || {};
    const fileInputRef = useRef(null);
    const router = useRouter();

    const [userName, setUserName] = useState(data?.userName || '');
    const [fotoPerfilFile, setFotoPerfilFile] = useState(null);
    const [fotoPerfilActual, setFotoPerfilActual] = useState(data?.foto_perfil || '');
    const [loadingUsername, setLoadingUsername] = useState(false);

    const nombreCompleto = `${data?.nombre || ''} ${data?.apellido || ''}`.trim();

    const fotoPerfilPreview = useMemo(() => {
        if (!fotoPerfilFile) {
            return fotoPerfilActual;
        }

        return URL.createObjectURL(fotoPerfilFile);
    }, [fotoPerfilActual, fotoPerfilFile]);

    useEffect(() => {
        if (!fotoPerfilFile) {
            return undefined;
        }

        return () => {
            URL.revokeObjectURL(fotoPerfilPreview);
        };
    }, [fotoPerfilFile, fotoPerfilPreview]);

    const buildUsernameFormData = () => {
        const formData = new FormData();
        formData.set('nombre', data?.nombre || '');
        formData.set('apellido', data?.apellido || '');
        formData.set('userName', userName);
        formData.set('telefono', docente.telefono || data?.telefono || '');
        formData.set('domicilio', docente.domicilio || data?.domicilio || '');
        formData.set('fecha_nacimiento', (data?.fecha_nacimiento || docente.fecha_nacimiento || '').slice(0, 10));
        formData.set('titulo_academico', data?.titulo_academico || docente.titulo_academico || '');

        if (fotoPerfilFile) {
            formData.set('foto_perfil', fotoPerfilFile);
        }

        return formData;
    };

    const handleSubmitUsername = async (e) => {
        e.preventDefault();
        setLoadingUsername(true);

        const result = await actualizarPerfilDocenteAction(buildUsernameFormData());

        if (result.error) {
            toast.error(result.error);
            setLoadingUsername(false);
            return;
        }

        toast.success('Perfil actualizado correctamente');

        if (result.userName) {
            setUserName(result.userName);
        }

        if (result.foto_perfil) {
            setFotoPerfilActual(result.foto_perfil);
            setFotoPerfilFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }

        router.refresh();
        setLoadingUsername(false);
    };

    const handleFotoPerfilChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast.error('Seleccioná una imagen válida');
            e.target.value = '';
            return;
        }

        setFotoPerfilFile(file);
    };

    return (
        <Card className="rounded-3xl border border-border/70 bg-card shadow-sm overflow-hidden">
            <UsernameForm
                fileInputRef={fileInputRef}
                fotoPerfilPreview={fotoPerfilPreview}
                fotoPerfilFile={fotoPerfilFile}
                onFotoPerfilChange={handleFotoPerfilChange}
                onSelectFotoPerfil={() => fileInputRef.current?.click()}
                nombreCompleto={nombreCompleto}
                dni={data?.dni}
                email={data?.email}
                onSubmit={handleSubmitUsername}
                loadingUsername={loadingUsername}
            />

            <CardContent className="px-5 py-6 md:px-8">
                <DatosPersonalesForm
                    key={[
                        data?.nombre || '',
                        data?.apellido || '',
                        docente.telefono || data?.telefono || '',
                        docente.domicilio || data?.domicilio || '',
                        data?.fecha_nacimiento || docente.fecha_nacimiento || '',
                        data?.titulo_academico || docente.titulo_academico || '',
                    ].join('|')}
                    data={data}
                    docente={docente}
                    userName={userName}
                />
            </CardContent>
        </Card>
    );
}
