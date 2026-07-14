'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Save, Check, X, Edit3, AlertCircle, ArrowLeft, Lock, Search } from 'lucide-react';
import { toast } from 'sonner';
import { fetchPlanillaAsistencia, guardarAsistenciaMasivaAction } from '../../../actions';
import { AsistenciaInfoDialog } from './components/AsistenciaInfoDialog';

export default function PlanillaAsistencia({ params }) {
    const { id } = use(params);
    const router = useRouter();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [cambiosPendientes, setCambiosPendientes] = useState({});
    const [fechaActiva, setFechaActiva] = useState(getLocalDate());
    const [mesActivo, setMesActivo] = useState(getLocalDate().substring(0, 7));
    const [modoEdicion, setModoEdicion] = useState(false);

    const [searchInputValue, setSearchInputValue] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchInputValue);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInputValue]);

    function getLocalDate() {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        const localDate = new Date(now.getTime() - offset);
        return localDate.toISOString().split('T')[0];
    }

    const normalizarValor = (val) => {
        if (val === 1 || val === '1' || val === true) return true;
        if (val === 0 || val === '0' || val === false) return false;
        return null;
    };

    const fetchData = async () => {
        if (!id) return;
        try {
            const result = await fetchPlanillaAsistencia(id, debouncedSearchQuery);
            setData(result);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (id) fetchData(); }, [id, debouncedSearchQuery]);

    const claseCerrada = data?.clase_cerrada === true;

    const MESES = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
    const getMesNombre = (YYYYMM) => {
        if (!YYYYMM) return '';
        const [, m] = YYYYMM.split('-');
        return MESES[parseInt(m, 10) - 1];
    };
    const mesesTokens = Array.from(new Set((data?.fechas || []).map(f => f.substring(0, 7)))).sort();
    const fechasMostradas = (data?.fechas || []).filter(f => f.startsWith(mesActivo)).sort();

    const activarEdicion = () => {
        if (claseCerrada) return;
        if (!data.fechas.includes(fechaActiva)) {
            setData(prev => ({ ...prev, fechas: [...prev.fechas, fechaActiva] }));
        }
        setModoEdicion(true);
    };

    const handleCellClick = (cursadaId, fecha) => {
        if (claseCerrada) return;
        if (fecha !== fechaActiva) {
            setFechaActiva(fecha);
            setMesActivo(fecha.substring(0, 7));
            setModoEdicion(true);
            return;
        }
        if (!modoEdicion) setModoEdicion(true);

        const rawOriginal = data.alumnos.find(a => a.id === cursadaId).historial[fecha];
        const valorOriginal = normalizarValor(rawOriginal);

        const valorActual = cambiosPendientes[`${cursadaId}-${fecha}`] !== undefined
            ? cambiosPendientes[`${cursadaId}-${fecha}`]
            : valorOriginal;

        let nuevoValor = true;
        if (valorActual === true) nuevoValor = false;
        else if (valorActual === false) nuevoValor = null;

        setCambiosPendientes(prev => ({
            ...prev,
            [`${cursadaId}-${fecha}`]: nuevoValor
        }));
    };

    const handleGuardar = async () => {
        setSaving(true);
        const payload = [];

        data.alumnos.forEach(alumno => {
            const key = `${alumno.id}-${fechaActiva}`;
            const valorPendiente = cambiosPendientes[key];

            const rawOriginal = alumno.historial[fechaActiva];
            const valorOriginal = normalizarValor(rawOriginal);

            let valorFinal = valorPendiente !== undefined ? valorPendiente : valorOriginal;

            if (valorFinal !== undefined && valorFinal !== null) {
                payload.push({
                    cursada_id: alumno.id,
                    presente: valorFinal
                });
            }
        });

        try {
            await guardarAsistenciaMasivaAction({
                fecha: fechaActiva,
                asistencias: payload
            });
            setCambiosPendientes({});
            setModoEdicion(false);
            await fetchData();
            toast.success('Asistencia guardada correctamente');
        } catch (error) {
            toast.error('Error al guardar asistencia');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;

    if (!data || data.error || !data.alumnos) {
        return (
            <div className="bg-background min-h-[calc(100vh-100px)] p-6 md:p-8 flex flex-col items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="text-xl font-bold text-foreground">Error al cargar la asistencia</h2>
                    <p className="text-muted-foreground">La clase solicitada no existe o no tienes permisos.</p>
                    <button onClick={() => router.back()} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold">Volver</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 h-[calc(100vh-100px)]">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 w-fit px-4 py-2 bg-background border border-border hover:bg-accent hover:text-accent-foreground text-muted-foreground rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
                <ArrowLeft size={16} /> Volver
            </button>

            <div className="flex-1 flex flex-col bg-card rounded-xl shadow border border-border overflow-hidden">
                <div className="p-4 border-b border-border flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    {data.carrera && (
                        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            {data.carrera}
                        </h2>
                    )}
                    <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                        Asistencia: <span className="text-accent-foreground">{data?.materia}</span>
                    </h1>
                    <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                        {claseCerrada
                            ? <span className="flex items-center gap-1 text-muted-foreground"><Lock size={11} /> Registro cerrado — solo auditoría</span>
                            : modoEdicion
                                ? <span className="text-primary font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block"></span> Editando</span>
                                : <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 inline-block"></span> Visualizando</span>}
                    </p>
                </div>

                <div className="relative w-full md:max-w-xs shrink-0 md:mr-auto md:ml-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar alumno..."
                        value={searchInputValue}
                        onChange={(e) => setSearchInputValue(e.target.value)}
                        className="h-9 pl-9 pr-4 w-full rounded-md border border-input bg-muted/30 hover:bg-muted/50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <AsistenciaInfoDialog />
                    {claseCerrada ? (
                        <div className="flex items-center gap-2 text-muted-foreground bg-muted px-4 py-2 rounded-xl border border-border text-sm font-semibold">
                            <Lock size={14} /> <span>Edición bloqueada</span>
                        </div>
                    ) : (
                        <div className="flex items-center bg-muted p-1.5 rounded-lg border border-border">
                            <input
                                type="date"
                                value={fechaActiva}
                                onChange={e => { 
                                    setFechaActiva(e.target.value); 
                                    setMesActivo(e.target.value.substring(0, 7));
                                    setModoEdicion(false); 
                                }}
                                className="bg-transparent text-foreground font-bold px-2 focus:outline-none"
                            />
                            <button
                                onClick={activarEdicion}
                                className={`px-4 py-1.5 rounded-md font-bold text-sm transition flex items-center gap-2 ${modoEdicion
                                    ? 'bg-primary/10 text-primary cursor-default'
                                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                                    }`}
                            >
                                {modoEdicion ? <Edit3 size={16} /> : <Plus size={16} />}
                                {modoEdicion ? 'Editando' : 'Abrir Día'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {mesesTokens.length > 0 && (
                <div className="flex border-b border-border bg-muted/20">
                    {mesesTokens.map(m => (
                        <button
                            key={m}
                            onClick={() => setMesActivo(m)}
                            className={`flex-1 py-2.5 text-xs font-bold uppercase transition-colors tracking-widest border-r border-border/50 last:border-r-0
                                ${mesActivo === m 
                                    ? 'bg-primary text-primary-foreground shadow-[inset_0_-2px_0_rgba(0,0,0,0.2)]' 
                                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'}
                            `}
                        >
                            {getMesNombre(m)}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex-1 overflow-auto relative">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="text-xs text-foreground uppercase bg-muted sticky top-0 z-20 shadow-sm">
                        <tr>
                            <th className="px-4 py-3 font-bold sticky left-0 z-30 bg-muted border-r border-border shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[200px]">
                                Alumno
                            </th>
                            {fechasMostradas.map(fecha => (
                                <th key={fecha} className={`px-2 py-3 text-center min-w-[70px] border-r border-border ${fecha === fechaActiva ? 'bg-primary/10 text-primary ring-inset ring-2 ring-primary/20' : ''}`}>
                                    <div className="flex flex-col items-center">
                                        <span className="font-bold text-lg leading-none">{fecha.split('-')[2]}</span>
                                        <span className="text-[10px] text-muted-foreground">{fecha.split('-')[1]}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data?.alumnos.map((alumno) => (
                            <tr key={alumno.id} className="hover:bg-muted/50 transition-colors">
                                <td className="px-4 py-2 font-medium text-foreground sticky left-0 bg-card z-10 border-r border-border shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                    <span className="truncate max-w-[180px] block">{alumno.alumno}</span>
                                </td>
                                {fechasMostradas.map(fecha => {
                                    const key = `${alumno.id}-${fecha}`;

                                    const rawHistorial = alumno.historial[fecha];
                                    const valorOriginal = normalizarValor(rawHistorial);

                                    const esPendiente = cambiosPendientes[key] !== undefined;
                                    const valor = esPendiente ? cambiosPendientes[key] : valorOriginal;

                                    const esFechaActiva = fecha === fechaActiva;

                                    return (
                                        <td key={fecha} className={`p-1 text-center border-r border-muted ${esFechaActiva ? 'bg-primary/5' : ''}`}>
                                            <button
                                                onClick={() => handleCellClick(alumno.id, fecha)}
                                                disabled={claseCerrada}
                                                className={`
                                            w-10 h-10 rounded-full flex items-center justify-center transition-all mx-auto
                                            ${valor === true ? 'bg-chart-2 text-white shadow-sm hover:bg-chart-2/85' :
                                                        valor === false ? 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/85' :
                                                            'bg-card border-2 border-border text-muted-foreground/40 hover:border-muted-foreground'}
                                            ${claseCerrada ? 'cursor-default opacity-80' : esFechaActiva ? 'cursor-pointer scale-100' : 'opacity-50 grayscale cursor-pointer hover:opacity-100 hover:grayscale-0'}
                                        `}
                                                title={claseCerrada ? 'Cursada cerrada — solo lectura' : esFechaActiva ? 'Clic para cambiar' : 'Clic para editar este día'}
                                            >
                                                {valor === true && <Check size={18} strokeWidth={3} />}
                                                {valor === false && <X size={18} strokeWidth={3} />}
                                            </button>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modoEdicion && !claseCerrada && (
                <div className="p-4 border-t border-border bg-card flex justify-between items-center z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-2">
                    <div className="text-sm flex items-center gap-2">
                        <AlertCircle size={16} className="text-primary" />
                        <span>Editando: <span className="font-bold">{fechaActiva}</span></span>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => { setModoEdicion(false); setCambiosPendientes({}); }}
                            className="px-4 py-2 text-muted-foreground hover:text-foreground font-medium text-sm"
                        >
                            Descartar
                        </button>
                        <button
                             onClick={handleGuardar}
                             disabled={saving}
                             className="bg-primary hover:bg-primary/90 text-primary-foreground px-7 py-2.5 rounded-xl font-bold shadow-sm shadow-primary/20 transition flex items-center gap-2 text-sm active:scale-95 disabled:opacity-60 disabled:cursor-wait"
                         >
                            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}