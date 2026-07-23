import { NextRequest, NextResponse } from "next/server";
import { academicApiFetch } from "@/lib/academic-api";

export async function GET(request: NextRequest) {
  const careerId = request.nextUrl.searchParams.get("carrera_id");

  if (careerId && !/^\d+$/.test(careerId)) {
    return NextResponse.json({ message: "La carrera seleccionada no es válida." }, { status: 422 });
  }

  const path = careerId ? `/carreras/${careerId}/materias` : "/carreras";

  try {
    const response = await academicApiFetch(path);
    const body = await response.text();

    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "El sistema académico no está disponible en este momento." },
      { status: 503 },
    );
  }
}
