import { FolderOpen, Upload, Loader2, CheckCircle, Clock, XCircle, FileText } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

/**
 * Renderiza el estado de un documento individual con su botón de acción.
 */
function DocItem({ doc, onUpload, isUploading }) {
    const isRejected = doc.estado === 'rechazado';
    const isApproved = doc.estado === 'aprobado';
    const isSent     = doc.estado === 'entregado';
    const isPending  = doc.estado === 'vacio' || doc.estado === 'pendiente';

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 px-4 hover:bg-muted/50 transition rounded-lg">
            {/* Info del documento */}
            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-foreground text-sm">{doc.nombre_requisito}</span>

                    {isApproved  && <Badge className="bg-green-700 text-white hover:bg-green-700 text-[10px] px-1.5 py-0"><CheckCircle size={10} className="mr-1 inline" />OK</Badge>}
                    {isRejected  && <Badge className="bg-red-600   text-white hover:bg-red-600   text-[10px] px-1.5 py-0"><XCircle    size={10} className="mr-1 inline" />Rechazado</Badge>}
                    {isSent      && <Badge variant="secondary"                                    className="text-[10px] px-1.5 py-0"><Clock      size={10} className="mr-1 inline" />En revisión</Badge>}
                </div>

                {isRejected && doc.comentario_admin && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                        <span className="font-bold">Corrección:</span> {doc.comentario_admin}
                    </p>
                )}
            </div>

            {/* Botones de acción */}
            <div className="flex items-center gap-2 shrink-0">
                {/* Botón de ver archivo */}
                {doc.archivo_url && (
                    <a
                        href={doc.archivo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border bg-background text-foreground border-border hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition"
                    >
                        <FileText size={13} />
                        Ver
                    </a>
                )}

                {/* Botón de subida — oculto si ya está aprobado */}
                {!isApproved && (
                    <>
                        <input
                            type="file"
                            id={`file-${doc.id}`}
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => onUpload(e, doc.id)}
                            disabled={isUploading}
                        />
                        <label
                            htmlFor={`file-${doc.id}`}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer
                                ${isUploading
                                    ? 'bg-muted text-muted-foreground border-border cursor-not-allowed'
                                    : 'bg-background text-foreground border-border hover:bg-primary/5 hover:text-primary hover:border-primary/30'
                                }`}
                        >
                            {isUploading
                                ? <Loader2 size={13} className="animate-spin" />
                                : <Upload   size={13} />
                            }
                            {isPending ? 'Subir' : 'Re-subir'}
                        </label>
                    </>
                )}
            </div>
        </div>
    );
}

/**
 * @param {{
 *   legajos: Array<{ id: number, anio: number, completo: boolean, documentos: Array }>,
 *   onUpload: (e: Event, docId: number) => void,
 *   uploadingId: number | null,
 * }} props
 */
export function LegajosCard({ legajos = [], onUpload, uploadingId }) {
    return (
        <div className="space-y-5">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <FolderOpen size={20} className="text-primary" />
                Legajos de Prácticas
            </h2>

            {legajos.length === 0 ? (
                <Card className="border-dashed border-border shadow-none">
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground font-medium text-sm">
                            No hay legajos solicitados para este ciclo lectivo.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <Accordion
                    type="single"
                    collapsible
                    defaultValue={legajos.length > 0 ? `legajo-${legajos[0].id}` : undefined}
                    className="space-y-3"
                >
                    {legajos.map((legajo) => (
                        <AccordionItem
                            key={legajo.id}
                            value={`legajo-${legajo.id}`}
                            className="border border-border rounded-lg overflow-hidden bg-card shadow-sm"
                        >
                            <AccordionTrigger className="px-5 py-3 hover:no-underline hover:bg-muted/50 transition">
                                <div className="flex items-center justify-between w-full pr-4">
                                    <span className="text-sm font-bold text-foreground">
                                        Ciclo {legajo.anio}
                                    </span>
                                    <Badge
                                        className={legajo.completo
                                            ? 'bg-green-700 text-white hover:bg-green-700'
                                            : 'bg-yellow-500 text-white hover:bg-yellow-500 border border-yellow-300'
                                        }
                                    >
                                        {legajo.completo ? 'Completo' : 'En Proceso'}
                                    </Badge>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-0 pb-0">
                                <div className="divide-y divide-border">
                                    {legajo.documentos.map((doc) => (
                                        <DocItem
                                            key={doc.id}
                                            doc={doc}
                                            onUpload={onUpload}
                                            isUploading={uploadingId === doc.id}
                                        />
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </div>
    );
}

