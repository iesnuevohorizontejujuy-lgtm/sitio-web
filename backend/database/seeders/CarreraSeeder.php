<?php

namespace Database\Seeders;

use App\Models\Carrera;
use Illuminate\Database\Seeder;

class CarreraSeeder extends Seeder
{
    public function run(): void
    {
        $careers = [
            ['Tecnicatura Superior en Farmacia', 'farmacia', 'Salud'],
            ['Tecnicatura Superior en Cocinas Regionales y Cultura Alimentaria', 'cocinas-regionales-y-cultura-alimentaria', 'Gestión'],
            ['Tecnicatura Superior en Administración Financiera', 'administracion-financiera', 'Gestión'],
            ['Tecnicatura Superior en Actividad Física y Fitness', 'actividad-fisica-y-fitness', 'Actividad física'],
            ['Tecnicatura Superior en Agente Sanitario y Promotor de la Salud', 'agente-sanitario-y-promotor-de-la-salud', 'Salud'],
            ['Tecnicatura Superior en Esterilización', 'esterilizacion', 'Salud'],
            ['Tecnicatura Superior en Desarrollo de Software', 'desarrollo-de-software', 'Tecnología'],
            ['Tecnicatura Superior en Acompañamiento Terapéutico', 'acompanamiento-terapeutico', 'Salud'],
            ['Tecnicatura Superior en Administración y Gestión Tributaria', 'administracion-y-gestion-tributaria', 'Gestión'],
            ['Tecnicatura Superior en Hemoterapia', 'hemoterapia', 'Salud'],
            ['Tecnicatura Superior en Enfermería', 'enfermeria', 'Salud'],
            ['Tecnicatura Superior en Gestión Jurídica', 'gestion-juridica', 'Gestión'],
            ['Tecnicatura Superior en Higiene y Seguridad en el Trabajo', 'higiene-y-seguridad-en-el-trabajo', 'Tecnología'],
            ['Tecnicatura Superior en Laboratorio de Análisis Clínicos', 'laboratorio-de-analisis-clinicos', 'Salud'],
            ['Tecnicatura Superior en Niñez, Adolescencia y Familia', 'ninez-adolescencia-y-familia', 'Sociedad y comunicación'],
            ['Tecnicatura Superior en Preparación Física', 'preparacion-fisica', 'Actividad física'],
            ['Tecnicatura Superior en Periodismo y Nuevas Tecnologías', 'periodismo-y-nuevas-tecnologias', 'Sociedad y comunicación'],
            ['Tecnicatura Superior en Traducción Técnico Científica en Inglés', 'traduccion-tecnico-cientifica-en-ingles', 'Sociedad y comunicación'],
            ['Tecnicatura Superior en Soporte TIC', 'soporte-tic', 'Tecnología'],
            ['Tecnicatura Superior en Prótesis Dental', 'protesis-dental', 'Salud'],
        ];

        foreach ($careers as $index => [$name, $slug, $area]) {
            Carrera::updateOrCreate(
                ['slug' => $slug],
                [
                    'nombre' => $name,
                    'area' => $area,
                    'duracion_anios' => 3,
                    'modalidad' => 'Presencial',
                    'descripcion_corta' => $this->areaDescription($area),
                    'publicada' => true,
                    'orden' => $index + 1,
                ],
            );
        }

        $this->seedSoftwareCareer();
    }

    private function seedSoftwareCareer(): void
    {
        $career = Carrera::where('slug', 'desarrollo-de-software')->firstOrFail();
        $career->update([
            'descripcion_corta' => 'Formación para analizar, diseñar y desarrollar soluciones de software orientadas a necesidades reales.',
            'resolucion' => 'Res. 2730-E-22',
            'capacidades' => [
                'Desarrollar aplicaciones',
                'Diseñar y gestionar bases de datos',
                'Administrar sistemas y redes',
                'Aplicar criterios de seguridad informática',
                'Participar en equipos de desarrollo de software',
            ],
            'salida_laboral' => [
                'Empresas de software y áreas de desarrollo',
                'Áreas de sistemas de organizaciones públicas y privadas',
                'Consultoría y soporte tecnológico',
                'Emprendimientos y proyectos propios',
            ],
        ]);

        $subjects = [
            1 => ['Álgebra', 'Inglés', 'EDI I', 'Metodología de la Investigación', 'Informática', 'Programación I', 'Arquitectura de Computadoras', 'Administración y Organizaciones', 'Análisis Matemático'],
            2 => ['Inglés Técnico', 'Programación II', 'Bases de Datos', 'Sistemas Operativos', 'Redes Informáticas', 'Análisis y Diseño', 'Estructura de Datos', 'Seguridad Informática', 'Práctica Profesionalizante I', 'Estadística y Probabilidad'],
            3 => ['EDI II', 'Ética y Deontología Profesional', 'Programación III', 'Legislación', 'Emprendedurismo Tecnológico', 'Diseño de Interface', 'Ingeniería de Software', 'Práctica Profesionalizante II'],
        ];

        $career->materias()->delete();

        foreach ($subjects as $year => $names) {
            foreach ($names as $order => $name) {
                $career->materias()->create([
                    'nombre' => $name,
                    'anio' => $year,
                    'orden' => $order + 1,
                ]);
            }
        }
    }

    private function areaDescription(string $area): string
    {
        return match ($area) {
            'Salud' => 'Formación técnica para acompañar el cuidado y el bienestar de la comunidad.',
            'Tecnología' => 'Herramientas para crear, implementar y sostener soluciones tecnológicas.',
            'Gestión' => 'Formación práctica para organizar, administrar y potenciar instituciones.',
            'Sociedad y comunicación' => 'Conocimientos para intervenir, comunicar y acompañar procesos sociales.',
            'Actividad física' => 'Preparación profesional orientada al movimiento, el rendimiento y la salud.',
            default => '',
        };
    }
}
