import { NextResponse } from "next/server";
import { academicApiFetch } from "@/lib/academic-api";

export async function GET() {
  try {
    const response = await academicApiFetch("/fichas-permiso-configuracion");
    const body = await response.text();

    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "No pudimos consultar la convocatoria de permisos." },
      { status: 503 },
    );
  }
}
