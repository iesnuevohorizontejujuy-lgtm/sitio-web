'use client';

import { numeroALetras } from '../types/planilla';

interface NotaInputProps {
    value: string;
    onChange: (val: string) => void;
    disabled: boolean;
    showLetras?: boolean;
    label?: string; // ej: "libre" | "mesa"
}

export function NotaInput({ value, onChange, disabled, showLetras = false, label }: NotaInputProps) {
    const numVal = parseFloat(value);
    const isLow = value !== '' && !isNaN(numVal) && numVal < 6;

    return (
        <div className="flex flex-col items-center gap-0.5">
            <input
                type="number"
                min="1"
                max="10"
                step="0.5"
                value={value}
                onChange={e => onChange(e.target.value)}
                disabled={disabled}
                placeholder="—"
                className={`w-11 text-center font-bold border rounded py-0.5 text-xs outline-none transition-all
                    disabled:opacity-50 disabled:bg-muted/50 disabled:cursor-not-allowed
                    ${isLow
                        ? 'text-destructive border-destructive/50 bg-destructive/5 focus:ring-1 focus:ring-destructive'
                        : 'border-border bg-card text-foreground hover:border-primary/50 focus:ring-1 focus:ring-primary'
                    }`}
            />
            {showLetras && (
                <span className={`text-[9px] font-medium capitalize ${isLow ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {value !== '' && !isNaN(numVal) ? numeroALetras(numVal) : '—'}
                </span>
            )}
            {label && (
                <span className="text-[9px] text-muted-foreground capitalize">{label}</span>
            )}
        </div>
    );
}
