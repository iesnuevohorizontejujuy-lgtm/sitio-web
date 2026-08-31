export type InstitutionalNewsCategory =
  | "general"
  | "actividad"
  | "jornada"
  | "practica"
  | "convenio"
  | "fecha_importante";

export interface InstitutionalNewsItem {
  id: number | string;
  titulo: string;
  slug: string;
  contenido: string;
  categoria: InstitutionalNewsCategory;
  created_at: string;
  publicada_at: string | null;
  fecha_evento: string | null;
  fecha_fin_evento: string | null;
  lugar_evento: string | null;
  destacada: boolean;
  orden_destacado: number | null;
  video_url: string | null;
  imagen_principal: string | null;
  imagen_thumb: string | null;
}

export interface InstitutionalNewsCollection {
  destacadas: InstitutionalNewsItem[];
  noticias: InstitutionalNewsItem[];
  agenda: InstitutionalNewsItem[];
  fechas_importantes: InstitutionalNewsItem[];
  generales: InstitutionalNewsItem[];
}
