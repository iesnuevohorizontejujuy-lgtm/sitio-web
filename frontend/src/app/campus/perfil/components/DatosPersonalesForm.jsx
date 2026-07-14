'use client';

import { useState } from 'react';
import { User, Phone, MapPin, Save, Loader2, CalendarDays, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { actualizarPerfilAction } from '@/components/campus-topbar-actions';
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

export function DatosPersonalesForm({ data, alumno = {}, localidades = [], userName }) {
    const router = useRouter();
    const [nombre, setNombre] = useState(data?.nombre || '');
    const [apellido, setApellido] = useState(data?.apellido || '');
    const [telefono, setTelefono] = useState(alumno.telefono || '');
    const [domicilio, setDomicilio] = useState(alumno.domicilio || '');
    const [fechaNacimiento, setFechaNacimiento] = useState(
        (data?.fecha_nacimiento || alumno.fecha_nacimiento || '').slice(0, 10)
    );
    const [localidadId, setLocalidadId] = useState(
        String(data?.localidad_id || alumno.localidad_id || '')
    );
    const [loadingDatosPersonales, setLoadingDatosPersonales] = useState(false);
    const [mostrarAlertaDatosPersonales, setMostrarAlertaDatosPersonales] = useState(false);
    const [proximaEdicionDatosPersonales, setProximaEdicionDatosPersonales] = useState(
        data?.proxima_edicion_datos_personales || null
    );
    const [puedeEditarDatosPersonales, setPuedeEditarDatosPersonales] = useState(
        data?.puede_editar_datos_personales ?? true
    );

    const seCambianCamposRestringidos =
        nombre !== (data?.nombre || '')
        || apellido !== (data?.apellido || '')
        || telefono !== (alumno.telefono || '')
        || fechaNacimiento !== ((data?.fecha_nacimiento || alumno.fecha_nacimiento || '').slice(0, 10))
        || localidadId !== String(data?.localidad_id || alumno.localidad_id || '')
        || domicilio !== (alumno.domicilio || '');

    const tieneCambiosDatosPersonales =
        nombre !== (data?.nombre || '')
        || apellido !== (data?.apellido || '')
        || telefono !== (alumno.telefono || '')
        || domicilio !== (alumno.domicilio || '')
        || fechaNacimiento !== ((data?.fecha_nacimiento || alumno.fecha_nacimiento || '').slice(0, 10))
        || localidadId !== String(data?.localidad_id || alumno.localidad_id || '');

    const buildPerfilFormData = () => {
        const formData = new FormData();
        formData.set('nombre', nombre);
        formData.set('apellido', apellido);
        formData.set('userName', userName || '');
        formData.set('telefono', telefono);
        formData.set('domicilio', domicilio);
        formData.set('fecha_nacimiento', fechaNacimiento);
        formData.set('localidad_id', localidadId);

        return formData;
    };

    const handlePrepararGuardadoDatosPersonales = (e) => {
        e.preventDefault();

        if (!puedeEditarDatosPersonales) {
            toast.error(
                proximaEdicionDatosPersonales
                    ? `Vas a poder volver a cambiar tus datos personales desde el ${new Date(`${proximaEdicionDatosPersonales}T00:00:00`).toLocaleDateString('es-AR')}.`
                    : 'No podés modificar tus datos personales por el período de seguridad de 21 días.'
            );
            return;
        }

        if (!tieneCambiosDatosPersonales) {
            toast.info('No hay cambios pendientes para guardar en Datos Personales');
            return;
        }

        setMostrarAlertaDatosPersonales(true);
    };

    const handleConfirmarGuardadoDatosPersonales = async () => {
        setLoadingDatosPersonales(true);

        const result = await actualizarPerfilAction(buildPerfilFormData());

        if (result.error) {
            toast.error(result.error);
            setLoadingDatosPersonales(false);
            return;
        }

        toast.success('Datos personales actualizados correctamente');

        if (result.proxima_edicion_datos_personales) {
            setProximaEdicionDatosPersonales(result.proxima_edicion_datos_personales);
            if (seCambianCamposRestringidos) {
                setPuedeEditarDatosPersonales(false);
            }
        }

        setMostrarAlertaDatosPersonales(false);
        router.refresh();
        setLoadingDatosPersonales(false);
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

            <form onSubmit={handlePrepararGuardadoDatosPersonales} className="space-y-5">
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
                        <Label htmlFor="localidad_id" className="flex items-center gap-2 text-sm font-medium">
                            <MapPin size={14} className="text-muted-foreground" />
                            Localidad
                        </Label>
                        <select
                            id="localidad_id"
                            value={localidadId}
                            onChange={(e) => setLocalidadId(e.target.value)}
                            disabled={!puedeEditarDatosPersonales}
                            className="h-10 w-full rounded-xl border border-border/70 bg-card px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">Seleccioná una localidad</option>
                            {localidades.map((localidad) => (
                                <option key={localidad.id} value={String(localidad.id)}>
                                    {localidad.nombre}
                                </option>
                            ))}
                        </select>
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
                        disabled={loadingDatosPersonales || !tieneCambiosDatosPersonales}
                        className="w-full gap-2 rounded-xl sm:w-auto"
                    >
                        {loadingDatosPersonales ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Save size={16} />
                        )}
                        {loadingDatosPersonales ? 'Guardando...' : 'Guardar Datos Personales'}
                    </Button>
                </div>
            </form>

            <AlertDialog open={mostrarAlertaDatosPersonales} onOpenChange={setMostrarAlertaDatosPersonales}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300">
                            <AlertTriangle size={18} />
                        </div>
                        <AlertDialogTitle>Confirmar guardado de datos personales</AlertDialogTitle>
                        <AlertDialogDescription>
                            Si continuás, Nombre, Apellido, Teléfono, Fecha de nacimiento, Localidad y Dirección no se podrán modificar por 21 días.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setMostrarAlertaDatosPersonales(false)}
                            disabled={loadingDatosPersonales}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmarGuardadoDatosPersonales}
                            disabled={loadingDatosPersonales}
                            className="gap-2"
                        >
                            {loadingDatosPersonales ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Save size={16} />
                            )}
                            {loadingDatosPersonales ? 'Guardando...' : 'Confirmar y guardar'}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
