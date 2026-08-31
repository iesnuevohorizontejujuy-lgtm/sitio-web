<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Carrera;
use App\Models\Materia;
use Database\Seeders\Concerns\EnsuresCareerModules;
use Illuminate\Support\Str;

class TecnicaturaHemoterapiaSeeder extends Seeder
{
    use EnsuresCareerModules;

    public function run()
    {
        // 1. Crear o buscar la Carrera
        $carrera = Carrera::firstOrCreate(
            ['nombre' => 'Tecnicatura Superior en Hemoterapia'],
            [
                'slug' => Str::slug('Hemoterapia'),
                'resolucion' => 'Res. 749-E/S-23',
                'modalidad' => 'Presencial',
                'duracion' => '3 años',
                'activa' => true
            ]
        );

        $modulosPorAnio = $this->ensureCareerModules($carrera);

        // 2. Definir las Materias (N° de Orden => Datos)
        $materiasData = [
            // --- 1° AÑO ---
            1  => ['nombre' => 'Educación y Salud', 'anio' => 1],
            2  => ['nombre' => 'Biología, Genética e Inmunología', 'anio' => 1],
            3  => ['nombre' => 'Anatomía y Fisiología Humana', 'anio' => 1],
            4  => ['nombre' => 'Hemoterapia y Hemodonación', 'anio' => 1],
            5  => ['nombre' => 'Psicología Evolutiva', 'anio' => 1],
            6  => ['nombre' => 'Metodología de la Investigación', 'anio' => 1],
            7  => ['nombre' => 'Primeros Auxilios', 'anio' => 1],
            8  => ['nombre' => 'Higiene y Seguridad Laboral', 'anio' => 1],
            9  => ['nombre' => 'Práctica I', 'anio' => 1],

            // --- 2° AÑO ---
            10 => ['nombre' => 'Microbiología y Epidemiología', 'anio' => 2],
            11 => ['nombre' => 'Calificación Biológica', 'anio' => 2],
            12 => ['nombre' => 'Taller de Calificación Biológica', 'anio' => 2],
            13 => ['nombre' => 'Ética y Aspectos Legales', 'anio' => 2],
            14 => ['nombre' => 'Preparación Productos Sanguíneos', 'anio' => 2],
            15 => ['nombre' => 'Inglés Técnico', 'anio' => 2],
            16 => ['nombre' => 'Informática', 'anio' => 2],
            17 => ['nombre' => 'Práctica II', 'anio' => 2],
            18 => ['nombre' => 'EDI I', 'anio' => 2],

            // --- 3° AÑO ---
            19 => ['nombre' => 'Fisiopatología Feto-neonatal', 'anio' => 3],
            20 => ['nombre' => 'Gestión y Calidad en Bancos', 'anio' => 3],
            21 => ['nombre' => 'Bioética', 'anio' => 3],
            22 => ['nombre' => 'Fisiopatología Aplicada', 'anio' => 3],
            23 => ['nombre' => 'Transfusión', 'anio' => 3],
            24 => ['nombre' => 'Psicología de Org. de Salud', 'anio' => 3],
            25 => ['nombre' => 'Inmunohematología', 'anio' => 3],
            26 => ['nombre' => 'Práctica III', 'anio' => 3],
            27 => ['nombre' => 'EDI II', 'anio' => 3],
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
            10 => ['regulares' => [2, 3], 'aprobadas' => [2, 3]],
            11 => ['regulares' => [2, 8], 'aprobadas' => [2, 8]],
            12 => ['regulares' => [2, 8, 9], 'aprobadas' => [2, 8, 9]],
            13 => ['regulares' => [1], 'aprobadas' => [1]],
            14 => ['regulares' => [3, 4, 8], 'aprobadas' => [3, 4, 8]],
            17 => ['regulares' => [3, 4, 9], 'aprobadas' => [3, 4, 9]],
            19 => ['regulares' => [3, 5, 10], 'aprobadas' => [3, 5, 10]],
            20 => ['regulares' => [1, 14, 16], 'aprobadas' => [1, 14, 16]],
            21 => ['regulares' => [1, 13], 'aprobadas' => [1, 13]],
            22 => ['regulares' => [1, 3], 'aprobadas' => [1, 3]],
            23 => ['regulares' => [11, 14, 17], 'aprobadas' => [11, 14, 17]],
            24 => ['regulares' => [5, 13], 'aprobadas' => [5, 13]],
            25 => ['regulares' => [2, 11], 'aprobadas' => [2, 11]],
            26 => [
                'regulares' => [11, 14], 
                'aprobadas' => [11, 12, 14, 17]
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
