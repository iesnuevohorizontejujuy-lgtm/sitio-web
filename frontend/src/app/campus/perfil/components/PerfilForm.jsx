'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { actualizarPerfilAction } from '@/components/campus-topbar-actions';
import { useRouter } from 'next/navigation';
import { UsernameForm } from './UsernameForm';
import { DatosPersonalesForm } from './DatosPersonalesForm';

export function PerfilForm({ data, localidades = [] }) {
    const alumno = data?.alumno || {};
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
        formData.set('telefono', alumno.telefono || '');
        formData.set('domicilio', alumno.domicilio || '');
        formData.set('fecha_nacimiento', (data?.fecha_nacimiento || alumno.fecha_nacimiento || '').slice(0, 10));
        formData.set('localidad_id', String(data?.localidad_id || alumno.localidad_id || ''));

        if (fotoPerfilFile) {
            formData.set('foto_perfil', fotoPerfilFile);
        }

        return formData;
    };

    const handleSubmitUsername = async (e) => {
        e.preventDefault();
        setLoadingUsername(true);

        const result = await actualizarPerfilAction(buildUsernameFormData());

        if (result.error) {
            toast.error(result.error);
            setLoadingUsername(false);
            return;
        }

        toast.success('Perfil actualizado correctamente');

        // Actualizamos el nombre de usuario
        if (result.userName) {
            setUserName(result.userName);
        }

        // AHORA: Si se subió una foto, actualizamos los estados de la imagen
        if (result.foto_perfil) {
            setFotoPerfilActual(result.foto_perfil);
            setFotoPerfilFile(null); // Limpiamos el archivo pendiente
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Limpiamos el input file
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

    const handleUserNameChange = (e) => {
        setUserName(e.target.value);
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
                        alumno.telefono || '',
                        alumno.domicilio || '',
                        data?.fecha_nacimiento || alumno.fecha_nacimiento || '',
                        String(data?.localidad_id || alumno.localidad_id || ''),
                        data?.proxima_edicion_datos_personales || '',
                        String(data?.puede_editar_datos_personales ?? true),
                    ].join('|')}
                    data={data}
                    alumno={alumno}
                    localidades={localidades}
                    userName={userName}
                />
            </CardContent>
        </Card>
    );
}
