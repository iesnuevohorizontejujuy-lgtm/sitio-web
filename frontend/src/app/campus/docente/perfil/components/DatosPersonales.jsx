'use client';

import { useState } from 'react';
import { User, Phone, MapPin, Save, Loader2, CalendarDays, GraduationCap, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { actualizarPerfilDocenteAction } from '@/app/campus/docente/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function DatosPersonalesForm({ data, docente = {}, userName }) {
    const router = useRouter();
    const [nombre, setNombre] = useState(data?.nombre || '');
    const [apellido, setApellido] = useState(data?.apellido || '');
    const [telefono, setTelefono] = useState(docente.telefono || data?.telefono || '');
    const [domicilio, setDomicilio] = useState(docente.domicilio || data?.domicilio || '');
    const [fechaNacimiento, setFechaNacimiento] = useState(
        (data?.fecha_nacimiento || docente.fecha_nacimiento || '').slice(0, 10)
    );
    const [tituloAcademico, setTituloAcademico] = useState(
        data?.titulo_academico || docente.titulo_academico || ''
    );
    const [loading, setLoading] = useState(false);
    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [proximaEdicionDatosPersonales, setProximaEdicionDatosPersonales] = useState(
        data?.proxima_edicion_datos_personales || null
    );
    const [puedeEditarDatosPersonales, setPuedeEditarDatosPersonales] = useState(
        data?.puede_editar_datos_personales ?? true
    );

    const seCambianCamposRestringidos =
        nombre !== (data?.nombre || '')
        || apellido !== (data?.apellido || '')
        || telefono !== (docente.telefono || data?.telefono || '')
        || fechaNacimiento !== ((data?.fecha_nacimiento || docente.fecha_nacimiento || '').slice(0, 10))
        || domicilio !== (docente.domicilio || data?.domicilio || '')
        || tituloAcademico !== (data?.titulo_academico || docente.titulo_academico || '');

    const tieneCambios =
        nombre !== (data?.nombre || '')
        || apellido !== (data?.apellido || '')
        || telefono !== (docente.telefono || data?.telefono || '')
        || domicilio !== (docente.domicilio || data?.domicilio || '')
        || fechaNacimiento !== ((data?.fecha_nacimiento || docente.fecha_nacimiento || '').slice(0, 10))
        || tituloAcademico !== (data?.titulo_academico || docente.titulo_academico || '');

    const buildFormData = () => {
        const formData = new FormData();
        formData.set('nombre', nombre);
        formData.set('apellido', apellido);
        formData.set('userName', userName || '');
        formData.set('telefono', telefono);
        formData.set('domicilio', domicilio);
        formData.set('fecha_nacimiento', fechaNacimiento);
        formData.set('titulo_academico', tituloAcademico);

        return formData;
    };

    const handlePrepararGuardado = (e) => {
        e.preventDefault();

        if (!puedeEditarDatosPersonales) {
            toast.error(
                proximaEdicionDatosPersonales
                    ? `Vas a poder volver a cambiar tus datos personales desde el ${new Date(`${proximaEdicionDatosPersonales}T00:00:00`).toLocaleDateString('es-AR')}.`
                    : 'No podés modificar tus datos personales por el período de seguridad de 21 días.'
            );
            return;
        }

        if (!tieneCambios) {
            toast.info('No hay cambios pendientes para guardar en Datos Personales');
            return;
        }

        setMostrarAlerta(true);
    };

    const handleConfirmarGuardado = async () => {
        setLoading(true);

        const result = await actualizarPerfilDocenteAction(buildFormData());

        if (result.error) {
            toast.error(result.error);
            setLoading(false);
            return;
        }

        toast.success('Datos personales actualizados correctamente');

        if (result.proxima_edicion_datos_personales) {
            setProximaEdicionDatosPersonales(result.proxima_edicion_datos_personales);
            if (seCambianCamposRestringidos) {
                setPuedeEditarDatosPersonales(false);
            }
        }

        setMostrarAlerta(false);
        router.refresh();
        setLoading(false);
    };

    return (
        <>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Datos Personales
            </h2>
            <p className="mb-4 text-xs text-muted-foreground">
                Por seguridad, los datos personales se pueden cambiar cada 21 días.
            </p>
            {proximaEdicionDatosPersonales && !puedeEditarDatosPersonales ? (
                <div className="mb-4 rounded-xl border border-amber-400/40 bg-amber-50/80 p-3 text-xs text-amber-900 dark:border-amber-300/30 dark:bg-amber-500/10 dark:text-amber-200">
                    Vas a poder volver a modificar tus datos personales desde el {new Date(`${proximaEdicionDatosPersonales}T00:00:00`).toLocaleDateString('es-AR')}.
                </div>
            ) : null}

            <form onSubmit={handlePrepararGuardado} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="nombre" className="flex items-center gap-2 text-sm font-medium ">
                            <User size={14} className="text-muted-foreground" />
                            Nombre
                        </Label>
                        <Input
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            maxLength={100}
                            disabled={!puedeEditarDatosPersonales}
                            className="rounded-xl border border-border/70"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="apellido" className="flex items-center gap-2 text-sm font-medium">
                            <User size={14} className="text-muted-foreground" />
                            Apellido
                        </Label>
                        <Input
                            id="apellido"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            required
                            maxLength={100}
                            disabled={!puedeEditarDatosPersonales}
                            className="rounded-xl border border-border/70"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="telefono" className="flex items-center gap-2 text-sm font-medium">
                        <Phone size={14} className="text-muted-foreground" />
                        Teléfono
                    </Label>
                    <Input
                        id="telefono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        maxLength={30}
                        placeholder="Ej: 388-4001234"
                        disabled={!puedeEditarDatosPersonales}
                        className="rounded-xl border border-border/70"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="fecha_nacimiento" className="flex items-center gap-2 text-sm font-medium">
                            <CalendarDays size={14} className="text-muted-foreground" />
                            Fecha de nacimiento
                        </Label>
                        <Input
                            id="fecha_nacimiento"
                            type="date"
                            value={fechaNacimiento}
                            onChange={(e) => setFechaNacimiento(e.target.value)}
                            disabled={!puedeEditarDatosPersonales}
                            className="rounded-xl border border-border/70"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="titulo_academico" className="flex items-center gap-2 text-sm font-medium">
                            <GraduationCap size={14} className="text-muted-foreground" />
                            Título Académico
                        </Label>
                        <Input
                            id="titulo_academico"
                            value={tituloAcademico}
                            onChange={(e) => setTituloAcademico(e.target.value)}
                            maxLength={255}
                            placeholder="Ej: Licenciado en Informática"
                            disabled={!puedeEditarDatosPersonales}
                            className="rounded-xl border border-border/70"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="domicilio" className="flex items-center gap-2 text-sm font-medium">
                        <MapPin size={14} className="text-muted-foreground" />
                        Dirección
                    </Label>
                    <Input
                        id="domicilio"
                        value={domicilio}
                        onChange={(e) => setDomicilio(e.target.value)}
                        maxLength={255}
                        placeholder="Ej: Av. Libertador 1234, San Salvador de Jujuy"
                        disabled={!puedeEditarDatosPersonales}
                        className="rounded-xl border border-border/70"
                    />
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        disabled={loading || !tieneCambios}
                        className="w-full gap-2 rounded-xl sm:w-auto"
                    >
                        {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Save size={16} />
                        )}
                        {loading ? 'Guardando...' : 'Guardar Datos Personales'}
                    </Button>
                </div>
            </form>

            <AlertDialog open={mostrarAlerta} onOpenChange={setMostrarAlerta}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300">
                            <AlertTriangle size={18} />
                        </div>
                        <AlertDialogTitle>Confirmar guardado de datos personales</AlertDialogTitle>
                        <AlertDialogDescription>
                            Si continuás, Nombre, Apellido, Teléfono, Fecha de nacimiento, Dirección y Título académico no se podrán modificar por 21 días.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setMostrarAlerta(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmarGuardado}
                            disabled={loading}
                            className="gap-2"
                        >
                            {loading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Save size={16} />
                            )}
                            {loading ? 'Guardando...' : 'Confirmar y guardar'}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
