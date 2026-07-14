export type InstitutionalNewsCategory = "general" | "fecha_importante";

export interface InstitutionalNewsItem {
  id: number | string;
  titulo: string;
  slug: string;
  contenido: string;
  categoria: InstitutionalNewsCategory;
  created_at: string;
  fecha_evento: string | null;
  video_url: string | null;
  imagen_principal: string | null;
  imagen_thumb: string | null;
}

export interface InstitutionalNewsCollection {
  fechas_importantes: InstitutionalNewsItem[];
  generales: InstitutionalNewsItem[];
}
