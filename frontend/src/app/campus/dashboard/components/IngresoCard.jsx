import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

function CheckItem({ label, ok }) {
    return (
        <div className="flex justify-between items-center px-3 py-2.5 rounded-lg bg-muted/50 hover:bg-muted transition">
            <span className="text-sm font-medium text-foreground">{label}</span>
            {ok === true  && <CheckCircle size={18} className="text-green-600 shrink-0" />}
            {ok === false && <XCircle    size={18} className="text-red-500   shrink-0" />}
            {ok === undefined && <HelpCircle size={18} className="text-muted-foreground shrink-0" />}
        </div>
    );
}

/**
 * @param {{ docsIngreso: { dni?: bool, foto?: bool, partida?: bool, titulo?: bool } }} props
 */
//clsclsclsclsclscls
export function IngresoCard({ docsIngreso = {} }) {
    const items = [
        { label: 'DNI (Frente/Dorso)', key: 'dni'     },
        { label: 'Foto 4x4',           key: 'foto'    },
        { label: 'Partida Nacimiento', key: 'partida' },
        { label: 'Título Secundario',  key: 'titulo'  },
    ];

    const total    = items.length;
    const completados = items.filter(i => docsIngreso[i.key]).length;

    return (
        <Card className="shadow-sm border-border h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-600" />
                    Documentación de Ingreso
                </CardTitle>
                <CardDescription>
                    {completados} de {total} documentos entregados
                </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="pt-4 space-y-2 ">
                {items.map(({ label, key }) => (
                    <CheckItem key={key} label={label} ok={docsIngreso[key]} />
                ))}

                <button className="w-full mt-3 text-xs text-primary font-bold hover:underline py-1">
                    Consultar en Administración
                </button>
            </CardContent>
        </Card>
    );
}
