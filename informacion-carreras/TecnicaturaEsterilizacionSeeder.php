<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Carrera;
use App\Models\Materia;
use Database\Seeders\Concerns\EnsuresCareerModules;
use Illuminate\Support\Str;

class TecnicaturaEsterilizacionSeeder extends Seeder
{
    use EnsuresCareerModules;

    public function run()
    {
        // 1. Crear o buscar la Carrera
        $carrera = Carrera::firstOrCreate(
            ['nombre' => 'Tecnicatura Superior en Esterilización'],
            [
                'slug' => Str::slug('Esterilizacion'),
                'resolucion' => 'Res. 3720-E/S-23',
                'modalidad' => 'Presencial',
                'duracion' => '3 años',
                'activa' => true
            ]
        );

        $modulosPorAnio = $this->ensureCareerModules($carrera);

        // 2. Definir las Materias (N° de Orden => Datos)
        $materiasData = [
            // --- 1° AÑO ---
            1  => ['nombre' => 'Biología', 'anio' => 1],
            2  => ['nombre' => 'Física', 'anio' => 1],
            3  => ['nombre' => 'Química', 'anio' => 1],
            4  => ['nombre' => 'Higiene y Bioseguridad', 'anio' => 1],
            5  => ['nombre' => 'Microbiología', 'anio' => 1],
            6  => ['nombre' => 'Esterilización', 'anio' => 1],
            7  => ['nombre' => 'Práctica Profesional I', 'anio' => 1],

            // --- 2° AÑO ---
            8  => ['nombre' => 'Salud Pública', 'anio' => 2],
            9  => ['nombre' => 'Organización y Gestión de Inst.', 'anio' => 2],
            10 => ['nombre' => 'Ética, Deontología y Ejercicio Prof.', 'anio' => 2],
            11 => ['nombre' => 'Primeros Auxilios', 'anio' => 2],
            12 => ['nombre' => 'Estadística', 'anio' => 2],
            13 => ['nombre' => 'Cond. y Medio Amb. de Trabajo', 'anio' => 2],
            14 => ['nombre' => 'Práctica Profesional II', 'anio' => 2],

            // --- 3° AÑO ---
            15 => ['nombre' => 'Biomateriales y Prod. Médicos', 'anio' => 3],
            16 => ['nombre' => 'Comunicación y Equipos de Salud', 'anio' => 3],
            17 => ['nombre' => 'Sistema de Calidad en Procesos', 'anio' => 3],
            18 => ['nombre' => 'Actitudes Rel. Ejercicio Prof.', 'anio' => 3],
            19 => ['nombre' => 'Inglés', 'anio' => 3],
            20 => ['nombre' => 'Procesos Tecnológicos Espec.', 'anio' => 3],
            21 => ['nombre' => 'Práctica Profesional III', 'anio' => 3],
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
            8  => ['regulares' => [2], 'aprobadas' => [2]],
            11 => ['regulares' => [4], 'aprobadas' => [4]],
            12 => ['regulares' => [2], 'aprobadas' => [2]],
            13 => ['regulares' => [4], 'aprobadas' => [4]],
            14 => ['regulares' => [6], 'aprobadas' => [6, 7]],
            16 => ['regulares' => [8], 'aprobadas' => [8]],
            17 => ['regulares' => [9], 'aprobadas' => [9]],
            18 => ['regulares' => [10], 'aprobadas' => [10]],
            20 => ['regulares' => [13], 'aprobadas' => [13, 14]],
            21 => ['regulares' => [13], 'aprobadas' => [13, 14]],
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
