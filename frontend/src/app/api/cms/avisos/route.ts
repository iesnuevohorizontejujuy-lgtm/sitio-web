import { NextResponse } from "next/server";
import { cmsApiFetch } from "@/lib/cms-api";

export async function GET() {
  try {
    const response = await cmsApiFetch("/avisos");
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
      { message: "No pudimos consultar los avisos del instituto." },
      { status: 503 },
    );
  }
}
