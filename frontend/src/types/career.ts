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

export type CareerSocialPlatform = "instagram" | "youtube" | "facebook" | "tiktok";

export interface CareerSocialPost {
  id: number | string;
  platform: CareerSocialPlatform;
  type: "reel" | "publicacion" | "video" | "actividad";
  title: string;
  description?: string | null;
  url: string;
  account?: string | null;
  publishedAt?: string | null;
  buttonLabel: string;
  previewImage?: string | null;
  previewAlt?: string | null;
}

export interface Career {
  id: number | null;
  title: string;
  shortTitle?: string | null;
  slug: string;
  area: CareerArea;
  description: string;
  content?: string | null;
  duration: string;
  modality: string;
  resolutionCode?: string | null;
  awardedTitle?: string | null;
  image?: string | null;
  imageThumb?: string | null;
  planStudyUrl?: string | null;
  resolutionUrl?: string | null;
  subjects: CareerSubject[];
  capabilities: string[];
  employment: string[];
  gallery: CareerGalleryImage[];
  socialPosts: CareerSocialPost[];
}

export interface ApiCareer {
  id?: number;
  title?: string;
  nombre?: string;
  short_title?: string | null;
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
  titulo_otorgado?: string | null;
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
  social_posts?: Array<{
    id: number | string;
    platform: CareerSocialPlatform;
    type: CareerSocialPost["type"];
    title: string;
    description?: string | null;
    url: string;
    account?: string | null;
    published_at?: string | null;
    button_label?: string | null;
    preview_image?: string | null;
    preview_alt?: string | null;
  }>;
}
