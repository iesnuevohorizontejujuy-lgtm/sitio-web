export interface HomepageSlide {
  id: number | string;
  etiqueta: string;
  titulo: string;
  bajada: string;
  imagen_escritorio: string;
  imagen_movil: string | null;
  imagen_alt: string;
  texto_boton: string;
  url_boton: string;
  texto_boton_secundario: string | null;
  url_boton_secundario: string | null;
}
