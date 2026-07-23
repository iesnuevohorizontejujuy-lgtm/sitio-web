import { NextRequest, NextResponse } from "next/server";
import { academicApiFetch } from "@/lib/academic-api";

const allowedDocuments = new Set(["pdf", "comprobante"]);

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string; documento: string }> },
) {
  const { id, documento } = await context.params;

  if (!/^\d+$/.test(id) || !allowedDocuments.has(documento)) {
    return NextResponse.json({ message: "El documento solicitado no es válido." }, { status: 404 });
  }

  try {
    const response = await academicApiFetch(`/fichas-permiso/${id}/${documento}`);
    const body = await response.arrayBuffer();
    const headers = new Headers();

    headers.set("Content-Type", response.headers.get("Content-Type") ?? "application/pdf");
    const disposition = response.headers.get("Content-Disposition");
    if (disposition) headers.set("Content-Disposition", disposition);

    return new NextResponse(body, { status: response.status, headers });
  } catch {
    return NextResponse.json(
      { message: "El documento todavía no está disponible." },
      { status: 503 },
    );
  }
}
