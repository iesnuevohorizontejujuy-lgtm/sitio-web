export type ExamPermitEditorialContent = {
  id: number;
  titulo: string;
  introduccion: string;
  indicaciones: string[];
  advertencia_titulo: string | null;
  advertencia: string | null;
};
