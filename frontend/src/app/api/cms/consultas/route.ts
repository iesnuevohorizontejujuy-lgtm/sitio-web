import { NextRequest, NextResponse } from "next/server";
import { cmsApiFetch } from "@/lib/cms-api";

export async function POST(request: NextRequest) {
  let body: string;

  try {
    body = await request.text();
  } catch {
    return NextResponse.json(
      { message: "Los datos enviados no son válidos." },
      { status: 400 },
    );
  }

  try {
    const response = await cmsApiFetch("/consultas", {
      method: "POST",
      body,
    });
    const responseBody = await response.text();

    return new NextResponse(responseBody, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "No pudimos enviar la consulta. Intentá nuevamente en unos minutos." },
      { status: 503 },
    );
  }
}
