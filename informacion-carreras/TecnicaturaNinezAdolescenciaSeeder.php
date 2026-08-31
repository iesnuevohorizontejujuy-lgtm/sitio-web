<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Carrera;
use App\Models\Materia;
use Database\Seeders\Concerns\EnsuresCareerModules;

class TecnicaturaNinezAdolescenciaSeeder extends Seeder
{
    use EnsuresCareerModules;

    public function run()
    {
        // 1. Crear o buscar la Carrera
        $carrera = Carrera::firstOrCreate(
            ['nombre' => 'Tecnicatura Superior en Niñez, Adolescencia y Familia'],
            [
                'slug' => \Illuminate\Support\Str::slug('Ninez, Adolescencia y Familia'),
                'resolucion' => 'Res. 965-E-23',
                'modalidad' => 'Presencial',
                'duracion' => '3 años',
                'activa' => true
            ]
        );

        $modulosPorAnio = $this->ensureCareerModules($carrera);

        // 2. Definir las Materias (N° de Orden => Datos)
        $materiasData = [
            // --- 1° AÑO ---
            1  => ['nombre' => 'Introducción a la Niñez, Adol. y Flia.', 'anio' => 1],
            2  => ['nombre' => 'Derecho de Niñez, Adol. y Flia.', 'anio' => 1],
            3  => ['nombre' => 'Psicología Social', 'anio' => 1],
            4  => ['nombre' => 'Protección de Derechos y Políticas Soc.', 'anio' => 1],
            5  => ['nombre' => 'Problemática y Abordaje del Menor I', 'anio' => 1],
            6  => ['nombre' => 'Psicología del Desarrollo y Recreación', 'anio' => 1],
            7  => ['nombre' => 'Sociología de la Educación', 'anio' => 1],
            8  => ['nombre' => 'Práctica Profesionalizante I', 'anio' => 1],

            // --- 2° AÑO ---
            9  => ['nombre' => 'Problemática y Abordaje del Menor II', 'anio' => 2],
            10 => ['nombre' => 'Gestión Jurídica Administrativa', 'anio' => 2],
            11 => ['nombre' => 'Metodología de la Investigación Social', 'anio' => 2],
            12 => ['nombre' => 'Derecho Penal: Jóvenes en Conflicto', 'anio' => 2],
            13 => ['nombre' => 'Educación Sexual Integral', 'anio' => 2],
            14 => ['nombre' => 'Seguridad Alimentaria', 'anio' => 2],
            15 => ['nombre' => 'Políticas Públicas y Programas Sociales', 'anio' => 2],
            16 => ['nombre' => 'Práctica Profesionalizante II', 'anio' => 2],

            // --- 3° AÑO ---
            17 => ['nombre' => 'Análisis Institucional', 'anio' => 3],
            18 => ['nombre' => 'Ética Profesional', 'anio' => 3],
            19 => ['nombre' => 'Sistema de Familias Complejos', 'anio' => 3],
            20 => ['nombre' => 'Derecho y Salud', 'anio' => 3],
            21 => ['nombre' => 'Planificación y Evaluación de Proyectos', 'anio' => 3],
            22 => ['nombre' => 'Mediación y Resolución de Conflictos', 'anio' => 3],
            23 => ['nombre' => 'Práctica Profesionalizante III', 'anio' => 3],
        ];

        $materiasInsertadas = [];

        // 3. Insertar Materias
        foreach ($materiasData as $orden => $data) {
            $materia = Materia::updateOrCreate(
                [
                    'carrera_id' => $carrera->id,
                    'orden'      => $orden
                ],
                [
                    'nombre'  => $data['nombre'],
                    'modulo_id' => $modulosPorAnio[$data['anio']] ?? null,
                    'anio'    => $data['anio'],
                    'regimen' => 'Anual' // Por defecto
                ]
            );
            $materiasInsertadas[$orden] = $materia->id;
        }

        // 4. Definir Correlatividades
        $correlatividadesData = [
            9  => ['regulares' => [5], 'aprobadas' => [5]],
            12 => ['regulares' => [2], 'aprobadas' => [2]],
            15 => ['regulares' => [2, 4], 'aprobadas' => [4]],
            16 => ['regulares' => [], 'aprobadas' => [8]],
            17 => ['regulares' => [4, 5, 6, 9], 'aprobadas' => [4, 5]],
            18 => ['regulares' => [8, 9], 'aprobadas' => [8]],
            19 => ['regulares' => [5, 9], 'aprobadas' => [5, 9]],
            20 => ['regulares' => [4, 12], 'aprobadas' => [4]],
            21 => ['regulares' => [11], 'aprobadas' => [11]],
            // 22 Requiere 1er año (1 al 8), 9 y 15
            22 => [
                'regulares' => [1, 2, 3, 4, 5, 6, 7, 8, 9, 15], 
                'aprobadas' => [1, 2, 3, 4, 5, 6, 7, 8, 9, 15]
            ],
            // 23 Requiere 9 al 15 regulares y 2do año completo (9 al 16) aprobado
            23 => [
                'regulares' => [9, 10, 11, 12, 13, 14, 15], 
                'aprobadas' => [9, 10, 11, 12, 13, 14, 15, 16]
            ],
        ];

        // 5. Insertar Correlatividades (Limpiamos primero las de esta carrera para evitar duplicados si se corre varias veces)
        DB::table('materia_materia')
            ->whereIn('materia_id', array_values($materiasInsertadas))
            ->delete();

        foreach ($correlatividadesData as $ordenMateria => $requisitos) {
            if (!isset($materiasInsertadas[$ordenMateria])) continue;
            
            $materiaId = $materiasInsertadas[$ordenMateria];

            // Requerimientos para Regularizar
            if (isset($requisitos['regulares']) && !empty($requisitos['regulares'])) {
                foreach ($requisitos['regulares'] as $ordenReq) {
                    if ($ordenMateria === $ordenReq || !isset($materiasInsertadas[$ordenReq])) continue;
                    
                    DB::table('materia_materia')->insert([
                        'materia_id'         => $materiaId,
                        'related_materia_id' => $materiasInsertadas[$ordenReq],
                        'condicion'          => 'regular',
                        'created_at'         => now(),
                        'updated_at'         => now(),
                    ]);
                }
            }

            // Requerimientos para Aprobar
            if (isset($requisitos['aprobadas']) && !empty($requisitos['aprobadas'])) {
                foreach ($requisitos['aprobadas'] as $ordenReq) {
                    if ($ordenMateria === $ordenReq || !isset($materiasInsertadas[$ordenReq])) continue;

                    DB::table('materia_materia')->insert([
                        'materia_id'         => $materiaId,
                        'related_materia_id' => $materiasInsertadas[$ordenReq],
                        'condicion'          => 'aprobada',
                        'created_at'         => now(),
                        'updated_at'         => now(),
                    ]);
                }
            }
        }
    }
}
