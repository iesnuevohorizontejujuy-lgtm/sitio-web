'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function CarreraFilter({ carreras = [], selectedCarreraId = null, className = '' }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const options = Array.isArray(carreras) ? carreras : [];

    const selectedValue = useMemo(() => {
        if (!selectedCarreraId) return '';
        return String(selectedCarreraId);
    }, [selectedCarreraId]);

    if (options.length <= 1) {
        return null;
    }

    const onChangeCarrera = (event) => {
        const value = event.target.value;
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set('carrera_id', value);
        } else {
            params.delete('carrera_id');
        }

        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname);
    };

    return (
        <div className={className}>
            <label htmlFor="carrera_id" className="block text-sm font-semibold text-foreground mb-2">
          
            </label>
            <select
                id="carrera_id"
                value={selectedValue}
                onChange={onChangeCarrera}
                className="w-full md:w-[420px] rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
                {options.map((carrera) => (
                    <option key={carrera.id} value={String(carrera.id)}>
                        {carrera.nombre}
                    </option>
                ))}
            </select>
        </div>
    );
}
