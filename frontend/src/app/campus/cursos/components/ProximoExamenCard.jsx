import { BookOpen, CalendarX } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const getDaysUntil = (fecha) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exam = new Date(fecha);
  exam.setHours(0, 0, 0, 0);
  return Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
};

const getUrgencyConfig = (days) => {
  if (days <= 2)  return { bar: 'bg-red-500',   pill: 'bg-red-700/75 text-white border-red-200',   label: days === 0 ? '¡Hoy!' : days === 1 ? 'Mañana' : `${days}` };
  if (days <= 7)  return { bar: 'bg-amber-400',  pill: 'bg-amber-700/75 text-white border-amber-200', label: `${days}` };
  return             { bar: 'bg-emerald-400', pill: 'bg-emerald-700/75 text-white border-emerald-200', label: `${days}` };
};

export function ProximoExamenCard({ examenes = [] }) {
  return (
    <Card className="rounded-2xl overflow-hidden flex flex-col h-full border-0 shadow-lg bg-card">
      {/* Header */}
      <CardHeader className="px-5 py-4 flex-row justify-between items-center space-y-0">
        <CardTitle className="font-semibold text-red-600 dark:text-red-400 text-sm flex items-center gap-2 tracking-wide">
          <BookOpen size={18} strokeWidth={2.5} />
          Próximos Exámenes
        </CardTitle>
        <Badge className="bg-red-600/75 backdrop-blur-sm text-white text-xs font-bold rounded-full px-2.5 ">
          {examenes.length} {examenes.length === 1 ? 'examen' : 'exámenes'}
        </Badge>
      </CardHeader>

      {/* Content */}
      <CardContent className="p-4 flex-1">
        {examenes.length > 0 ? (
          <ScrollArea className="max-h-[300px]">
          <div className="space-y-2.5">
            {examenes.map((ex) => {
              const days = getDaysUntil(ex.fecha);
              const urgency = getUrgencyConfig(days);

              return (
                <div
                  key={ex.id}
                  className="relative flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/50 hover:bg-card hover:shadow-md hover:border-red-100 transition-all duration-200 group overflow-hidden"
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${urgency.bar} rounded-l-xl`} />
                  <div className="ml-2 bg-card border border-border text-center rounded-lg px-2 py-1.5 min-w-[46px] shadow-sm group-hover:shadow transition-shadow">
                    <span className="block text-[9px] text-muted-foreground uppercase font-bold tracking-widest">
                      {new Date(ex.fecha).toLocaleString('es-ES', { month: 'short' }).slice(0, 3)}
                    </span>
                    <span className="block text-lg font-black text-foreground leading-tight">
                      {new Date(ex.fecha).getUTCDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground text-sm truncate leading-tight">
                      {ex.nombre}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {ex.clase?.materia?.nombre ?? ex.materia?.nombre ?? ''}
                    </p>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${urgency.pill} shrink-0`}>
                   Faltan {urgency.label} Dias
                  </span>
                </div>
              );
            })}
          </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
              <CalendarX size={28} className="opacity-40" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Sin exámenes programados</p>
              <p className="text-xs text-muted-foreground mt-0.5">¡Disfruta tu tiempo libre!</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}