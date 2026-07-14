'use client';
import { useEffect, useState } from 'react';
import { Loader2, ShieldCheck, Calendar, FolderOpen, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { fetchLegajosDocente, fetchLegajoDocente, subirDocumentoLegajoAction } from '../actions';
import { EstadoBadge, ProgressBar, DocumentCard } from './components/LegajoComponents';
import { LegajoInfoDialog } from './components/LegajoInfoDialog';
import { DocBreadcrumb } from '../components/DocBreadcrumb';

export default function LegajoDocentePage() {
    const [legajos, setLegajos] = useState([]);
    const [legajoSeleccionado, setLegajoSeleccionado] = useState(null);
    const [legajo, setLegajo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploadingCollection, setUploadingCollection] = useState(null);

    const loadLegajos = async () => {
        try {
            const data = await fetchLegajosDocente();
            setLegajos(data);
            if (data.length > 0 && !legajoSeleccionado) setLegajoSeleccionado(data[0].id);
        } catch (e) { console.error(e); }
    };

    const loadLegajo = async (id) => {
        try {
            setLoading(true);
            setLegajo(await fetchLegajoDocente(id));
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadLegajos(); }, []);
    useEffect(() => { if (legajoSeleccionado) loadLegajo(legajoSeleccionado); }, [legajoSeleccionado]);

    const handleUpload = async (e, collection) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { toast.error('Máximo 5 MB por archivo.'); return; }
        setUploadingCollection(collection);
        const fd = new FormData();
        fd.append('collection', collection);
        fd.append('archivo', file);
        fd.append('legajo_id', legajoSeleccionado);
        try {
            await subirDocumentoLegajoAction(fd);
            await Promise.all([loadLegajo(legajoSeleccionado), loadLegajos()]);
            toast.success('Documento cargado correctamente.');
        } catch { toast.error('Error al subir el documento.'); }
        finally { setUploadingCollection(null); e.target.value = ''; }
    };

    const docsTotal = legajo?.documentos?.length ?? 0;
    const docsCargados = legajo?.documentos?.filter(d => d.estado === 'cargado').length ?? 0;
    const legajoCompleto = docsTotal > 0 && docsCargados === docsTotal;

    if (loading && legajos.length === 0) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-primary" size={36} />
        </div>
    );

    return (
        <div className="space-y-5">
            <DocBreadcrumb items={[{ label: 'Mi Legajo' }]} />

            {/* ── ENCABEZADO ── */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-foreground leading-tight">
                        Mi Legajo
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Administrá tu documentación institucional
                    </p>
                </div>

                <div className="sm:ml-auto flex items-center gap-2 self-start sm:self-auto">
                    <LegajoInfoDialog />

                    {legajoCompleto && (
                        <div className="flex items-center gap-1.5 bg-chart-2/10 text-chart-2 border border-chart-2/20 px-3 py-1.5 rounded-full text-xs font-bold shrink-0">
                            <ShieldCheck size={14} /> Legajo Completo
                        </div>
                    )}
                </div>
            </div>

            {/* ── SELECTOR DE PERÍODO + PROGRESO GLOBAL ── */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                {legajos.length > 0 && (
                    <div className="bg-card border border-border rounded-xl p-4 flex-1">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <Calendar size={12} /> Período
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {legajos.map(leg => (
                                <button
                                    key={leg.id}
                                    onClick={() => setLegajoSeleccionado(leg.id)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold transition-all ${legajoSeleccionado === leg.id
                                        ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20'
                                        : 'bg-card text-foreground border-border hover:border-primary/40 hover:bg-muted/50'
                                        }`}
                                >
                                    <Calendar size={12} />
                                    {leg.fecha_creacion}
                                   
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {!loading && legajo && docsTotal > 0 && (
                    <div className="bg-card border border-border rounded-xl p-5 flex-1">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-bold text-foreground flex items-center gap-2">
                                <FolderOpen size={16} className="text-primary" />
                                Documentación del período
                                <span className="text-muted-foreground font-normal text-xs">({legajo.fecha_creacion})</span>
                            </p>
                            <span className={`text-xs font-bold tabular-nums ${legajoCompleto ? 'text-chart-2' : 'text-muted-foreground'}`}>
                                {docsCargados}/{docsTotal}
                            </span>
                        </div>
                        <ProgressBar value={docsCargados} max={docsTotal} />
                        <p className="text-xs text-muted-foreground mt-2">
                            Formatos: PDF, JPG, JPEG, PNG · Máx. 5 MB
                        </p>
                    </div>
                )}
            </div>

            {/* ── DOCUMENTOS ── */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-primary" size={32} />
                </div>
            ) : !legajo || docsTotal === 0 ? (
                <div className="bg-card border border-border rounded-xl p-10 text-center">
                    <AlertCircle size={36} className="mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-sm font-semibold text-foreground">Sin documentos configurados</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Contactá con administración para configurar tu legajo.
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {legajo.documentos
                        .slice()
                        .sort((a, b) => (a.estado === 'cargado' ? 1 : -1) - (b.estado === 'cargado' ? 1 : -1))
                        .map(doc => (
                            <DocumentCard
                                key={doc.collection}
                                doc={doc}
                                isUploading={uploadingCollection === doc.collection}
                                onUpload={handleUpload}
                                disabled={uploadingCollection !== null}
                            />
                        ))
                    }
                </div>
            )}
        </div>
    );
}
