<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Carrera;
use App\Models\Materia;
use Database\Seeders\Concerns\EnsuresCareerModules;
use Illuminate\Support\Str;

class TecnicaturaHigieneSeguridadSeeder extends Seeder
{
    use EnsuresCareerModules;

    public function run()
    {
        // 1. Crear o buscar la Carrera
        $carrera = Carrera::firstOrCreate(
            ['nombre' => 'Tecnicatura Superior en Higiene y Seguridad en el Trabajo'],
            [
                'slug' => Str::slug('Higiene y Seguridad en el Trabajo'),
                'resolucion' => 'Res. 6055-E-23',
                'modalidad' => 'Presencial',
                'duracion' => '3 años',
                'activa' => true
            ]
        );

        $modulosPorAnio = $this->ensureCareerModules($carrera);

        // 2. Definir las Materias (N° de Orden => Datos)
        $materiasData = [
            // --- 1° AÑO ---
            1  => ['nombre' => 'Física', 'anio' => 1],
            2  => ['nombre' => 'Química Aplicada', 'anio' => 1],
            3  => ['nombre' => 'Matemática', 'anio' => 1],
            4  => ['nombre' => 'Informática', 'anio' => 1],
            5  => ['nombre' => 'Organización en el Trabajo', 'anio' => 1],
            6  => ['nombre' => 'Legislación en el Trabajo', 'anio' => 1],
            7  => ['nombre' => 'Higiene en el Trabajo I', 'anio' => 1],
            8  => ['nombre' => 'Seguridad en el Trabajo I', 'anio' => 1],
            9  => ['nombre' => 'Práctica Profesionalizante I', 'anio' => 1],
            10 => ['nombre' => 'Psicología Laboral y Rel. Humanas', 'anio' => 1],
            11 => ['nombre' => 'Inglés Técnico', 'anio' => 1],

            // --- 2° AÑO ---
            12 => ['nombre' => 'Seguridad en el Trabajo II', 'anio' => 2],
            13 => ['nombre' => 'Higiene en el Trabajo II', 'anio' => 2],
            14 => ['nombre' => 'Hig. y Seg. en Cont. Particulares', 'anio' => 2],
            15 => ['nombre' => 'Estudio del Trabajo y Ergonomía', 'anio' => 2],
            16 => ['nombre' => 'Probabilidad y Estadística', 'anio' => 2],
            17 => ['nombre' => 'Práctica Profesionalizante II', 'anio' => 2],
            18 => ['nombre' => 'EDI I', 'anio' => 2],

            // --- 3° AÑO ---
            19 => ['nombre' => 'Capacitación Laboral', 'anio' => 3],
            20 => ['nombre' => 'Gestión Integrada', 'anio' => 3],
            21 => ['nombre' => 'Medicina del Trabajo', 'anio' => 3],
            22 => ['nombre' => 'Sistemas de Representación', 'anio' => 3],
            23 => ['nombre' => 'Ética y Deontología Profesional', 'anio' => 3],
            24 => ['nombre' => 'EDI II', 'anio' => 3],
            25 => ['nombre' => 'Formulación y Eval. de Proyectos', 'anio' => 3],
            26 => ['nombre' => 'Práctica Profesionalizante III', 'anio' => 3],
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
            12 => ['regulares' => [1, 2, 8], 'aprobadas' => [1, 2, 8, 9]],
            13 => ['regulares' => [1, 2, 7], 'aprobadas' => [1, 2, 7, 9]],
            14 => ['regulares' => [7, 8, 9], 'aprobadas' => [7, 8, 9]],
            15 => ['regulares' => [1, 2, 5, 7, 8], 'aprobadas' => [1, 2, 5, 7, 8, 9]],
            16 => ['regulares' => [1, 2, 3], 'aprobadas' => [1, 2, 3]],
            17 => ['regulares' => [7, 8], 'aprobadas' => [7, 8, 9]],
            19 => ['regulares' => [10], 'aprobadas' => [10]],
            20 => [
                'regulares' => [12, 13, 14, 15, 17], 
                'aprobadas' => [12, 13, 14, 15, 17]
            ],
            21 => [
                'regulares' => [6, 10, 12, 13, 15], 
                'aprobadas' => [6, 10, 12, 13, 15]
            ],
            22 => ['regulares' => [4], 'aprobadas' => [4]],
            23 => ['regulares' => [10], 'aprobadas' => [10]],
            24 => ['regulares' => [], 'aprobadas' => [18]],
            25 => ['regulares' => [5, 10, 18], 'aprobadas' => [5, 10, 18]],
            26 => [
                'regulares' => [12, 13, 14, 15, 17], 
                'aprobadas' => [12, 13, 14, 15, 17]
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
