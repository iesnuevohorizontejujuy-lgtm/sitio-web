export type SiteNoticePresentation = "modal" | "franja" | "banner";
export type SiteNoticeFrequency = "siempre" | "sesion" | "una_vez";

export interface SiteNotice {
  id: number;
  titulo: string;
  mensaje: string;
  imagen: string | null;
  presentacion: SiteNoticePresentation;
  paginas: string[];
  texto_enlace: string | null;
  url_enlace: string | null;
  frecuencia: SiteNoticeFrequency;
  prioridad: number;
}
