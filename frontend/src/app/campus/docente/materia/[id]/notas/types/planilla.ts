// ── Tipos compartidos del módulo de Planilla de Evaluación ──

export type AlumnoData = {
    id: number;
    alumno: string;
    dni: string;
    modalidad: string;
    estado_actual: string;
    condicion_proyectada: string | null;
    nota_final: string | number | null;
    stats: {
        asistencia: number;
        tps: number;
    };
    notas_parciales: Record<string, string | number>;
    tps_entregados: number[];
};

export type ParcialDefinido = {
    id: number;
    fecha?: string | null;
    nombre?: string;
};

export type ParcialMapped = {
    label: string;
    backendName: string;
    rec: boolean;
    id?: number;
    fecha?: string | null;
    existe: boolean;
};

export type PlanillaData = {
    carrera: string;
    materia: string;
    curso_nombre: string;
    turno: string;
    division: string;
    profesor: string;
    anio: string | number;
    parciales_definidos: (ParcialDefinido | null)[];
    tps_definidos: unknown[];
    alumnos: AlumnoData[];
};

// ── Utilidad: número a letras (1–10 con mitades) ──
export const numeroALetras = (num: number | string | null | undefined): string => {
    if (num == null || num === '') return '—';
    const floatNum = parseFloat(num.toString());
    if (isNaN(floatNum)) return '—';
    const entero = Math.floor(floatNum);
    let dec = Math.round((floatNum - entero) * 100);
    const base = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];
    let texto = base[entero] ?? entero.toString();
    if (dec > 0) {
        if (dec === 50) dec = 5;
        texto += ` con ${dec}`;
    }
    return texto;
};
