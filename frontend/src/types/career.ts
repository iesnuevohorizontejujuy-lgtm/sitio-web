export type CareerArea =
  | "Salud"
  | "Tecnología"
  | "Gestión"
  | "Sociedad y comunicación"
  | "Actividad física";

export interface CareerSubject {
  name: string;
  year: number;
}

export interface CareerGalleryImage {
  id: number | string;
  url: string;
  alt: string;
  caption?: string | null;
}

export interface Career {
  id: number | null;
  title: string;
  slug: string;
  area: CareerArea;
  description: string;
  content?: string | null;
  duration: string;
  modality: string;
  resolutionCode?: string | null;
  image?: string | null;
  imageThumb?: string | null;
  planStudyUrl?: string | null;
  resolutionUrl?: string | null;
  subjects: CareerSubject[];
  capabilities: string[];
  employment: string[];
  gallery: CareerGalleryImage[];
}

export interface ApiCareer {
  id?: number;
  title?: string;
  nombre?: string;
  slug?: string;
  area?: CareerArea;
  categoria?: CareerArea;
  description?: string;
  descripcion?: string;
  content?: string | null;
  contenido?: string | null;
  duracion?: string;
  modalidad?: string;
  resolution_code?: string | null;
  resolucion_codigo?: string | null;
  image?: string | null;
  image_thumb?: string | null;
  plan_estudio?: string | null;
  resolucion?: string | null;
  subjects?: Array<{ name?: string; nombre?: string; year?: number; anio?: number }>;
  materias?: Array<{ name?: string; nombre?: string; year?: number; anio?: number }>;
  capabilities?: string[];
  capacidades?: string[];
  employment?: string[];
  salida_laboral?: string[];
  gallery?: CareerGalleryImage[];
}
