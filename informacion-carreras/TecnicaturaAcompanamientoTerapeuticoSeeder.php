<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Carrera;
use App\Models\Materia;
use Database\Seeders\Concerns\EnsuresCareerModules;
use Illuminate\Support\Str;

class TecnicaturaAcompanamientoTerapeuticoSeeder extends Seeder
{
    use EnsuresCareerModules;

    public function run()
    {
        // 1. Crear o buscar la Carrera
        $carrera = Carrera::firstOrCreate(
            ['nombre' => 'Tecnicatura Superior en Acompañamiento Terapéutico'],
            [
                'slug' => Str::slug('Acompanamiento Terapeutico'),
                'resolucion' => 'Res. 5570-E-S-23',
                'modalidad' => 'Presencial',
                'duracion' => '3 años',
                'activa' => true
            ]
        );

        $modulosPorAnio = $this->ensureCareerModules($carrera);

        // 2. Definir las Materias (N° de Orden => Datos)
        $materiasData = [
            // --- 1° AÑO ---
            1  => ['nombre' => 'Introducción al Acomp. Terap.', 'anio' => 1],
            2  => ['nombre' => 'Primeros Auxilios', 'anio' => 1],
            3  => ['nombre' => 'Bases Biológicas del Comp. Hum.', 'anio' => 1],
            4  => ['nombre' => 'Psicología General', 'anio' => 1],
            5  => ['nombre' => 'Psicología Des. Niñez y Adol.', 'anio' => 1],
            6  => ['nombre' => 'Psicología Social y Comunitaria', 'anio' => 1],
            7  => ['nombre' => 'Pol. Públicas y Leg. en Salud', 'anio' => 1],
            8  => ['nombre' => 'EDI I', 'anio' => 1],
            9  => ['nombre' => 'Práctica I', 'anio' => 1],

            // --- 2° AÑO ---
            10 => ['nombre' => 'Neurofisiopatología', 'anio' => 2],
            11 => ['nombre' => 'Metodología de la Investigación', 'anio' => 2],
            12 => ['nombre' => 'Teorías y Estrategias de Abordaje', 'anio' => 2],
            13 => ['nombre' => 'Psicología Des. Adulto y Mayor', 'anio' => 2],
            14 => ['nombre' => 'Psicopatología I', 'anio' => 2],
            15 => ['nombre' => 'Estrategias de Abordaje Familiar', 'anio' => 2],
            16 => ['nombre' => 'Psicomotricidad Aplicada al A.T.', 'anio' => 2],
            17 => ['nombre' => 'Análisis de las Org. e Inst.', 'anio' => 2],
            18 => ['nombre' => 'Dinámica de Grupo', 'anio' => 2],
            19 => ['nombre' => 'Práctica II', 'anio' => 2],

            // --- 3° AÑO ---
            20 => ['nombre' => 'Bioética y Deontología', 'anio' => 3],
            21 => ['nombre' => 'Principios de Farmacología', 'anio' => 3],
            22 => ['nombre' => 'Psicopatología II', 'anio' => 3],
            23 => ['nombre' => 'TIC en el Acomp. Terapéutico', 'anio' => 3],
            24 => ['nombre' => 'Discapacidad e Inclusión', 'anio' => 3],
            25 => ['nombre' => 'Técnicas de Abordaje de A.T.', 'anio' => 3],
            26 => ['nombre' => 'Taller de Redacción de Informes', 'anio' => 3],
            27 => ['nombre' => 'Taller de Casos Clínicos', 'anio' => 3],
            28 => ['nombre' => 'Abordajes de Urgencias en S.M.', 'anio' => 3],
            29 => ['nombre' => 'Práctica III', 'anio' => 3],
            30 => ['nombre' => 'EDI II', 'anio' => 3],
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
            10 => ['regulares' => [3], 'aprobadas' => [3]],
            11 => ['regulares' => [1], 'aprobadas' => [1]],
            12 => ['regulares' => [1, 4], 'aprobadas' => [1, 4, 5]],
            13 => ['regulares' => [1, 4, 5], 'aprobadas' => [1, 4, 5]],
            14 => ['regulares' => [1, 4], 'aprobadas' => [1, 4]],
            15 => ['regulares' => [4, 5], 'aprobadas' => [4, 5]],
            16 => ['regulares' => [2, 3], 'aprobadas' => [2, 3]],
            17 => ['regulares' => [6, 7], 'aprobadas' => [6, 7]],
            18 => ['regulares' => [4, 6], 'aprobadas' => [4, 6]],
            19 => ['regulares' => [1, 2, 4, 7, 9], 'aprobadas' => [1, 2, 4, 7, 9]],
            20 => ['regulares' => [7, 17], 'aprobadas' => [7, 17]],
            21 => ['regulares' => [1, 2, 3, 10], 'aprobadas' => [1, 2, 3, 10]],
            22 => ['regulares' => [1, 4, 10, 14], 'aprobadas' => [1, 4, 10, 14]],
            23 => ['regulares' => [1, 12], 'aprobadas' => [1, 12]],
            24 => ['regulares' => [4, 5, 12, 13, 15], 'aprobadas' => [4, 5, 12, 13, 15]],
            25 => ['regulares' => [1, 4, 9, 12], 'aprobadas' => [1, 4, 9, 12]],
            26 => ['regulares' => [1, 11], 'aprobadas' => [1, 11]],
            27 => ['regulares' => [12, 14], 'aprobadas' => [12, 14]],
            28 => ['regulares' => [2, 3, 14], 'aprobadas' => [2, 3, 14]],
            // 29 requiere 12 al 18 regulares y 12 al 19 aprobadas
            29 => [
                'regulares' => [12, 13, 14, 15, 16, 17, 18], 
                'aprobadas' => [12, 13, 14, 15, 16, 17, 18, 19]
            ],
        ];

        // 5. Insertar Correlatividades
        DB::table('materia_materia')
            ->whereIn('materia_id', array_values($materiasInsertadas))
            ->delete();

        foreach ($correlatividadesData as $ordenMateria => $requisitos) {
            if (!isset($materiasInsertadas[$ordenMateria])) continue;
            
            $materiaId = $materiasInsertadas[$ordenMateria];

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
