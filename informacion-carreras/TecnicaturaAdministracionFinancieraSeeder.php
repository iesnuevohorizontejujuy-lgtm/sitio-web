<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Carrera;
use App\Models\Materia;
use Database\Seeders\Concerns\EnsuresCareerModules;
use Illuminate\Support\Str;

class TecnicaturaAdministracionFinancieraSeeder extends Seeder
{
    use EnsuresCareerModules;

    public function run()
    {
        // 1. Crear o buscar la Carrera
        $carrera = Carrera::firstOrCreate(
            ['nombre' => 'Tecnicatura Superior en Administración Financiera'],
            [
                'slug' => Str::slug('Administracion Financiera'),
                'resolucion' => 'Res. 840-E-23',
                'modalidad' => 'Presencial',
                'duracion' => '3 años',
                'activa' => true
            ]
        );

        $modulosPorAnio = $this->ensureCareerModules($carrera);

        // 2. Definir las Materias (N° de Orden => Datos)
        $materiasData = [
            // --- 1° AÑO ---
            1  => ['nombre' => 'Matemática', 'anio' => 1],
            2  => ['nombre' => 'Informática I', 'anio' => 1],
            3  => ['nombre' => 'Derecho Civil y Comercial', 'anio' => 1],
            4  => ['nombre' => 'Economía', 'anio' => 1],
            5  => ['nombre' => 'Contabilidad', 'anio' => 1],
            6  => ['nombre' => 'Inglés', 'anio' => 1],
            7  => ['nombre' => 'Principios de Administración', 'anio' => 1],
            8  => ['nombre' => 'Práctica Profesional I', 'anio' => 1],

            // --- 2° AÑO ---
            9  => ['nombre' => 'Matemática Financiera', 'anio' => 2],
            10 => ['nombre' => 'Estadística', 'anio' => 2],
            11 => ['nombre' => 'Inglés Técnico', 'anio' => 2],
            12 => ['nombre' => 'Administración Financiera I', 'anio' => 2],
            13 => ['nombre' => 'Comercio Internacional', 'anio' => 2],
            14 => ['nombre' => 'Impuestos', 'anio' => 2],
            15 => ['nombre' => 'Informática II', 'anio' => 2],
            16 => ['nombre' => 'Práctica Profesional II', 'anio' => 2],

            // --- 3° AÑO ---
            17 => ['nombre' => 'Análisis Proyectos de Inversión', 'anio' => 3],
            18 => ['nombre' => 'Elementos Mercado Financiero', 'anio' => 3],
            19 => ['nombre' => 'Técnica y Contabilidad Bancaria', 'anio' => 3],
            20 => ['nombre' => 'Análisis Interp. Est. Contables', 'anio' => 3],
            21 => ['nombre' => 'Administración Financiera II', 'anio' => 3],
            22 => ['nombre' => 'Ética y Deontología Profesional', 'anio' => 3],
            23 => ['nombre' => 'Práctica Profesional III', 'anio' => 3],
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
            9  => ['regulares' => [1], 'aprobadas' => [1]],
            10 => ['regulares' => [1], 'aprobadas' => [1]],
            11 => ['regulares' => [6], 'aprobadas' => [6]],
            12 => ['regulares' => [7], 'aprobadas' => [7]],
            13 => ['regulares' => [4], 'aprobadas' => [4]],
            14 => ['regulares' => [3], 'aprobadas' => [3]],
            15 => ['regulares' => [2], 'aprobadas' => [2]],
            16 => ['regulares' => [2, 7, 8], 'aprobadas' => [8]],
            17 => [
                'regulares' => [3, 4, 9, 10, 12], 
                'aprobadas' => [9, 12, 14]
            ],
            18 => ['regulares' => [12, 13], 'aprobadas' => [12, 13]],
            19 => ['regulares' => [5, 9, 14], 'aprobadas' => [5]],
            20 => ['regulares' => [5, 14], 'aprobadas' => [5, 14]],
            21 => ['regulares' => [7, 12], 'aprobadas' => [7, 12]],
            // 23 requiere 1° año completo (1 al 8) y 16
            23 => [
                'regulares' => [1, 2, 3, 4, 5, 6, 7, 8, 16], 
                'aprobadas' => [1, 2, 3, 4, 5, 6, 7, 8, 16]
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
