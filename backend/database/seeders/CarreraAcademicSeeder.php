<?php

namespace Database\Seeders;

use App\Models\Carrera;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CarreraAcademicSeeder extends Seeder
{
    public function run(): void
    {
        $editorialCatalog = $this->editorialCatalog();

        DB::transaction(function () use ($editorialCatalog): void {
            foreach ($this->academicCatalog() as $slug => $academicData) {
                $career = Carrera::query()->where('slug', $slug)->firstOrFail();
                $career->resolucion = $academicData['resolution'];
                $career->duracion_anios = 3;
                $career->modalidad = 'Presencial';

                foreach ($editorialCatalog[$slug] as $field => $value) {
                    if ($this->shouldSeedEditorialField($career, $field)) {
                        $career->setAttribute($field, $value);
                    }
                }

                $career->save();
                $this->seedMissingSubjects($career, $academicData['subjects']);
            }
        });
    }

    /**
     * @param  array<int, list<string>>  $subjectsByYear
     */
    private function seedMissingSubjects(Carrera $career, array $subjectsByYear): void
    {
        foreach ($subjectsByYear as $year => $subjectNames) {
            foreach ($subjectNames as $index => $subjectName) {
                $career->materias()->firstOrCreate(
                    ['anio' => $year, 'nombre' => $subjectName],
                    ['orden' => $index + 1],
                );
            }
        }
    }

    private function shouldSeedEditorialField(Carrera $career, string $field): bool
    {
        $currentValue = $career->getAttribute($field);

        if (blank($currentValue)) {
            return true;
        }

        if (is_string($currentValue)) {
            $plainText = html_entity_decode(strip_tags($currentValue), ENT_QUOTES | ENT_HTML5, 'UTF-8');

            if (preg_replace('/\s+/u', '', $plainText) === '') {
                return true;
            }
        }

        return $field === 'descripcion_corta' && in_array($currentValue, [
            'Formación técnica para acompañar el cuidado y el bienestar de la comunidad.',
            'Herramientas para crear, implementar y sostener soluciones tecnológicas.',
            'Formación práctica para organizar, administrar y potenciar instituciones.',
            'Conocimientos para intervenir, comunicar y acompañar procesos sociales.',
            'Preparación profesional orientada al movimiento, el rendimiento y la salud.',
        ], true);
    }

    /**
     * @return array<string, array{descripcion_corta: string, perfil_profesional: string}>
     */
    private function editorialCatalog(): array
    {
        return [
            'farmacia' => [
                'descripcion_corta' => 'Formación técnica para participar en la gestión, preparación y dispensación responsable de productos farmacéuticos.',
                'perfil_profesional' => 'La formación está orientada a colaborar en farmacias, servicios de salud y ámbitos de producción, aplicando criterios de calidad, bioseguridad, atención responsable y cumplimiento de la normativa vigente.',
            ],
            'cocinas-regionales-y-cultura-alimentaria' => [
                'descripcion_corta' => 'Formación gastronómica que integra técnicas culinarias, productos regionales y patrimonio alimentario.',
                'perfil_profesional' => 'La persona egresada podrá intervenir en la producción gastronómica y el diseño de propuestas culinarias, poniendo en valor ingredientes, saberes y culturas alimentarias regionales con criterios de calidad, seguridad y sustentabilidad.',
            ],
            'administracion-financiera' => [
                'descripcion_corta' => 'Herramientas para organizar recursos, analizar información y acompañar decisiones financieras.',
                'perfil_profesional' => 'La formación prepara para colaborar en la administración económica y financiera de organizaciones, elaborar información para la toma de decisiones y participar en procesos de presupuesto, costos, inversión y control.',
            ],
            'actividad-fisica-y-fitness' => [
                'descripcion_corta' => 'Formación para planificar y acompañar actividades físicas orientadas al bienestar y el acondicionamiento.',
                'perfil_profesional' => 'La persona egresada podrá diseñar, conducir y evaluar propuestas de actividad física y fitness para diferentes poblaciones, considerando objetivos, condición física, diversidad y prácticas seguras.',
            ],
            'agente-sanitario-y-promotor-de-la-salud' => [
                'descripcion_corta' => 'Formación territorial para promover la salud y acompañar a personas, familias y comunidades.',
                'perfil_profesional' => 'La formación está orientada al trabajo comunitario y territorial, la promoción de hábitos saludables, la prevención de enfermedades y la articulación entre la población y los equipos de salud.',
            ],
            'esterilizacion' => [
                'descripcion_corta' => 'Formación especializada en procesamiento, control y conservación segura de productos médicos.',
                'perfil_profesional' => 'La persona egresada podrá participar en centrales y servicios de esterilización, aplicando procedimientos de recepción, limpieza, acondicionamiento, esterilización, almacenamiento y trazabilidad bajo normas de calidad y bioseguridad.',
            ],
            'desarrollo-de-software' => [
                'descripcion_corta' => 'Formación para analizar, diseñar y desarrollar soluciones de software orientadas a necesidades reales.',
                'perfil_profesional' => 'La persona egresada podrá participar en el análisis, diseño, construcción, prueba e implementación de sistemas de software, integrándose a equipos de trabajo y aplicando criterios de calidad, seguridad y mejora continua.',
            ],
            'acompanamiento-terapeutico' => [
                'descripcion_corta' => 'Formación para acompañar procesos terapéuticos desde una perspectiva integral, ética y comunitaria.',
                'perfil_profesional' => 'La formación prepara para integrar dispositivos terapéuticos interdisciplinarios, acompañando a personas en su vida cotidiana y favoreciendo autonomía, inclusión, continuidad de cuidados y vínculos saludables.',
            ],
            'administracion-y-gestion-tributaria' => [
                'descripcion_corta' => 'Formación administrativa para interpretar y acompañar procesos impositivos, contables y tributarios.',
                'perfil_profesional' => 'La persona egresada podrá colaborar en la gestión tributaria de organizaciones y contribuyentes, organizar documentación, asistir en liquidaciones y aplicar procedimientos administrativos conforme a la normativa vigente.',
            ],
            'hemoterapia' => [
                'descripcion_corta' => 'Formación técnica para participar responsablemente en procesos vinculados con la sangre y sus componentes.',
                'perfil_profesional' => 'La formación está orientada a integrar servicios de hemoterapia y bancos de sangre, colaborando en la promoción de la donación, atención de donantes, procesamiento y conservación de componentes bajo estrictas normas de calidad y bioseguridad.',
            ],
            'enfermeria' => [
                'descripcion_corta' => 'Formación integral para brindar cuidados de enfermería a personas, familias y comunidades.',
                'perfil_profesional' => 'La persona egresada podrá brindar cuidados de enfermería en los distintos niveles de atención, participar en acciones de promoción y prevención, y trabajar de manera interdisciplinaria con compromiso ético y enfoque humanizado.',
            ],
            'gestion-juridica' => [
                'descripcion_corta' => 'Formación para asistir en procedimientos jurídicos, administrativos y de gestión documental.',
                'perfil_profesional' => 'La formación prepara para colaborar con profesionales y organizaciones en la gestión de expedientes, documentación, trámites y procesos jurídicos, aplicando criterios de confidencialidad, organización y responsabilidad.',
            ],
            'higiene-y-seguridad-en-el-trabajo' => [
                'descripcion_corta' => 'Formación para prevenir riesgos y promover ambientes de trabajo seguros y saludables.',
                'perfil_profesional' => 'La persona egresada podrá colaborar en la identificación y evaluación de riesgos laborales, proponer medidas preventivas, participar en capacitaciones y acompañar sistemas de gestión de higiene y seguridad.',
            ],
            'laboratorio-de-analisis-clinicos' => [
                'descripcion_corta' => 'Formación técnica para colaborar en procesos de laboratorio aplicados al diagnóstico y seguimiento de la salud.',
                'perfil_profesional' => 'La formación está orientada a participar en las etapas preanalítica, analítica y posanalítica del laboratorio clínico, aplicando procedimientos técnicos, normas de bioseguridad, control de calidad y trazabilidad.',
            ],
            'ninez-adolescencia-y-familia' => [
                'descripcion_corta' => 'Formación para acompañar derechos, cuidados y procesos sociales de niñas, niños, adolescentes y familias.',
                'perfil_profesional' => 'La persona egresada podrá participar en equipos y dispositivos de promoción y protección de derechos, acompañar situaciones familiares y comunitarias, y colaborar en proyectos de prevención, inclusión y fortalecimiento de vínculos.',
            ],
            'preparacion-fisica' => [
                'descripcion_corta' => 'Formación para planificar y conducir procesos de preparación física en diferentes contextos deportivos.',
                'perfil_profesional' => 'La formación prepara para evaluar capacidades físicas, diseñar planes de entrenamiento y acompañar procesos de mejora del rendimiento, respetando las características de cada disciplina y de las personas participantes.',
            ],
            'periodismo-y-nuevas-tecnologias' => [
                'descripcion_corta' => 'Formación periodística para investigar, producir y comunicar contenidos en medios y plataformas digitales.',
                'perfil_profesional' => 'La persona egresada podrá investigar temas de interés público, producir contenidos periodísticos en distintos lenguajes y gestionar proyectos de comunicación considerando criterios éticos, narrativas digitales y nuevas tecnologías.',
            ],
            'traduccion-tecnico-cientifica-en-ingles' => [
                'descripcion_corta' => 'Formación lingüística y técnica para traducir textos especializados entre inglés y español.',
                'perfil_profesional' => 'La formación prepara para abordar traducciones técnico-científicas con precisión terminológica, competencia lingüística y criterios profesionales, utilizando herramientas digitales y estrategias de documentación.',
            ],
            'soporte-tic' => [
                'descripcion_corta' => 'Formación para instalar, mantener y dar soporte a infraestructura, sistemas y servicios tecnológicos.',
                'perfil_profesional' => 'La persona egresada podrá diagnosticar problemas, mantener equipos y redes, administrar servicios informáticos y asistir a usuarios, aplicando criterios de seguridad, documentación y continuidad operativa.',
            ],
            'protesis-dental' => [
                'descripcion_corta' => 'Formación técnica para elaborar dispositivos y prótesis dentales con precisión, calidad y bioseguridad.',
                'perfil_profesional' => 'La formación está orientada al trabajo de laboratorio protésico dental, la interpretación de indicaciones profesionales y la elaboración, reparación y terminación de dispositivos con dominio de materiales, técnicas y controles de calidad.',
            ],
        ];
    }

    /**
     * @return array<string, array{resolution: string, subjects: array<int, list<string>>}>
     */
    private function academicCatalog(): array
    {
        return [
            'farmacia' => [
                'resolution' => 'Res. 740-E-S-22',
                'subjects' => [
                    1 => ['Matemática y Física Aplicada', 'Química General e Inorgánica', 'Salud Pública', 'Biología Humana', 'Higiene y Bioseguridad', 'Práctica Profesionalizante I'],
                    2 => ['Farmacología', 'Farmacotécnia', 'Microbiología General', 'Atención Primaria de la Salud', 'Informática y Procesos Técnicos', 'Farmacognosia', 'Práctica Profesionalizante II'],
                    3 => ['Patología', 'Org. y Gestión Serv. Salud', 'Prod. Biomédicos, Cosméticos...', 'Ética y Legislación Farmacéutica', 'Inglés Técnico', 'Adm. y Gestión de Calidad', 'Práctica Profesionalizante III'],
                ],
            ],
            'cocinas-regionales-y-cultura-alimentaria' => [
                'resolution' => 'Res. 3004-E-22',
                'subjects' => [
                    1 => ['Historia de la Alimentación', 'Introducción a la Gastronomía', 'Productos y Tecnologías Regionales', 'Bromatología, Higiene y Seguridad', 'Nutrición', 'Enología', 'Francés Gastronómico', 'Química Culinaria', 'Sistemas Alimentarios'],
                    2 => ['Gastronomía', 'Panadería', 'Práctica Profesionalizante I', 'Gastronomía Regional I', 'Análisis y Costos de Procesos', 'Ceremonial y Protocolo', 'Antropología Sociocultural', 'EDI I'],
                    3 => ['Gastronomía Regional II', 'Pastelería', 'Práctica Profesionalizante II', 'Administración y Marketing', 'Gastronomía Internacional', 'Agroindustria Rural', 'Metodología de la Inv. Gastro.', 'EDI II'],
                ],
            ],
            'administracion-financiera' => [
                'resolution' => 'Res. 840-E-23',
                'subjects' => [
                    1 => ['Matemática', 'Informática I', 'Derecho Civil y Comercial', 'Economía', 'Contabilidad', 'Inglés', 'Principios de Administración', 'Práctica Profesional I'],
                    2 => ['Matemática Financiera', 'Estadística', 'Inglés Técnico', 'Administración Financiera I', 'Comercio Internacional', 'Impuestos', 'Informática II', 'Práctica Profesional II'],
                    3 => ['Análisis Proyectos de Inversión', 'Elementos Mercado Financiero', 'Técnica y Contabilidad Bancaria', 'Análisis Interp. Est. Contables', 'Administración Financiera II', 'Ética y Deontología Profesional', 'Práctica Profesional III'],
                ],
            ],
            'actividad-fisica-y-fitness' => [
                'resolution' => 'Res. 6304-E-22',
                'subjects' => [
                    1 => ['Inglés', 'Anatomía y Fisiología', 'Entrenam. Funcional y Musculación', 'Personal Trainer', 'Prácticas de Integración', 'Evaluación de la Condición Física'],
                    2 => ['Fisiología de la Actividad Física', 'Nuevas Tendencias en Entrenamiento', 'Planificación de la Actividad Física', 'Prácticas de Especialización', 'Elaboración de Proyectos Deportivos'],
                    3 => ['Nutrición', 'Infraestructura y Equipamientos', 'Actividad Física para la Diversidad', 'Práctica Profesional'],
                ],
            ],
            'agente-sanitario-y-promotor-de-la-salud' => [
                'resolution' => 'Res. 3466-E/S-22',
                'subjects' => [
                    1 => ['Anatomía y Fisiología Humana', 'Salud y Políticas Públicas', 'Comunicación Sanitaria', 'Psicología', 'Epidemiología y Estadística', 'Introducción al campo del A.S.', 'Interculturalidad en Salud', 'Regionalización Sanitaria y Población', 'Seguridad Alimentaria', 'Práctica I'],
                    2 => ['Psicología Evolutiva', 'Metodología de la Inv. en Salud', 'Enfermería Aplicada en APS', 'Enf. Transmisibles y No Transm.', 'Salud Com. y Ed. para la Salud', 'Informática en Salud', 'Equipo de Salud y Redes', 'Adm. y Sist. de Información CAPS', 'Práctica II', 'EDI I'],
                    3 => ['Educación Salud Sexual Integral', 'Ética y Legislación Sanitaria', 'Salud Materno Infantil', 'Salud del Adolescente y Mayor', 'Salud Mental', 'Salud y Discapacidad', 'Proyectos e Intervención Com.', 'EDI II', 'Práctica III'],
                ],
            ],
            'esterilizacion' => [
                'resolution' => 'Res. 3720-E/S-23',
                'subjects' => [
                    1 => ['Biología', 'Física', 'Química', 'Higiene y Bioseguridad', 'Microbiología', 'Esterilización', 'Práctica Profesional I'],
                    2 => ['Salud Pública', 'Organización y Gestión de Inst.', 'Ética, Deontología y Ejercicio Prof.', 'Primeros Auxilios', 'Estadística', 'Cond. y Medio Amb. de Trabajo', 'Práctica Profesional II'],
                    3 => ['Biomateriales y Prod. Médicos', 'Comunicación y Equipos de Salud', 'Sistema de Calidad en Procesos', 'Actitudes Rel. Ejercicio Prof.', 'Inglés', 'Procesos Tecnológicos Espec.', 'Práctica Profesional III'],
                ],
            ],
            'desarrollo-de-software' => [
                'resolution' => 'Res. 2730-E-22',
                'subjects' => [
                    1 => ['Álgebra', 'Inglés', 'EDI I', 'Metodología de la Investigación', 'Informática', 'Programación I', 'Arquitectura de Computadoras', 'Administración y Organizaciones', 'Análisis Matemático'],
                    2 => ['Inglés Técnico', 'Programación II', 'Bases de Datos', 'Sistemas Operativos', 'Redes Informáticas', 'Análisis y Diseño', 'Estructura de Datos', 'Seguridad Informática', 'Práctica Profesionalizante I', 'Estadística y Probabilidad'],
                    3 => ['EDI II', 'Ética y Deontología Profesional', 'Programación III', 'Legislación', 'Emprendedurismo Tecnológico', 'Diseño de Interface', 'Ingeniería de Software', 'Práctica Profesionalizante II'],
                ],
            ],
            'acompanamiento-terapeutico' => [
                'resolution' => 'Res. 5570-E-S-23',
                'subjects' => [
                    1 => ['Introducción al Acomp. Terap.', 'Primeros Auxilios', 'Bases Biológicas del Comp. Hum.', 'Psicología General', 'Psicología Des. Niñez y Adol.', 'Psicología Social y Comunitaria', 'Pol. Públicas y Leg. en Salud', 'EDI I', 'Práctica I'],
                    2 => ['Neurofisiopatología', 'Metodología de la Investigación', 'Teorías y Estrategias de Abordaje', 'Psicología Des. Adulto y Mayor', 'Psicopatología I', 'Estrategias de Abordaje Familiar', 'Psicomotricidad Aplicada al A.T.', 'Análisis de las Org. e Inst.', 'Dinámica de Grupo', 'Práctica II'],
                    3 => ['Bioética y Deontología', 'Principios de Farmacología', 'Psicopatología II', 'TIC en el Acomp. Terapéutico', 'Discapacidad e Inclusión', 'Técnicas de Abordaje de A.T.', 'Taller de Redacción de Informes', 'Taller de Casos Clínicos', 'Abordajes de Urgencias en S.M.', 'Práctica III', 'EDI II'],
                ],
            ],
            'administracion-y-gestion-tributaria' => [
                'resolution' => 'Res. 2768-E-16',
                'subjects' => [
                    1 => ['Matemática', 'Informática', 'Contabilidad General', 'Derecho Público y Privado', 'Introducción a la Administración', 'Administración General', 'Introducción a la Economía', 'Microeconomía', 'Formulación y Eval. de Proyectos', 'Inglés'],
                    2 => ['Estadística', 'Matemática Financiera', 'Contabilidad Superior', 'Estructuras y Procesos', 'Administración Aplicada', 'Inglés Técnico', 'Impuestos I', 'Impuestos II', 'Informática Aplicada a la Trib.', 'Práctica Prof. I: Técnicas Impositivas'],
                    3 => ['Análisis e Interp. Estados Contables', 'Costos y Presupuestos', 'Administración Financiera', 'Macroeconomía', 'Finanzas Públicas', 'Ética y Deontología Profesional', 'Comercialización y Estudios de Mercados', 'Práctica Profesionalizante II'],
                ],
            ],
            'hemoterapia' => [
                'resolution' => 'Res. 749-E/S-23',
                'subjects' => [
                    1 => ['Educación y Salud', 'Biología, Genética e Inmunología', 'Anatomía y Fisiología Humana', 'Hemoterapia y Hemodonación', 'Psicología Evolutiva', 'Metodología de la Investigación', 'Primeros Auxilios', 'Higiene y Seguridad Laboral', 'Práctica I'],
                    2 => ['Microbiología y Epidemiología', 'Calificación Biológica', 'Taller de Calificación Biológica', 'Ética y Aspectos Legales', 'Preparación Productos Sanguíneos', 'Inglés Técnico', 'Informática', 'Práctica II', 'EDI I'],
                    3 => ['Fisiopatología Feto-neonatal', 'Gestión y Calidad en Bancos', 'Bioética', 'Fisiopatología Aplicada', 'Transfusión', 'Psicología de Org. de Salud', 'Inmunohematología', 'Práctica III', 'EDI II'],
                ],
            ],
            'enfermeria' => [
                'resolution' => 'Res. 3586-E/S-22',
                'subjects' => [
                    1 => ['Fundamentos Enf. Básica y Com.', 'Anatomía y Fisiología Humana', 'Microbiología y Parasitología', 'Expresión Oral y Escrita', 'Física y Química Aplicada a Enf.', 'Antropología Filosófica y Soc. Cult.', 'Informática Básica', 'Práctica Profesionalizante I'],
                    2 => ['Enf. Médica y Especialidades', 'Ética y Marco Legal en la Práctica', 'Farmacología', 'Nutrición', 'Enf. Quirúrgica y Especialidades', 'Psicología', 'Introducción a Metodología Inv.', 'EDI I', 'Práctica Profesionalizante II'],
                    3 => ['Enf. Materno Infanto Juvenil', 'Informática Aplicada a Enf.', 'Inglés Técnico', 'Organización y Gestión en Enf.', 'Enfermería en Salud Mental', 'EDI II', 'Práctica Profesionalizante III'],
                ],
            ],
            'gestion-juridica' => [
                'resolution' => 'Res. 3748-E-22',
                'subjects' => [
                    1 => ['Matemática Financiera', 'Derecho Civil y Comercial', 'Administración', 'Economía', 'Informática', 'Atención al Cliente', 'Práctica Profesionalizante I'],
                    2 => ['Inglés', 'Informática Aplicada a la Gestión', 'Comunicación Oral y Escrita', 'Derecho Laboral y Seg. Social', 'Contabilidad', 'Gestión del Tiempo y Org. Trabajo', 'Práctica Profesionalizante II'],
                    3 => ['Ética y Deontología Profesional', 'Derecho Público', 'Derecho de Familia y Sucesiones', 'Régimen Tributario de Empresas', 'Gestión y Planificación Estratégica', 'Derecho Penal', 'Práctica Profesionalizante III'],
                ],
            ],
            'higiene-y-seguridad-en-el-trabajo' => [
                'resolution' => 'Res. 6055-E-23',
                'subjects' => [
                    1 => ['Física', 'Química Aplicada', 'Matemática', 'Informática', 'Organización en el Trabajo', 'Legislación en el Trabajo', 'Higiene en el Trabajo I', 'Seguridad en el Trabajo I', 'Práctica Profesionalizante I', 'Psicología Laboral y Rel. Humanas', 'Inglés Técnico'],
                    2 => ['Seguridad en el Trabajo II', 'Higiene en el Trabajo II', 'Hig. y Seg. en Cont. Particulares', 'Estudio del Trabajo y Ergonomía', 'Probabilidad y Estadística', 'Práctica Profesionalizante II', 'EDI I'],
                    3 => ['Capacitación Laboral', 'Gestión Integrada', 'Medicina del Trabajo', 'Sistemas de Representación', 'Ética y Deontología Profesional', 'EDI II', 'Formulación y Eval. de Proyectos', 'Práctica Profesionalizante III'],
                ],
            ],
            'laboratorio-de-analisis-clinicos' => [
                'resolution' => 'Res. 3523-E/S-23',
                'subjects' => [
                    1 => ['Física', 'Matemática', 'Química General e Inorgánica', 'Higiene y Bioseguridad', 'Biología', 'Estado y Sociedad', 'Comunicación Oral y Escrita', 'Práctica Profesionalizante I'],
                    2 => ['Salud Pública', 'Química Orgánica', 'Microbiología General', 'Anatomía, Histología y Fisiología', 'Inmunología General', 'Inglés Técnico', 'Organización y Gestión de Inst. Salud', 'Práctica Profesionalizante II'],
                    3 => ['Primeros Auxilios', 'Inmunohematología', 'Bioquímica Clínica', 'Ética y Deontología Profesional', 'Proc. Tecnológicos Específicos', 'Tecnología de la Información y Com.', 'Práctica Profesionalizante III'],
                ],
            ],
            'ninez-adolescencia-y-familia' => [
                'resolution' => 'Res. 965-E-23',
                'subjects' => [
                    1 => ['Introducción a la Niñez, Adol. y Flia.', 'Derecho de Niñez, Adol. y Flia.', 'Psicología Social', 'Protección de Derechos y Políticas Soc.', 'Problemática y Abordaje del Menor I', 'Psicología del Desarrollo y Recreación', 'Sociología de la Educación', 'Práctica Profesionalizante I'],
                    2 => ['Problemática y Abordaje del Menor II', 'Gestión Jurídica Administrativa', 'Metodología de la Investigación Social', 'Derecho Penal: Jóvenes en Conflicto', 'Educación Sexual Integral', 'Seguridad Alimentaria', 'Políticas Públicas y Programas Sociales', 'Práctica Profesionalizante II'],
                    3 => ['Análisis Institucional', 'Ética Profesional', 'Sistema de Familias Complejos', 'Derecho y Salud', 'Planificación y Evaluación de Proyectos', 'Mediación y Resolución de Conflictos', 'Práctica Profesionalizante III'],
                ],
            ],
            'preparacion-fisica' => [
                'resolution' => 'Res. 1302-E-23',
                'subjects' => [
                    1 => ['Inglés Técnico', 'Anatomía y Fisiología', 'Entrenamiento I', 'Actividad Física y Salud', 'Práctica Profesionalizante I'],
                    2 => ['Evaluación de la Condición Física', 'Fisiología del Ejercicio', 'Entrenamiento II', 'EDI I', 'Práctica Profesionalizante II'],
                    3 => ['Elaboración de Proyectos Deportivos', 'Nutrición Deportiva', 'EDI II', 'Biomecánica del Ap. Locomotor', 'Práctica Profesionalizante III'],
                ],
            ],
            'periodismo-y-nuevas-tecnologias' => [
                'resolution' => 'Res. 6186-E-22',
                'subjects' => [
                    1 => ['Introducción a la Comunicación', 'Historia del Periodismo Argentino', 'Economía', 'Política', 'Narrativas y Redacción I', 'Tecnologías de la Info. y Com.', 'Semiótica', 'Producción Periodística', 'Practicas Profesionalizantes I'],
                    2 => ['Sociología', 'Antropología', 'Comunicación Organizacional', 'Narrativas y Redacción II', 'Locución I', 'Herramientas Multimedia', 'Asp. Legales y Jur. Comunicación', 'Metodología de la Investigación', 'Marketing y Audiencia', 'Deportes', 'Practicas Profesionalizantes II'],
                    3 => ['Economía y Política', 'Análisis Discursos Sociales', 'Prob. Mundo Contemporáneo', 'Ética Profesional', 'Sitios Web y Publicidad Digital', 'Locución II', 'Periodismo Policial y Judicial', 'Practicas Profesionalizantes III'],
                ],
            ],
            'traduccion-tecnico-cientifica-en-ingles' => [
                'resolution' => 'Res. 3332-E-22',
                'subjects' => [
                    1 => ['Lengua Inglesa I', 'Gramática Inglesa I', 'Gramática Castellana I', 'Comprensión de Textos en Castellano', 'Introducción a la Traducción', 'Herramientas Inf. Aplicadas a Trad.'],
                    2 => ['Lengua Inglesa II', 'Gramática Inglesa II', 'Gramática Castellana II', 'Fonética y Dicción I', 'Estudios Socioculturales', 'Redacción y Corrección en Castellano', 'Traducción Técnico Científica I'],
                    3 => ['Lengua Inglesa III', 'Fonética y Dicción II', 'Lingüística Aplicada a la Traducción', 'Introd. Interpretación Lengua Ingl.', 'Ética Profesional y Régimen Legal', 'Traducción Periodística', 'Práctica Trad. Técn. Científica II'],
                ],
            ],
            'soporte-tic' => [
                'resolution' => 'Res. 2772-E-22',
                'subjects' => [
                    1 => ['Inglés', 'Álgebra', 'Análisis Matemático', 'Tecnologías de la Información', 'Arquitectura de Computadoras', 'Bases de Datos I', 'Sistemas Operativos I', 'Organización y Adm. Empresas', 'Prácticas Profesionalizantes I', 'Expresión Oral y Escrita'],
                    2 => ['Inglés Técnico', 'Probabilidades y Estadísticas', 'Programación', 'Bases de Datos II', 'Redes', 'Sistemas Operativos II', 'Prácticas Profesionalizantes II', 'EDI I'],
                    3 => ['Ética Profesional', 'Legislación Informática', 'Seguridad Informática', 'Adm. y Mantenimiento Redes', 'Administración de Servidores', 'Ajuste y Opt. Bases de Datos', 'Prácticas Profesionalizantes III', 'EDI II'],
                ],
            ],
            'protesis-dental' => [
                'resolution' => 'Res. 5594-E/S-23',
                'subjects' => [
                    1 => ['Prótesis Removible Acrílica', 'Materiales Dentales e Inst.', 'Anatomía y Fisiología Dentaria', 'Bioseguridad y Epid. Bucal', 'Oclusión', 'Matemática y Est. Aplicada', 'Práctica Profesionalizante I'],
                    2 => ['Prótesis Fijas', 'Metalurgia y Soldadura', 'Administración y Gestión de Lab.', 'Prótesis Superpuesta', 'Práctica Profesionalizante II'],
                    3 => ['Prótesis Removible Definitiva', 'Implantes y Cerámicas', 'Ética Profesional y Legislación', 'Ortodoncia y Ortopedia Dentomax.', 'EDI', 'Práctica Profesionalizante III'],
                ],
            ],
        ];
    }
}
