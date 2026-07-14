'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';

export function ModeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="w-[88px] h-8" />;

    const isDark = theme === 'dark';

    return (
        <div className="flex items-center gap-1.5 p-1 transition-all duration-300">
            <button
                onClick={() => setTheme('light')}
                aria-label="Activar modo claro"
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full p-1"
            >
                <Sun
                    className={`h-[18px] w-[18px] transition-all duration-300 ${!isDark
                            ? 'text-amber-400 scale-110 drop-shadow-sm'
                            : 'text-slate-400 hover:text-slate-300 scale-90 opacity-60'
                        }`}
                />
            </button>

            <Switch
                checked={isDark}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                aria-label="Cambiar tema"
                className="scale-90 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-slate-300 dark:data-[state=unchecked]:bg-slate-600 shadow-inner m-0"
            />

            <button
                onClick={() => setTheme('dark')}
                aria-label="Activar modo oscuro"
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full p-1"
            >
                <Moon
                    className={`h-[18px] w-[18px] transition-all duration-300 ${isDark
                            ? 'text-blue-400 scale-110 drop-shadow-sm'
                            : 'text-slate-400 hover:text-slate-300 scale-90 opacity-60'
                        }`}
                />
            </button>
        </div>
    );
}