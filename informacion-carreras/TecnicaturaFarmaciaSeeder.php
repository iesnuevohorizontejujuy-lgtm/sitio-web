<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Carrera;
use App\Models\Materia;
use Database\Seeders\Concerns\EnsuresCareerModules;
use Illuminate\Support\Str;

class TecnicaturaFarmaciaSeeder extends Seeder
{
    use EnsuresCareerModules;

    public function run()
    {
        // 1. Crear o buscar la Carrera
        $carrera = Carrera::firstOrCreate(
            ['nombre' => 'Tecnicatura Superior en Farmacia'],
            [
                'slug' => Str::slug('Farmacia'),
                'resolucion' => 'Res. 740-E-S-22',
                'modalidad' => 'Presencial',
                'duracion' => '3 años',
                'activa' => true
            ]
        );

        $modulosPorAnio = $this->ensureCareerModules($carrera);

        // 2. Definir las Materias (N° de Orden => Datos)
        $materiasData = [
            // --- 1° AÑO ---
            1  => ['nombre' => 'Matemática y Física Aplicada', 'anio' => 1, 'codigo' => 'TSF-1-01'],
            2  => ['nombre' => 'Química General e Inorgánica', 'anio' => 1, 'codigo' => 'TSF-1-02'],
            3  => ['nombre' => 'Salud Pública', 'anio' => 1, 'codigo' => 'TSF-1-03'],
            4  => ['nombre' => 'Biología Humana', 'anio' => 1, 'codigo' => 'TSF-1-04'],
            5  => ['nombre' => 'Higiene y Bioseguridad', 'anio' => 1, 'codigo' => 'TSF-1-05'],
            6  => ['nombre' => 'Práctica Profesionalizante I', 'anio' => 1, 'codigo' => 'TSF-1-06'],

            // --- 2° AÑO ---
            7  => ['nombre' => 'Farmacología', 'anio' => 2, 'codigo' => 'TSF-2-07'],
            8  => ['nombre' => 'Farmacotécnia', 'anio' => 2, 'codigo' => 'TSF-2-08'],
            9  => ['nombre' => 'Microbiología General', 'anio' => 2, 'codigo' => 'TSF-2-09'],
            10 => ['nombre' => 'Atención Primaria de la Salud', 'anio' => 2, 'codigo' => 'TSF-2-10'],
            11 => ['nombre' => 'Informática y Procesos Técnicos', 'anio' => 2, 'codigo' => 'TSF-2-11'],
            12 => ['nombre' => 'Farmacognosia', 'anio' => 2, 'codigo' => 'TSF-2-12'],
            13 => ['nombre' => 'Práctica Profesionalizante II', 'anio' => 2, 'codigo' => 'TSF-2-13'],

            // --- 3° AÑO ---
            14 => ['nombre' => 'Patología', 'anio' => 3, 'codigo' => 'TSF-3-14'],
            15 => ['nombre' => 'Org. y Gestión Serv. Salud', 'anio' => 3, 'codigo' => 'TSF-3-15'],
            16 => ['nombre' => 'Prod. Biomédicos, Cosméticos...', 'anio' => 3, 'codigo' => 'TSF-3-16'],
            17 => ['nombre' => 'Ética y Legislación Farmacéutica', 'anio' => 3, 'codigo' => 'TSF-3-17'],
            18 => ['nombre' => 'Inglés Técnico', 'anio' => 3, 'codigo' => 'TSF-3-18'],
            19 => ['nombre' => 'Adm. y Gestión de Calidad', 'anio' => 3, 'codigo' => 'TSF-3-19'],
            20 => ['nombre' => 'Práctica Profesionalizante III', 'anio' => 3, 'codigo' => 'TSF-3-20'],
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
                    'codigo'  => $data['codigo'],
                    'regimen' => 'Anual'
                ]
            );
            $materiasInsertadas[$orden] = $materia->id;
        }

        // 4. Definir Correlatividades [Materia => ['regulares' => [Req], 'aprobadas' => [Req]]]
        $correlatividadesData = [
            7  => ['regulares' => [2, 4], 'aprobadas' => [2, 4]],
            8  => ['regulares' => [2], 'aprobadas' => [2]],
            9  => ['regulares' => [1, 5], 'aprobadas' => [1, 5]],
            10 => ['regulares' => [3], 'aprobadas' => [3]],
            11 => ['regulares' => [3], 'aprobadas' => [3]],
            12 => ['regulares' => [4], 'aprobadas' => [4]],
            // 13 requiere 1 al 5 Regulares y 1 al 6 Aprobadas
            13 => [
                'regulares' => [1, 2, 3, 4, 5], 
                'aprobadas' => [1, 2, 3, 4, 5, 6]
            ],
            14 => ['regulares' => [7, 8, 9], 'aprobadas' => [7, 8, 9]],
            15 => ['regulares' => [11], 'aprobadas' => [11]],
            16 => ['regulares' => [7, 8, 12], 'aprobadas' => [7, 8, 12]],
            19 => ['regulares' => [10, 11], 'aprobadas' => [10, 11]],
            // 20 requiere 7 al 12 Regulares y 7 al 13 Aprobadas
            20 => [
                'regulares' => [7, 8, 9, 10, 11, 12], 
                'aprobadas' => [7, 8, 9, 10, 11, 12, 13]
            ],
        ];

        // 5. Insertar Correlatividades
        DB::table('materia_materia')
            ->whereIn('materia_id', array_values($materiasInsertadas))
            ->delete();

        foreach ($correlatividadesData as $ordenMateria => $requisitos) {
            if (!isset($materiasInsertadas[$ordenMateria])) continue;
            
            $materiaId = $materiasInsertadas[$ordenMateria];

            // Regularizar
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

            // Aprobar
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
