import type { Metadata } from "next";
import { NHDocsClient } from "@/components/institutional/NHDocsClient";

export const metadata: Metadata = {
  title: "Consulta de expedientes",
  description: "Consulta pública del estado y los movimientos de expedientes del IES Nuevo Horizonte.",
  alternates: { canonical: "/nhdocs" },
  robots: { index: false, follow: false },
};

type NHDocsPageProps = {
  searchParams: Promise<{ codigo?: string | string[] }>;
};

export default async function NHDocsPage({ searchParams }: NHDocsPageProps) {
  const params = await searchParams;
  const requestedCode = Array.isArray(params.codigo) ? params.codigo[0] : params.codigo;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return <NHDocsClient initialCode={requestedCode ?? ""} siteUrl={siteUrl} />;
}
