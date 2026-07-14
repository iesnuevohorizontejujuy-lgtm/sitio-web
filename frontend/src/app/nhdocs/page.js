'use client';
import { useState, useEffect } from 'react';
import { publicFetch } from '@/lib/public-api';
import Link from 'next/link';
import { ArrowLeft, Loader2, QrCode, Barcode as BarcodeIcon, FileText, Search, MapPin, User, Calendar, ArrowRight, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';

export default function NHDocsPage() {
    const [codigo, setCodigo] = useState('');
    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [urlBase, setUrlBase] = useState('');

    // --- NUEVO: Leer URL y Auto-Buscar si viene de un QR ---
    useEffect(() => {
        // Guardamos la URL base para generar el QR correcto
        setUrlBase(window.location.origin);

        // Leemos si la URL trae "?codigo=0001_REC_26"
        const params = new URLSearchParams(window.location.search);
        const codigoUrl = params.get('codigo');
        
        if (codigoUrl) {
            setCodigo(codigoUrl);
            realizarBusqueda(codigoUrl);
        }
    }, []);

    const realizarBusqueda = async (codigoBuscado) => {
        if (!codigoBuscado.trim()) return;
        setLoading(true);
        setError('');
        setResultado(null);

        try {
            const response = await publicFetch(`/expediente/${codigoBuscado}`);
            if (!response.ok) throw new Error('Not found');
            const data = await response.json();
            setResultado(data);
        } catch (err) {
            console.error(err);
            setError('No se han encontrado registros para el código ingresado. Por favor, verifique la información e intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        realizarBusqueda(codigo);
    };

    return (
        <div className="min-h-screen bg-background pt-24 sm:pt-32 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 font-sans">
            
            {/* CSS AJUSTADO: Gris neutro y limitado SOLAMENTE a móviles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 768px) {
                    .scrollbar-custom {
                        -webkit-overflow-scrolling: touch;
                        scrollbar-width: thin;
                        scrollbar-color: hsl(var(--muted-foreground) / 0.5) transparent;
                    }
                    .scrollbar-custom::-webkit-scrollbar {
                        height: 6px;
                        -webkit-appearance: none;
                        display: block !important;
                    }
                    .scrollbar-custom::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .scrollbar-custom::-webkit-scrollbar-thumb {
                        background-color: hsl(var(--muted-foreground) / 0.5); /* Gris elegante (Dark/Light) */
                        border-radius: 8px;
                    }
                }
                `
            }} />

            <div className="max-w-5xl mx-auto mb-6 sm:mb-8">
                <Link href="/" className="inline-flex items-center gap-2 text-foreground/70 hover:text-primary transition font-medium bg-card px-4 py-2 rounded-lg shadow-sm border border-border hover:shadow-md">
                    <ArrowLeft size={18} />
                    <span className="text-sm sm:text-base">Volver al Portal Principal</span>
                </Link>
            </div>

            <div className="max-w-5xl mx-auto space-y-8">
                
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center p-3 bg-primary rounded-full mb-2 shadow-md">
                        <Search className="text-primary-foreground h-6 w-6 sm:h-8 sm:w-8" />
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-primary tracking-tight">
                        Mesa de Entradas Virtual
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground font-medium uppercase tracking-wide">
                        Consulta Pública de Expedientes y Trámites
                    </p>
                </div>

                <div className="bg-card p-5 sm:p-8 shadow-md rounded-2xl border border-border">
                    <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-3xl mx-auto relative z-10">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                required
                                autoComplete="off"
                                className="block w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 border-border rounded-xl focus:ring-0 focus:border-primary text-foreground bg-muted font-bold text-base sm:text-lg transition-colors placeholder:font-normal placeholder:text-muted-foreground uppercase"
                                placeholder="Número de Expediente"
                                value={codigo}
                                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                            />
                            <Search className="absolute left-3 sm:left-4 top-3.5 sm:top-4 text-muted-foreground h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border border-transparent text-base sm:text-lg font-bold rounded-xl text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5 sm:h-6 sm:w-6" /> : 'CONSULTAR'}
                        </button>
                    </form>
                    
                    {error && (
                        <div className="mt-6 bg-destructive/10 text-destructive p-4 rounded-xl text-center border border-destructive/20 font-medium animate-in fade-in text-sm sm:text-base">
                            {error}
                        </div>
                    )}
                </div>

                {/* RESULTADOS */}
                {resultado && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500 w-full">
                        
                        {/* TARJETAS */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* QR Card */}
                            <div className="bg-card p-4 sm:p-5 rounded-2xl shadow-sm border border-border flex items-center justify-between overflow-hidden">
                                <div className="bg-primary p-3 sm:p-4 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
                                    <QrCode className="text-primary-foreground h-6 w-6 sm:h-8 sm:w-8" />
                                </div>
                                <div className="flex flex-col items-end justify-center flex-1 ml-4">
                                    <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">VALIDACIÓN QR</span>
                                    <div className="bg-white p-1.5 border border-border rounded-lg shadow-sm">
                                        <QRCodeSVG value={`${urlBase}/nhdocs?codigo=${resultado.codigo}`} size={56} bgColor="#ffffff" fgColor="#000000" />
                                    </div>
                                </div>
                            </div>

                            {/* Barcode Card */}
                            <div className="bg-card p-4 sm:p-5 rounded-2xl shadow-sm border border-border flex items-center justify-between overflow-hidden">
                                <div className="bg-primary p-3 sm:p-4 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
                                    <BarcodeIcon className="text-primary-foreground h-6 w-6 sm:h-8 sm:w-8" />
                                </div>
                                <div className="flex flex-col items-end justify-center flex-1 overflow-hidden ml-4">
                                    <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">CÓDIGO DE BARRAS</span>
                                    <div className="w-full flex justify-end bg-white px-2 py-1 rounded-md">
                                        <div className="scale-[0.6] sm:scale-75 origin-right">
                                            <Barcode 
                                                value={resultado.codigo} 
                                                width={1.5} 
                                                height={40} 
                                                displayValue={false} 
                                                margin={0}
                                                background="transparent"
                                                lineColor="#000000"
                                            />
                                        </div>
                                    </div>
                                    <span className="text-xs sm:text-sm text-primary font-mono mt-1 font-bold">{resultado.codigo}</span>
                                </div>
                            </div>

                            {/* Fojas Card */}
                            <div className="bg-card p-4 sm:p-5 rounded-2xl shadow-sm border border-border flex items-center justify-between sm:col-span-2 lg:col-span-1">
                                <div className="bg-muted p-3 sm:p-4 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
                                    <FileText className="text-foreground h-6 w-6 sm:h-8 sm:w-8" />
                                </div>
                                <div className="flex flex-col items-end justify-center flex-1 ml-4">
                                    <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-widest">DOCUMENTACIÓN (FOJAS)</span>
                                    <span className="text-4xl sm:text-5xl font-black text-foreground mt-1">{resultado.cantidad_fojas}</span>
                                </div>
                            </div>
                        </div>

                        {/* INFO EXPEDIENTE */}
                        <div className="bg-card p-5 sm:p-8 rounded-2xl shadow-sm border border-border relative overflow-hidden w-full">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
                            
                            <div className="border-b border-border pb-4 mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="w-full">
                                    <h3 className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">ASUNTO DEL TRÁMITE</h3>
                                    <p className="text-lg sm:text-2xl font-bold text-foreground leading-tight">{resultado.asunto}</p>
                                </div>
                                
                                {/* --- NUEVO: BOTÓN VER DOCUMENTO ESCANEADO --- */}
                                {resultado.archivo_digital_url && (
                                    <a 
                                        href={resultado.archivo_digital_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex w-full sm:w-auto justify-center items-center gap-2 bg-[#00B0F0] hover:bg-[#0090C0] text-white font-bold py-2.5 px-5 rounded-lg transition-colors shadow-sm whitespace-nowrap text-sm sm:text-base shrink-0"
                                    >
                                        <Download size={18} />
                                        Ver Documento
                                    </a>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 text-sm">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="bg-muted p-2.5 sm:p-3 rounded-lg border border-border shrink-0"><User size={18} className="text-muted-foreground" /></div>
                                    <div className="min-w-0">
                                        <p className="text-muted-foreground text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Titular / Iniciador</p>
                                        <p className="font-bold text-foreground text-sm sm:text-base truncate">{resultado.iniciado_por}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="bg-muted p-2.5 sm:p-3 rounded-lg border border-border shrink-0"><Calendar size={18} className="text-muted-foreground" /></div>
                                    <div className="min-w-0">
                                        <p className="text-muted-foreground text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Fecha de Creación</p>
                                        <p className="font-bold text-foreground text-sm sm:text-base">{resultado.fecha_inicio}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 sm:gap-4 sm:col-span-2 md:col-span-1">
                                    <div className="bg-muted p-2.5 sm:p-3 rounded-lg border border-border shrink-0"><MapPin size={18} className="text-muted-foreground" /></div>
                                    <div className="min-w-0">
                                        <p className="text-muted-foreground text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Estado Administrativo</p>
                                        <p className="font-bold uppercase inline-flex px-2.5 py-1 mt-1 rounded-md bg-primary text-primary-foreground tracking-wide text-[10px] sm:text-xs">
                                            {resultado.estado}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TABLA DE HISTORIAL - VERSIÓN CORREGIDA */}
                        <div className="bg-card shadow-sm border border-border rounded-2xl w-full overflow-hidden">
                            <div className="bg-muted px-4 sm:px-6 py-4 sm:py-5 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <h3 className="font-bold text-foreground flex items-center gap-2 text-base sm:text-lg">
                                    <FileText className="text-primary" size={20} />
                                    Historial de Pases y Movimientos
                                </h3>
                                <span className="bg-background text-muted-foreground text-[10px] sm:text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider border border-border">
                                    Auditoría de Trámite
                                </span>
                            </div>
                            
                            {/* CONTENEDOR CON SCROLL HORIZONTAL */}
                            <div className="w-full overflow-x-auto scrollbar-custom">
                                <table className="min-w-[1000px] w-full text-sm text-left border-collapse">
                                    <thead className="bg-primary/5 text-foreground uppercase text-[10px] sm:text-xs tracking-widest border-b border-border">
                                        <tr>
                                            <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-center whitespace-nowrap">Fojas</th>
                                            <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold whitespace-nowrap">Fecha y Hora</th>
                                            <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-center whitespace-nowrap">Dependencia (Origen → Destino)</th>
                                            <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold whitespace-nowrap">Autorización (Firmas)</th>
                                            <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold whitespace-nowrap">Observaciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {resultado.historial?.length > 0 ? (
                                            resultado.historial.map((mov, index) => (
                                                <tr key={index} className="hover:bg-muted/50 transition-colors">
                                                    {/* Fojas */}
                                                    <td className="px-4 sm:px-6 py-4 sm:py-5 text-center align-top whitespace-nowrap">
                                                        <span className="inline-block bg-muted text-foreground font-bold px-2 sm:px-3 py-1 rounded border border-border text-xs">
                                                            {mov.fojas || '-'}
                                                        </span>
                                                    </td>
                                                    
                                                    {/* Fecha y Hora */}
                                                    <td className="px-4 sm:px-6 py-4 sm:py-5 align-top whitespace-nowrap">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-foreground text-xs sm:text-sm">{mov.fecha}</span>
                                                            <span className="text-[10px] sm:text-xs text-muted-foreground font-mono mt-0.5">{mov.hora}</span>
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Origen y Destino */}
                                                    <td className="px-4 sm:px-6 py-4 sm:py-5 align-top whitespace-nowrap">
                                                        <div className="flex items-center justify-center gap-2 sm:gap-3">
                                                            <span className="font-semibold text-muted-foreground bg-muted px-2 sm:px-3 py-1 sm:py-1.5 rounded-md border border-border shadow-sm text-[10px] sm:text-xs uppercase tracking-wider text-center">
                                                                {mov.origen}
                                                            </span>
                                                            <ArrowRight size={14} className="text-muted-foreground shrink-0" />
                                                            <span className="font-bold text-primary bg-primary/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md border border-primary/20 shadow-sm text-[10px] sm:text-xs text-center">
                                                                {mov.destino}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Firmas */}
                                                    <td className="px-4 sm:px-6 py-4 sm:py-5 align-top whitespace-nowrap">
                                                        <div className="flex flex-col gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                                                            <div className="flex items-start gap-1">
                                                                <span className="text-muted-foreground font-bold uppercase w-14 sm:w-16 tracking-widest shrink-0 mt-0.5">Entregó:</span>
                                                                <span className="text-foreground font-medium bg-muted px-1.5 sm:px-2 py-0.5 rounded break-words max-w-[180px] sm:max-w-[200px]">
                                                                    {mov.enviado_por}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-start gap-1">
                                                                <span className="text-primary font-bold uppercase w-14 sm:w-16 tracking-widest shrink-0 mt-0.5">Recibió:</span>
                                                                <span className="text-foreground font-medium bg-muted px-1.5 sm:px-2 py-0.5 rounded break-words max-w-[180px] sm:max-w-[200px]">
                                                                    {mov.recibido_por}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Observaciones */}
                                                    <td className="px-4 sm:px-6 py-4 sm:py-5 align-top text-muted-foreground text-[10px] sm:text-xs min-w-[250px] sm:min-w-[300px]">
                                                        {mov.observaciones ? (
                                                            <p className="italic bg-muted p-2 sm:p-3 rounded-md border border-border">
                                                                "{mov.observaciones}"
                                                            </p>
                                                        ) : (
                                                            <span className="text-muted-foreground italic block">- Sin observaciones registradas -</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-4 py-12 sm:py-16">
                                                    <div className="flex flex-col items-center justify-center text-muted-foreground text-center">
                                                        <FileText className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4 text-muted-foreground/30" />
                                                        <p className="text-sm sm:text-lg font-medium text-foreground">Sin movimientos administrativos registrados</p>
                                                        <p className="text-[10px] sm:text-sm mt-1">El expediente se encuentra en su dependencia de origen.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {resultado.historial.length === 0 && (
                                <div className="p-6 sm:p-8 text-center text-sm sm:text-base text-muted-foreground bg-muted border-t border-border">
                                    El expediente se encuentra iniciado pero aún no tiene movimientos registrados.
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}