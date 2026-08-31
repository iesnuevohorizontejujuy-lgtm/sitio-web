<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Carrera;
use App\Models\Materia;
use Database\Seeders\Concerns\EnsuresCareerModules;
use Illuminate\Support\Str;

class TecnicaturaPreparacionFisicaSeeder extends Seeder
{
    use EnsuresCareerModules;

    public function run()
    {
        // 1. Crear o buscar la Carrera
        $carrera = Carrera::firstOrCreate(
            ['nombre' => 'Tecnicatura Superior en Preparación Física'],
            [
                'slug' => Str::slug('Preparacion Fisica'),
                'resolucion' => 'Res. 1302-E-23',
                'modalidad' => 'Presencial',
                'duracion' => '3 años',
                'activa' => true
            ]
        );

        $modulosPorAnio = $this->ensureCareerModules($carrera);

        // 2. Definir las Materias (N° de Orden => Datos)
        $materiasData = [
            // --- 1° AÑO ---
            1  => ['nombre' => 'Inglés Técnico', 'anio' => 1],
            2  => ['nombre' => 'Anatomía y Fisiología', 'anio' => 1],
            3  => ['nombre' => 'Entrenamiento I', 'anio' => 1],
            4  => ['nombre' => 'Actividad Física y Salud', 'anio' => 1],
            5  => ['nombre' => 'Práctica Profesionalizante I', 'anio' => 1],

            // --- 2° AÑO ---
            6  => ['nombre' => 'Evaluación de la Condición Física', 'anio' => 2],
            7  => ['nombre' => 'Fisiología del Ejercicio', 'anio' => 2],
            8  => ['nombre' => 'Entrenamiento II', 'anio' => 2],
            9  => ['nombre' => 'EDI I', 'anio' => 2],
            10 => ['nombre' => 'Práctica Profesionalizante II', 'anio' => 2],

            // --- 3° AÑO ---
            11 => ['nombre' => 'Elaboración de Proyectos Deportivos', 'anio' => 3],
            12 => ['nombre' => 'Nutrición Deportiva', 'anio' => 3],
            13 => ['nombre' => 'EDI II', 'anio' => 3],
            14 => ['nombre' => 'Biomecánica del Ap. Locomotor', 'anio' => 3],
            15 => ['nombre' => 'Práctica Profesionalizante III', 'anio' => 3],
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
            6  => ['regulares' => [2, 3], 'aprobadas' => [2, 3]],
            7  => ['regulares' => [2], 'aprobadas' => [2]],
            8  => ['regulares' => [2, 3], 'aprobadas' => [2, 3]],
            10 => ['regulares' => [2, 3, 4], 'aprobadas' => [2, 3, 4, 5]],
            12 => ['regulares' => [7], 'aprobadas' => [7]],
            13 => ['regulares' => [9], 'aprobadas' => [9]],
            14 => ['regulares' => [7], 'aprobadas' => [7]],
            // 15 requiere 1° y 2° año completo (materias del 1 al 10)
            15 => [
                'regulares' => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 
                'aprobadas' => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
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
