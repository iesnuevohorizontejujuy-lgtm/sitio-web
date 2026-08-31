<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Carrera;
use App\Models\Materia;
use Database\Seeders\Concerns\EnsuresCareerModules;
use Illuminate\Support\Str;

class TecnicaturaPeriodismoNuevasTecnologiasSeeder extends Seeder
{
    use EnsuresCareerModules;

    public function run()
    {
        // 1. Crear o buscar la Carrera
        $carrera = Carrera::firstOrCreate(
            ['nombre' => 'Tecnicatura Superior en Periodismo y Nuevas Tecnologías'],
            [
                'slug' => Str::slug('Periodismo y Nuevas Tecnologias'),
                'resolucion' => 'Res. 6186-E-22',
                'modalidad' => 'Presencial',
                'duracion' => '3 años',
                'activa' => true
            ]
        );

        $modulosPorAnio = $this->ensureCareerModules($carrera);

        // 2. Definir las Materias (N° de Orden => Datos)
        $materiasData = [
            // --- 1° AÑO ---
            1  => ['nombre' => 'Introducción a la Comunicación', 'anio' => 1],
            2  => ['nombre' => 'Historia del Periodismo Argentino', 'anio' => 1],
            3  => ['nombre' => 'Economía', 'anio' => 1],
            4  => ['nombre' => 'Política', 'anio' => 1],
            5  => ['nombre' => 'Narrativas y Redacción I', 'anio' => 1],
            6  => ['nombre' => 'Tecnologías de la Info. y Com.', 'anio' => 1],
            7  => ['nombre' => 'Semiótica', 'anio' => 1],
            8  => ['nombre' => 'Producción Periodística', 'anio' => 1],
            9  => ['nombre' => 'Practicas Profesionalizantes I', 'anio' => 1],

            // --- 2° AÑO ---
            10 => ['nombre' => 'Sociología', 'anio' => 2],
            11 => ['nombre' => 'Antropología', 'anio' => 2],
            12 => ['nombre' => 'Comunicación Organizacional', 'anio' => 2],
            13 => ['nombre' => 'Narrativas y Redacción II', 'anio' => 2],
            14 => ['nombre' => 'Locución I', 'anio' => 2],
            15 => ['nombre' => 'Herramientas Multimedia', 'anio' => 2],
            16 => ['nombre' => 'Asp. Legales y Jur. Comunicación', 'anio' => 2],
            17 => ['nombre' => 'Metodología de la Investigación', 'anio' => 2],
            18 => ['nombre' => 'Marketing y Audiencia', 'anio' => 2],
            19 => ['nombre' => 'Deportes', 'anio' => 2],
            20 => ['nombre' => 'Practicas Profesionalizantes II', 'anio' => 2],

            // --- 3° AÑO ---
            21 => ['nombre' => 'Economía y Política', 'anio' => 3],
            22 => ['nombre' => 'Análisis Discursos Sociales', 'anio' => 3],
            23 => ['nombre' => 'Prob. Mundo Contemporáneo', 'anio' => 3],
            24 => ['nombre' => 'Ética Profesional', 'anio' => 3],
            25 => ['nombre' => 'Sitios Web y Publicidad Digital', 'anio' => 3],
            26 => ['nombre' => 'Locución II', 'anio' => 3],
            27 => ['nombre' => 'Periodismo Policial y Judicial', 'anio' => 3],
            28 => ['nombre' => 'Practicas Profesionalizantes III', 'anio' => 3],
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
                    'regimen' => 'Anual'
                ]
            );
            $materiasInsertadas[$orden] = $materia->id;
        }

        // 4. Definir Correlatividades [Materia => ['regulares' => [Req], 'aprobadas' => [Req]]]
        $correlatividadesData = [
            10 => ['regulares' => [3, 4], 'aprobadas' => [4]],
            11 => ['regulares' => [3, 4], 'aprobadas' => [4]],
            12 => ['regulares' => [1, 7], 'aprobadas' => [1]],
            13 => ['regulares' => [5], 'aprobadas' => [5]],
            14 => ['regulares' => [2], 'aprobadas' => [2]],
            15 => ['regulares' => [6], 'aprobadas' => [6]],
            18 => ['regulares' => [3], 'aprobadas' => [3]],
            19 => ['regulares' => [8], 'aprobadas' => [8]],
            // 20 requiere 1 al 7 Regulares y 1er año aprobado (1 al 9)
            20 => [
                'regulares' => [1, 2, 3, 4, 5, 6, 7], 
                'aprobadas' => [1, 2, 3, 4, 5, 6, 7, 8, 9]
            ],
            21 => ['regulares' => [10], 'aprobadas' => []],
            22 => ['regulares' => [10, 11], 'aprobadas' => [10, 11]],
            23 => ['regulares' => [10, 11], 'aprobadas' => [10, 11]],
            24 => ['regulares' => [16], 'aprobadas' => [16]],
            25 => ['regulares' => [18], 'aprobadas' => [18]],
            26 => ['regulares' => [14], 'aprobadas' => [14]],
            27 => ['regulares' => [16, 20], 'aprobadas' => [16, 20]],
            // 28 requiere 10 al 19 Regulares y 2do año aprobado (10 al 20)
            28 => [
                'regulares' => [10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 
                'aprobadas' => [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            ],
        ];

        // 5. Insertar Correlatividades
        DB::table('materia_materia')
            ->whereIn('materia_id', array_values($materiasInsertadas))
            ->delete();

        foreach ($correlatividadesData as $ordenMateria => $requisitos) {
            if (!isset($materiasInsertadas[$ordenMateria])) continue;
            
            $materiaId = $materiasInsertadas[$ordenMateria];

            // Requerimientos para Regularizar
            if (!empty($requisitos['regulares'])) {
                foreach ($requisitos['regulares'] as $ordenReq) {
                    if (isset($materiasInsertadas[$ordenReq])) {
                        DB::table('materia_materia')->insert([
                            'materia_id'         => $materiaId,
                            'related_materia_id' => $materiasInsertadas[$ordenReq],
                            'condicion'          => 'regular',
                            'created_at'         => now(),
                            'updated_at'         => now(),
                        ]);
                    }
                }
            }

            // Requerimientos para Aprobar
            if (!empty($requisitos['aprobadas'])) {
                foreach ($requisitos['aprobadas'] as $ordenReq) {
                    if (isset($materiasInsertadas[$ordenReq])) {
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
}
