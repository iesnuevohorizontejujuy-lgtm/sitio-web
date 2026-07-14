'use client';
import { CheckCircle, FileText, Upload, Loader2 } from 'lucide-react';

export function EstadoBadge({ estado, porcentaje }) {
    if (estado === 'completo') return (
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle size={10} /> Completo
        </span>
    );
    if (estado === 'incompleto') return (
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-chart-3/10 text-chart-3 border border-chart-3/20">
            {porcentaje}% entregado
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-muted text-muted-foreground border border-border">
            Vacío
        </span>
    );
}

export function ProgressBar({ value, max }) {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0;
    const color = pct === 100 ? 'bg-chart-2' : pct >= 50 ? 'bg-chart-3' : 'bg-chart-5';
    return (
        <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs font-mono font-bold text-muted-foreground tabular-nums shrink-0">
                {value}/{max}
            </span>
        </div>
    );
}

export function DocumentCard({ doc, isUploading, onUpload, disabled }) {
    const cargado = doc.estado === 'cargado';

    return (
        <div className={`rounded-xl border transition-all duration-200 ${cargado
            ? 'bg-chart-2/5 border-chart-2/20'
            : 'bg-card border-border hover:border-primary/30'
            }`}>
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg shrink-0 ${cargado ? 'text-emerald-500 dark:text-emerald-400' : 'text-muted-foreground'} `}>
                        {cargado ? <CheckCircle size={18} /> : <FileText size={18} />}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-foreground">{doc.nombre}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {cargado ? 'Documento cargado correctamente' : 'Pendiente de carga'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {doc.archivo_url && (
                        <a
                            href={doc.archivo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 py-2 px-3 rounded-lg bg-card border border-border text-xs font-bold text-foreground hover:text-primary hover:border-primary/40 transition-colors"
                        >
                            <FileText size={13} /> Ver
                        </a>
                    )}

                    <input
                        type="file"
                        id={`doc-${doc.collection}`}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => onUpload(e, doc.collection)}
                        disabled={disabled}
                    />
                    <label
                        htmlFor={`doc-${doc.collection}`}
                        className={`flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold cursor-pointer transition-all ${isUploading
                            ? 'bg-muted text-muted-foreground cursor-wait'
                            : cargado
                                ? 'bg-yellow-400 dark:bg-transparent dark:text-yellow-400 border border-yellow-500 hover:bg-yellow-500 dark:hover:bg-yellow-400/20 shadow-sm shadow-yellow-400/30 dark:shadow-none'
                                : 'bg-primary dark:bg-transparent text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20 dark:border border-primary dark:hover:border-primary/40 dark:hover:bg-primary/20'
                            }`}
                    >
                        {isUploading
                            ? <><Loader2 size={13} className="animate-spin" /> Subiendo…</>
                            : <><Upload size={13}  /> {cargado ? 'Reemplazar' : 'Subir'}</>
                        }
                    </label>
                </div>
            </div>
        </div>
    );
}
