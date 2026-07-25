import { NextRequest, NextResponse } from "next/server";
import { academicApiFetch } from "@/lib/academic-api";

type ExamPermitPayload = {
  carrera_id?: unknown;
  apellido?: unknown;
  nombres?: unknown;
  dni?: unknown;
  telefono?: unknown;
  fecha?: unknown;
  llamado?: unknown;
  materias?: unknown;
};

const isFilledString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export async function POST(request: NextRequest) {
  let payload: ExamPermitPayload;

  try {
    payload = (await request.json()) as ExamPermitPayload;
  } catch {
    return NextResponse.json({ message: "Los datos enviados no son válidos." }, { status: 400 });
  }

  const valid =
    (typeof payload.carrera_id === "number" || /^\d+$/.test(String(payload.carrera_id))) &&
    isFilledString(payload.apellido) &&
    isFilledString(payload.nombres) &&
    isFilledString(payload.dni) &&
    isFilledString(payload.telefono) &&
    isFilledString(payload.fecha) &&
    isFilledString(payload.llamado) &&
    Array.isArray(payload.materias) &&
    payload.materias.length >= 1 &&
    payload.materias.length <= 8 &&
    payload.materias.every((item) => {
      if (!item || typeof item !== "object") return false;
      const materia = item as Record<string, unknown>;
      return (
        /^\d+$/.test(String(materia.materia_id)) &&
        (materia.condicion === "REGULAR" || materia.condicion === "LIBRE") &&
        /^\d{4}-\d{2}-\d{2}$/.test(String(materia.fecha_examen))
      );
    });

  if (!valid) {
    return NextResponse.json(
      { message: "Revisá los datos personales y seleccioná entre una y ocho materias." },
      { status: 422 },
    );
  }

  try {
    const response = await academicApiFetch("/fichas-permiso", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const body = await response.text();

    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "No pudimos registrar el permiso. Intentá nuevamente en unos minutos." },
      { status: 503 },
    );
  }
}
