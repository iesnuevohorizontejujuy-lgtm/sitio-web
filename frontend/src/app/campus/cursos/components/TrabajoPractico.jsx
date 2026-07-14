import { FileText, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export function TrabajoPracticoCard({ tps = [] }) {
  return (
    <Card className="rounded-2xl overflow-hidden flex flex-col h-full border-0 shadow-lg bg-card">
      {/* Header */}
      <CardHeader className="px-5 py-4  flex-row justify-between items-center space-y-0">
        <CardTitle className="font-semibold text-primary text-sm flex items-center gap-2 tracking-wide">
          <FileText size={18} strokeWidth={2.5} />
          Trabajos Prácticos Pendientes
        </CardTitle>
        <Badge className="bg-primary/10 text-primary border border-primary/30 text-xs font-bold rounded-full px-2.5 hover:bg-primary/20">
          {tps.length} {tps.length === 1 ? 'trabajo' : 'trabajos'}
        </Badge>
      </CardHeader>

      {/* Content */}
      <CardContent className="p-4 flex-1">
        {tps.length > 0 ? (
          <ScrollArea className="max-h-[300px]">
          <div className="space-y-2.5">
            {tps.map((tp) => (
              <div
                key={tp.id}
                className="group relative flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/50 hover:bg-card hover:shadow-md hover:border-blue-100 transition-all duration-200 cursor-pointer overflow-hidden"
              >
                {/* Left accent bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl" />

                {/* Icon */}
                <div className="ml-2 w-8 h-8 rounded-lg bg-primary border border-blue-100 flex items-center justify-center shrink-0  transition-colors">
                  <FileText size={15} className="text-white" strokeWidth={2} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground text-sm truncate leading-tight group-hover:text-blue-700 transition-colors">
                    {tp.nombre}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {tp.materia.nombre}
                  </p>
                </div>

                {/* Status pill */}
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border bg-orange-400 text-white border-orange-200 shrink-0 flex items-center gap-1">
                  <Clock size={10} strokeWidth={2.5} />
                  Pendiente
                </span>
              </div>
            ))}
          </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-8 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-950/30 flex items-center justify-center">
              <CheckCircle2 size={28} className="text-green-400" strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">¡Todo al día!</p>
              <p className="text-xs text-muted-foreground mt-0.5">No tenés trabajos pendientes.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}