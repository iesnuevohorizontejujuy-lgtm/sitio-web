import type { MetadataRoute } from "next";
import { getCareers } from "@/lib/careers";
import { getInstitutionalNews } from "@/lib/institutional-news";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [careers, news] = await Promise.all([getCareers(), getInstitutionalNews()]);
  const staticRoutes = ["", "/institucion", "/carreras", "/ingresantes", "/permisos-examen", "/vida-institucional", "/noticias"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      changeFrequency: route === "" ? "weekly" as const : "monthly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
    ...careers.map((career) => ({
      url: `${siteUrl}/carreras/${career.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...[...news.generales, ...news.fechas_importantes].map((item) => ({
      url: `${siteUrl}/vida-institucional/${item.slug}`,
      lastModified: new Date(item.created_at),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
