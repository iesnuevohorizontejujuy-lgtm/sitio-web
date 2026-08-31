<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Carrera;
use App\Models\Materia;
use Database\Seeders\Concerns\EnsuresCareerModules;
use Illuminate\Support\Str;

class TecnicaturaDesarrolloSoftwareSeeder extends Seeder
{
    use EnsuresCareerModules;

    public function run()
    {
        // 1. Crear o buscar la Carrera
        $carrera = Carrera::firstOrCreate(
            ['nombre' => 'Tecnicatura Superior en Desarrollo de Software'],
            [
                'slug' => Str::slug('Desarrollo de Software'),
                'resolucion' => 'Res. 2730-E-22',
                'modalidad' => 'Presencial',
                'duracion' => '3 años',
                'activa' => true
            ]
        );

        $modulosPorAnio = $this->ensureCareerModules($carrera);

        // 2. Definir las Materias (N° de Orden => Datos)
        $materiasData = [
            // --- 1° AÑO ---
            1  => ['nombre' => 'Álgebra', 'anio' => 1],
            2  => ['nombre' => 'Inglés', 'anio' => 1],
            3  => ['nombre' => 'EDI I', 'anio' => 1],
            4  => ['nombre' => 'Metodología de la Investigación', 'anio' => 1],
            5  => ['nombre' => 'Informática', 'anio' => 1],
            6  => ['nombre' => 'Programación I', 'anio' => 1],
            7  => ['nombre' => 'Arquitectura de Computadoras', 'anio' => 1],
            8  => ['nombre' => 'Administración y Organizaciones', 'anio' => 1],
            9  => ['nombre' => 'Análisis Matemático', 'anio' => 1],

            // --- 2° AÑO ---
            10 => ['nombre' => 'Inglés Técnico', 'anio' => 2],
            11 => ['nombre' => 'Programación II', 'anio' => 2],
            12 => ['nombre' => 'Bases de Datos', 'anio' => 2],
            13 => ['nombre' => 'Sistemas Operativos', 'anio' => 2],
            14 => ['nombre' => 'Redes Informáticas', 'anio' => 2],
            15 => ['nombre' => 'Análisis y Diseño', 'anio' => 2],
            16 => ['nombre' => 'Estructura de Datos', 'anio' => 2],
            17 => ['nombre' => 'Seguridad Informática', 'anio' => 2],
            18 => ['nombre' => 'Práctica Profesionalizante I', 'anio' => 2],
            19 => ['nombre' => 'Estadística y Probabilidad', 'anio' => 2],

            // --- 3° AÑO ---
            20 => ['nombre' => 'EDI II', 'anio' => 3],
            21 => ['nombre' => 'Ética y Deontología Profesional', 'anio' => 3],
            22 => ['nombre' => 'Programación III', 'anio' => 3],
            23 => ['nombre' => 'Legislación', 'anio' => 3],
            24 => ['nombre' => 'Emprendedurismo Tecnológico', 'anio' => 3],
            25 => ['nombre' => 'Diseño de Interface', 'anio' => 3],
            26 => ['nombre' => 'Ingeniería de Software', 'anio' => 3],
            27 => ['nombre' => 'Práctica Profesionalizante II', 'anio' => 3],
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
            10 => ['regulares' => [2], 'aprobadas' => [2]],
            11 => ['regulares' => [6], 'aprobadas' => [6]],
            12 => ['regulares' => [6], 'aprobadas' => [6]],
            13 => ['regulares' => [6, 7], 'aprobadas' => [6, 7]],
            14 => ['regulares' => [5, 7], 'aprobadas' => [5, 7]],
            15 => ['regulares' => [4, 6, 8], 'aprobadas' => [4, 6, 8]],
            16 => ['regulares' => [6], 'aprobadas' => [6]],
            17 => ['regulares' => [5, 6, 7], 'aprobadas' => [5, 6, 7]],
            18 => ['regulares' => [6, 8], 'aprobadas' => [6, 8]],
            19 => ['regulares' => [9], 'aprobadas' => [9]],
            21 => ['regulares' => [15, 17, 18], 'aprobadas' => [15, 17, 18]],
            22 => ['regulares' => [11, 12, 18], 'aprobadas' => [11, 12, 18]],
            23 => ['regulares' => [17], 'aprobadas' => [17]],
            24 => ['regulares' => [15], 'aprobadas' => [15]],
            25 => ['regulares' => [11, 15], 'aprobadas' => [11, 15]],
            26 => ['regulares' => [11, 15], 'aprobadas' => [11, 15]],
            // 27 requiere 1° y 2° año (del 1 al 19)
            27 => [
                'regulares' => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
                'aprobadas' => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
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
