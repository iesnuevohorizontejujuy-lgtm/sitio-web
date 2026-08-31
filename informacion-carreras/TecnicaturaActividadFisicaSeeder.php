<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Carrera;
use App\Models\Materia;
use Database\Seeders\Concerns\EnsuresCareerModules;

class TecnicaturaActividadFisicaSeeder extends Seeder
{
    use EnsuresCareerModules;

    public function run()
    {
        // 1. Crear o buscar la Carrera
        $carrera = Carrera::firstOrCreate(
            ['nombre' => 'Tecnicatura Superior en Actividad Física y Fitness'],
            [
                'slug' => \Illuminate\Support\Str::slug('Actividad Fisica y Fitness'),
                'resolucion' => 'Res. 6304-E-22',
                'modalidad' => 'Presencial',
                'duracion' => '3 años',
                'activa' => true
            ]
        );

        $modulosPorAnio = $this->ensureCareerModules($carrera);

        // 2. Definir las Materias (N° de Orden => Datos)
        $materiasData = [
            // --- 1° AÑO ---
            1  => ['nombre' => 'Inglés', 'anio' => 1],
            2  => ['nombre' => 'Anatomía y Fisiología', 'anio' => 1],
            3  => ['nombre' => 'Entrenam. Funcional y Musculación', 'anio' => 1],
            4  => ['nombre' => 'Personal Trainer', 'anio' => 1],
            5  => ['nombre' => 'Prácticas de Integración', 'anio' => 1],
            6  => ['nombre' => 'Evaluación de la Condición Física', 'anio' => 1],

            // --- 2° AÑO ---
            7  => ['nombre' => 'Fisiología de la Actividad Física', 'anio' => 2],
            8  => ['nombre' => 'Nuevas Tendencias en Entrenamiento', 'anio' => 2],
            9  => ['nombre' => 'Planificación de la Actividad Física', 'anio' => 2],
            10 => ['nombre' => 'Prácticas de Especialización', 'anio' => 2],
            11 => ['nombre' => 'Elaboración de Proyectos Deportivos', 'anio' => 2],

            // --- 3° AÑO ---
            12 => ['nombre' => 'Nutrición', 'anio' => 3],
            13 => ['nombre' => 'Infraestructura y Equipamientos', 'anio' => 3],
            14 => ['nombre' => 'Actividad Física para la Diversidad', 'anio' => 3],
            15 => ['nombre' => 'Práctica Profesional', 'anio' => 3],
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
            7  => ['regulares' => [2], 'aprobadas' => [2]],
            8  => ['regulares' => [2, 4], 'aprobadas' => [2, 4]],
            9  => ['regulares' => [2, 3], 'aprobadas' => [2, 3]],
            10 => ['regulares' => [2, 3, 5], 'aprobadas' => [2, 3, 5]],
            11 => ['regulares' => [6], 'aprobadas' => [6]],
            12 => ['regulares' => [7], 'aprobadas' => [7]],
            13 => ['regulares' => [10], 'aprobadas' => [10]],
            14 => ['regulares' => [2, 3, 7, 9], 'aprobadas' => [2, 3, 7, 9]],
            // 15 Requiere 1° y 2° año completo (Materias del 1 al 11)
            15 => [
                'regulares' => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 
                'aprobadas' => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
            ],
        ];

        // 5. Insertar Correlatividades (Limpiamos primero las de esta carrera para evitar duplicados)
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
