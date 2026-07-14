'use client';
import { GraduationCap, UserCheck, UserX } from 'lucide-react';

/**
 * Slider con label, valor grande y hint opcional.
 */
export function SliderField({ label, hint, value, min, max, step = 1, unit, onChange }) {
    const pct = ((value - min) / (max - min)) * 100;
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-foreground">{label}</label>
                <span className="text-xl font-extrabold tabular-nums text-primary">{value}{unit}</span>
            </div>
            <input
                type="range"
                min={min} max={max} step={step}
                value={value}
                onChange={e => onChange(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary"
                style={{
                    background: `linear-gradient(to right, var(--color-primary) ${pct}%, var(--color-muted) ${pct}%)`
                }}
            />
            {hint && <p className="text-xs text-muted-foreground mt-1.5">{hint}</p>}
        </div>
    );
}

/**
 * Preview en tiempo real de la condición académica de un alumno hipotético.
 */
export function CondicionPreview({ asistencia, nota, form }) {
    const cumpleAsistPromo = asistencia >= form.porcentaje_promocion;
    const cumpleAsistReg = asistencia >= form.porcentaje_regular;
    const cumpleNotaPromo = nota >= form.nota_promocion;
    const cumpleNotaReg = nota >= form.nota_regularidad;

    let estado, color, Icon;
    if (cumpleAsistPromo && cumpleNotaPromo) {
        estado = 'Promoción directa'; color = 'text-chart-2'; Icon = GraduationCap;
    } else if (cumpleAsistReg && cumpleNotaReg) {
        estado = 'Regular (rinde final)'; color = 'text-primary'; Icon = UserCheck;
    } else {
        estado = 'Libre'; color = 'text-destructive'; Icon = UserX;
    }

    return (
        <div className="flex items-center gap-2 text-sm font-bold mt-3">
            <span className="text-muted-foreground font-normal text-xs">→ quedaría:</span>
            <span className={`flex items-center gap-1.5 ${color}`}>
                <Icon size={14} /> {estado}
            </span>
        </div>
    );
}
