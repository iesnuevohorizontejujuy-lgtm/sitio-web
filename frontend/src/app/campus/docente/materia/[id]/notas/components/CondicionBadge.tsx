'use client';

import { GraduationCap, UserCheck, UserX } from 'lucide-react';

interface CondicionBadgeProps {
    condicion: string | null | undefined;
}

type Style = {
    text: string;
    bg: string;
    Icon: React.ComponentType<{ size?: number }> | null;
};

function getCondStyles(condicion: string | null | undefined): Style {
    switch (condicion?.toLowerCase()) {
        case 'promocionado':
        case 'aprobado':
            return {
                text: 'text-green-700 dark:text-green-400',
                bg: 'bg-green-100 dark:bg-green-900/30',
                Icon: GraduationCap,
            };
        case 'regularizado':
            return {
                text: 'text-blue-700 dark:text-blue-400',
                bg: 'bg-blue-100 dark:bg-blue-900/30',
                Icon: UserCheck,
            };
        case 'libre':
            return {
                text: 'text-red-700 dark:text-red-400',
                bg: 'bg-red-100 dark:bg-red-900/30',
                Icon: UserX,
            };
        default:
            return { text: 'text-muted-foreground', bg: 'bg-muted', Icon: null };
    }
}

export function CondicionBadge({ condicion }: CondicionBadgeProps) {
    const { text, bg, Icon } = getCondStyles(condicion);
    return (
        <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase whitespace-nowrap ${bg} ${text}`}
        >
            {Icon && <Icon size={9} />}
            {condicion ?? '—'}
        </span>
    );
}
