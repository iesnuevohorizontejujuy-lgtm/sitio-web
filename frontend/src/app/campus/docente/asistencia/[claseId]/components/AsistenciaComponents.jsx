'use client';
import { Check, X } from 'lucide-react';

export function AsistenciaBtn({ presente, onClick, disabled }) {
    const base = 'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150 text-sm font-bold disabled:opacity-40';
    if (presente === true)
        return <button onClick={onClick} disabled={disabled} className={`${base} bg-chart-2/15 text-chart-2 hover:bg-chart-2/25 border border-chart-2/30`}><Check size={16} strokeWidth={2.5} /></button>;
    if (presente === false)
        return <button onClick={onClick} disabled={disabled} className={`${base} bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/30`}><X size={16} strokeWidth={2.5} /></button>;
    return <button onClick={onClick} disabled={disabled} className={`${base} bg-muted text-muted-foreground hover:bg-border border border-border`}><span className="text-xs">—</span></button>;
}

export function PctBadge({ pct }) {
    if (pct === null) return null;
    const color = pct >= 80 ? 'text-chart-2' : pct >= 60 ? 'text-chart-3' : 'text-destructive';
    return <span className={`text-[10px] font-mono font-bold tabular-nums ${color}`}>{pct}%</span>;
}

export function GroupStats({ totalFechas, promedioGrupo }) {
    return (
        <div className="flex items-center gap-4">
            <div className="text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Clases</p>
                <p className="text-lg font-extrabold text-foreground tabular-nums">{totalFechas}</p>
            </div>
            <div className="text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Prom. grupo</p>
                <p className={`text-lg font-extrabold tabular-nums ${promedioGrupo >= 80 ? 'text-chart-2' : promedioGrupo >= 60 ? 'text-chart-3' : 'text-destructive'}`}>
                    {promedioGrupo}%
                </p>
            </div>
        </div>
    );
}
