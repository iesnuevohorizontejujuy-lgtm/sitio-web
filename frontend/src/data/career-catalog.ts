import type { Career } from "@/types/career";

const common = {
  id: null,
  duration: "3 años",
  modality: "Presencial",
  content: null,
  image: null,
  imageThumb: null,
  planStudyUrl: null,
  resolutionUrl: null,
  resolutionCode: null,
  subjects: [],
  capabilities: [],
  employment: [],
  gallery: [],
} satisfies Omit<Career, "title" | "slug" | "area" | "description">;

const descriptions = {
  Salud: "Formación técnica para acompañar el cuidado y el bienestar de la comunidad.",
  Tecnología: "Herramientas para crear, implementar y sostener soluciones tecnológicas.",
  Gestión: "Formación práctica para organizar, administrar y potenciar instituciones.",
  "Sociedad y comunicación": "Conocimientos para intervenir, comunicar y acompañar procesos sociales.",
  "Actividad física": "Preparación profesional orientada al movimiento, el rendimiento y la salud.",
} as const;

const entry = (
  title: string,
  slug: string,
  area: Career["area"],
): Career => ({ ...common, title, slug, area, description: descriptions[area] });

export const careerCatalog: Career[] = [
  entry("Tecnicatura Superior en Farmacia", "farmacia", "Salud"),
  entry("Tecnicatura Superior en Cocinas Regionales y Cultura Alimentaria", "cocinas-regionales-y-cultura-alimentaria", "Gestión"),
  entry("Tecnicatura Superior en Administración Financiera", "administracion-financiera", "Gestión"),
  entry("Tecnicatura Superior en Actividad Física y Fitness", "actividad-fisica-y-fitness", "Actividad física"),
  entry("Tecnicatura Superior en Agente Sanitario y Promotor de la Salud", "agente-sanitario-y-promotor-de-la-salud", "Salud"),
  entry("Tecnicatura Superior en Esterilización", "esterilizacion", "Salud"),
  {
    ...entry("Tecnicatura Superior en Desarrollo de Software", "desarrollo-de-software", "Tecnología"),
    description: "Formación para analizar, diseñar y desarrollar soluciones de software orientadas a necesidades reales.",
    resolutionCode: "Res. 2730-E-22",
    subjects: [
      { name: "Álgebra", year: 1 },
      { name: "Inglés", year: 1 },
      { name: "EDI I", year: 1 },
      { name: "Metodología de la Investigación", year: 1 },
      { name: "Informática", year: 1 },
      { name: "Programación I", year: 1 },
      { name: "Arquitectura de Computadoras", year: 1 },
      { name: "Administración y Organizaciones", year: 1 },
      { name: "Análisis Matemático", year: 1 },
      { name: "Inglés Técnico", year: 2 },
      { name: "Programación II", year: 2 },
      { name: "Bases de Datos", year: 2 },
      { name: "Sistemas Operativos", year: 2 },
      { name: "Redes Informáticas", year: 2 },
      { name: "Análisis y Diseño", year: 2 },
      { name: "Estructura de Datos", year: 2 },
      { name: "Seguridad Informática", year: 2 },
      { name: "Práctica Profesionalizante I", year: 2 },
      { name: "Estadística y Probabilidad", year: 2 },
      { name: "EDI II", year: 3 },
      { name: "Ética y Deontología Profesional", year: 3 },
      { name: "Programación III", year: 3 },
      { name: "Legislación", year: 3 },
      { name: "Emprendedurismo Tecnológico", year: 3 },
      { name: "Diseño de Interface", year: 3 },
      { name: "Ingeniería de Software", year: 3 },
      { name: "Práctica Profesionalizante II", year: 3 },
    ],
    capabilities: [
      "Desarrollar aplicaciones",
      "Diseñar y gestionar bases de datos",
      "Administrar sistemas y redes",
      "Aplicar criterios de seguridad informática",
      "Participar en equipos de desarrollo de software",
    ],
    employment: [
      "Empresas de software y áreas de desarrollo",
      "Áreas de sistemas de organizaciones públicas y privadas",
      "Consultoría y soporte tecnológico",
      "Emprendimientos y proyectos propios",
    ],
  },
  entry("Tecnicatura Superior en Acompañamiento Terapéutico", "acompanamiento-terapeutico", "Salud"),
  entry("Tecnicatura Superior en Administración y Gestión Tributaria", "administracion-y-gestion-tributaria", "Gestión"),
  entry("Tecnicatura Superior en Hemoterapia", "hemoterapia", "Salud"),
  entry("Tecnicatura Superior en Enfermería", "enfermeria", "Salud"),
  entry("Tecnicatura Superior en Gestión Jurídica", "gestion-juridica", "Gestión"),
  entry("Tecnicatura Superior en Higiene y Seguridad en el Trabajo", "higiene-y-seguridad-en-el-trabajo", "Tecnología"),
  entry("Tecnicatura Superior en Laboratorio de Análisis Clínicos", "laboratorio-de-analisis-clinicos", "Salud"),
  entry("Tecnicatura Superior en Niñez, Adolescencia y Familia", "ninez-adolescencia-y-familia", "Sociedad y comunicación"),
  entry("Tecnicatura Superior en Preparación Física", "preparacion-fisica", "Actividad física"),
  entry("Tecnicatura Superior en Periodismo y Nuevas Tecnologías", "periodismo-y-nuevas-tecnologias", "Sociedad y comunicación"),
  entry("Tecnicatura Superior en Traducción Técnico Científica en Inglés", "traduccion-tecnico-cientifica-en-ingles", "Sociedad y comunicación"),
  entry("Tecnicatura Superior en Soporte TIC", "soporte-tic", "Tecnología"),
  entry("Tecnicatura Superior en Prótesis Dental", "protesis-dental", "Salud"),
];

export const careerAreas: Array<"Todas" | Career["area"]> = [
  "Todas",
  "Salud",
  "Tecnología",
  "Gestión",
  "Sociedad y comunicación",
  "Actividad física",
];

export const findCatalogCareer = (slug: string) =>
  careerCatalog.find((career) => career.slug === slug) ?? null;
