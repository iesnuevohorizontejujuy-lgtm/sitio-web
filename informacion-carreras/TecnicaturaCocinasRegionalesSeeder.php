<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Carrera;
use App\Models\Materia;
use Database\Seeders\Concerns\EnsuresCareerModules;
use Illuminate\Support\Str;

class TecnicaturaCocinasRegionalesSeeder extends Seeder
{
    use EnsuresCareerModules;

    public function run()
    {
        // 1. Crear o buscar la Carrera
        $carrera = Carrera::firstOrCreate(
            ['nombre' => 'Tecnicatura Superior en Cocinas Regionales y Cultura Alimentaria'],
            [
                'slug' => Str::slug('Cocinas Regionales y Cultura Alimentaria'),
                'resolucion' => 'Res. 3004-E-22',
                'modalidad' => 'Presencial',
                'duracion' => '3 años',
                'activa' => true
            ]
        );

        $modulosPorAnio = $this->ensureCareerModules($carrera);

        // 2. Definir las Materias (N° de Orden => Datos)
        $materiasData = [
            // --- 1° AÑO ---
            1  => ['nombre' => 'Historia de la Alimentación', 'anio' => 1],
            2  => ['nombre' => 'Introducción a la Gastronomía', 'anio' => 1],
            3  => ['nombre' => 'Productos y Tecnologías Regionales', 'anio' => 1],
            4  => ['nombre' => 'Bromatología, Higiene y Seguridad', 'anio' => 1],
            5  => ['nombre' => 'Nutrición', 'anio' => 1],
            6  => ['nombre' => 'Enología', 'anio' => 1],
            7  => ['nombre' => 'Francés Gastronómico', 'anio' => 1],
            8  => ['nombre' => 'Química Culinaria', 'anio' => 1],
            9  => ['nombre' => 'Sistemas Alimentarios', 'anio' => 1],

            // --- 2° AÑO ---
            10 => ['nombre' => 'Gastronomía', 'anio' => 2],
            11 => ['nombre' => 'Panadería', 'anio' => 2],
            12 => ['nombre' => 'Práctica Profesionalizante I', 'anio' => 2],
            13 => ['nombre' => 'Gastronomía Regional I', 'anio' => 2],
            14 => ['nombre' => 'Análisis y Costos de Procesos', 'anio' => 2],
            15 => ['nombre' => 'Ceremonial y Protocolo', 'anio' => 2],
            16 => ['nombre' => 'Antropología Sociocultural', 'anio' => 2],
            17 => ['nombre' => 'EDI I', 'anio' => 2],

            // --- 3° AÑO ---
            18 => ['nombre' => 'Gastronomía Regional II', 'anio' => 3],
            19 => ['nombre' => 'Pastelería', 'anio' => 3],
            20 => ['nombre' => 'Práctica Profesionalizante II', 'anio' => 3],
            21 => ['nombre' => 'Administración y Marketing', 'anio' => 3],
            22 => ['nombre' => 'Gastronomía Internacional', 'anio' => 3],
            23 => ['nombre' => 'Agroindustria Rural', 'anio' => 3],
            24 => ['nombre' => 'Metodología de la Inv. Gastro.', 'anio' => 3],
            25 => ['nombre' => 'EDI II', 'anio' => 3],
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
            10 => ['regulares' => [2, 4, 7, 8], 'aprobadas' => [2, 4, 8]],
            11 => ['regulares' => [2, 4, 5, 7, 8], 'aprobadas' => [2, 4, 8]],
            12 => ['regulares' => [2, 4, 5, 6, 7, 8], 'aprobadas' => [2, 4, 6, 8]],
            13 => ['regulares' => [1, 2, 3, 5, 9], 'aprobadas' => [1, 2, 3, 9]],
            14 => ['regulares' => [2, 6], 'aprobadas' => [2, 6]],
            15 => ['regulares' => [1, 6], 'aprobadas' => [1, 6]],
            16 => ['regulares' => [1, 3, 9], 'aprobadas' => [1, 3, 9]],
            18 => ['regulares' => [13, 14, 16], 'aprobadas' => [13, 16]],
            19 => ['regulares' => [10, 11, 14], 'aprobadas' => [10, 11]],
            20 => [
                'regulares' => [10, 11, 12, 13, 14, 15], 
                'aprobadas' => [10, 11, 12, 13, 14, 15]
            ],
            21 => ['regulares' => [14, 17], 'aprobadas' => [14, 17]],
            22 => ['regulares' => [10, 11, 13], 'aprobadas' => [10, 11, 13]],
            23 => ['regulares' => [13, 14, 17], 'aprobadas' => [13, 14, 17]],
            24 => ['regulares' => [12, 13, 16, 17], 'aprobadas' => [12, 13, 16, 17]],
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
