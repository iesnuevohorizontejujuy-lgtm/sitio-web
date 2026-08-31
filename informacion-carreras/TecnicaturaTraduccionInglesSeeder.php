<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Carrera;
use App\Models\Materia;
use Database\Seeders\Concerns\EnsuresCareerModules;
use Illuminate\Support\Str;

class TecnicaturaTraduccionInglesSeeder extends Seeder
{
    use EnsuresCareerModules;

    public function run()
    {
        // 1. Crear o buscar la Carrera
        $carrera = Carrera::firstOrCreate(
            ['nombre' => 'Tecnicatura Superior en Traducción Técnico Científica en Inglés'],
            [
                'slug' => Str::slug('Traduccion Tecnico Cientifica en Ingles'),
                'resolucion' => 'Res. 3332-E-22',
                'modalidad' => 'Presencial',
                'duracion' => '3 años',
                'activa' => true
            ]
        );

        $modulosPorAnio = $this->ensureCareerModules($carrera);

        // 2. Definir las Materias (N° de Orden => Datos)
        $materiasData = [
            // --- 1° AÑO ---
            1  => ['nombre' => 'Lengua Inglesa I', 'anio' => 1],
            2  => ['nombre' => 'Gramática Inglesa I', 'anio' => 1],
            3  => ['nombre' => 'Gramática Castellana I', 'anio' => 1],
            4  => ['nombre' => 'Comprensión de Textos en Castellano', 'anio' => 1],
            5  => ['nombre' => 'Introducción a la Traducción', 'anio' => 1],
            6  => ['nombre' => 'Herramientas Inf. Aplicadas a Trad.', 'anio' => 1],

            // --- 2° AÑO ---
            7  => ['nombre' => 'Lengua Inglesa II', 'anio' => 2],
            8  => ['nombre' => 'Gramática Inglesa II', 'anio' => 2],
            9  => ['nombre' => 'Gramática Castellana II', 'anio' => 2],
            10 => ['nombre' => 'Fonética y Dicción I', 'anio' => 2],
            11 => ['nombre' => 'Estudios Socioculturales', 'anio' => 2],
            12 => ['nombre' => 'Redacción y Corrección en Castellano', 'anio' => 2],
            13 => ['nombre' => 'Traducción Técnico Científica I', 'anio' => 2],

            // --- 3° AÑO ---
            14 => ['nombre' => 'Lengua Inglesa III', 'anio' => 3],
            15 => ['nombre' => 'Fonética y Dicción II', 'anio' => 3],
            16 => ['nombre' => 'Lingüística Aplicada a la Traducción', 'anio' => 3],
            17 => ['nombre' => 'Introd. Interpretación Lengua Ingl.', 'anio' => 3],
            18 => ['nombre' => 'Ética Profesional y Régimen Legal', 'anio' => 3],
            19 => ['nombre' => 'Traducción Periodística', 'anio' => 3],
            20 => ['nombre' => 'Práctica Trad. Técn. Científica II', 'anio' => 3],
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
            7  => ['regulares' => [1, 2], 'aprobadas' => [1, 2]],
            8  => ['regulares' => [1, 2], 'aprobadas' => [1, 2]],
            9  => ['regulares' => [3, 4], 'aprobadas' => [3, 4]],
            10 => ['regulares' => [1, 2], 'aprobadas' => [1, 2]],
            12 => ['regulares' => [3, 4], 'aprobadas' => [3, 4]],
            13 => ['regulares' => [1, 2, 3, 4, 5], 'aprobadas' => [1, 2, 3, 4, 5]],
            
            // 14 requiere 1° año completo (1-6), 7, 8, 10
            14 => [
                'regulares' => [1, 2, 3, 4, 5, 6, 7, 8, 10], 
                'aprobadas' => [1, 2, 3, 4, 5, 6, 7, 8, 10]
            ],
            // 15 requiere 1° año completo (1-6), 7, 8, 10
            15 => [
                'regulares' => [1, 2, 3, 4, 5, 6, 7, 8, 10], 
                'aprobadas' => [1, 2, 3, 4, 5, 6, 7, 8, 10]
            ],
            // 16 requiere 1° año completo (1-6), 7, 8, 9, 13
            16 => [
                'regulares' => [1, 2, 3, 4, 5, 6, 7, 8, 9, 13], 
                'aprobadas' => [1, 2, 3, 4, 5, 6, 7, 8, 9, 13]
            ],
            // 17 requiere 1° año completo (1-6), 7, 8
            17 => [
                'regulares' => [1, 2, 3, 4, 5, 6, 7, 8], 
                'aprobadas' => [1, 2, 3, 4, 5, 6, 7, 8]
            ],
            // 19 requiere 1° año completo (1-6), 8, 9, 12
            19 => [
                'regulares' => [1, 2, 3, 4, 5, 6, 8, 9, 12], 
                'aprobadas' => [1, 2, 3, 4, 5, 6, 8, 9, 12]
            ],
            // 20 requiere 1° año completo (1-6), 8, 9, 12, 13
            20 => [
                'regulares' => [1, 2, 3, 4, 5, 6, 8, 9, 12, 13], 
                'aprobadas' => [1, 2, 3, 4, 5, 6, 8, 9, 12, 13]
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
