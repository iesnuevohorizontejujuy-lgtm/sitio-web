export type AdmissionStatus = "proximamente" | "abiertas" | "cerradas";

export type AdmissionDocument = {
  nombre: string;
  url: string;
};

export type AdmissionFaq = {
  pregunta: string;
  respuesta: string;
};

export type AdmissionCall = {
  id: number;
  titulo: string;
  ciclo_lectivo: string;
  estado: AdmissionStatus;
  bajada: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  requisitos: string[];
  documentos: AdmissionDocument[];
  preguntas_frecuentes: AdmissionFaq[];
};
