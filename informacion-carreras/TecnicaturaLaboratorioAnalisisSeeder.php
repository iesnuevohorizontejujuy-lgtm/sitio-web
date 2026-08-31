<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Carrera;
use App\Models\Materia;
use Database\Seeders\Concerns\EnsuresCareerModules;
use Illuminate\Support\Str;

class TecnicaturaLaboratorioAnalisisSeeder extends Seeder
{
    use EnsuresCareerModules;

    public function run()
    {
        // 1. Crear o buscar la Carrera
        $carrera = Carrera::firstOrCreate(
            ['nombre' => 'Tecnicatura Superior en Laboratorio de Análisis Clínicos'],
            [
                'slug' => Str::slug('Laboratorio de Analisis Clinicos'),
                'resolucion' => 'Res. 3523-E/S-23',
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
            2  => ['nombre' => 'Matemática', 'anio' => 1],
            3  => ['nombre' => 'Química General e Inorgánica', 'anio' => 1],
            4  => ['nombre' => 'Higiene y Bioseguridad', 'anio' => 1],
            5  => ['nombre' => 'Biología', 'anio' => 1],
            6  => ['nombre' => 'Estado y Sociedad', 'anio' => 1],
            7  => ['nombre' => 'Comunicación Oral y Escrita', 'anio' => 1],
            8  => ['nombre' => 'Práctica Profesionalizante I', 'anio' => 1],

            // --- 2° AÑO ---
            9  => ['nombre' => 'Salud Pública', 'anio' => 2],
            10 => ['nombre' => 'Química Orgánica', 'anio' => 2],
            11 => ['nombre' => 'Microbiología General', 'anio' => 2],
            12 => ['nombre' => 'Anatomía, Histología y Fisiología', 'anio' => 2],
            13 => ['nombre' => 'Inmunología General', 'anio' => 2],
            14 => ['nombre' => 'Inglés Técnico', 'anio' => 2],
            15 => ['nombre' => 'Organización y Gestión de Inst. Salud', 'anio' => 2],
            16 => ['nombre' => 'Práctica Profesionalizante II', 'anio' => 2],

            // --- 3° AÑO ---
            17 => ['nombre' => 'Primeros Auxilios', 'anio' => 3],
            18 => ['nombre' => 'Inmunohematología', 'anio' => 3],
            19 => ['nombre' => 'Bioquímica Clínica', 'anio' => 3],
            20 => ['nombre' => 'Ética y Deontología Profesional', 'anio' => 3],
            21 => ['nombre' => 'Proc. Tecnológicos Específicos', 'anio' => 3],
            22 => ['nombre' => 'Tecnología de la Información y Com.', 'anio' => 3],
            23 => ['nombre' => 'Práctica Profesionalizante III', 'anio' => 3],
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
            9  => ['regulares' => [6], 'aprobadas' => [6]],
            10 => ['regulares' => [3, 5], 'aprobadas' => [3, 5]],
            11 => ['regulares' => [4, 5], 'aprobadas' => [4, 5]],
            12 => ['regulares' => [5], 'aprobadas' => [5]],
            13 => ['regulares' => [3, 4, 5], 'aprobadas' => [3, 4, 5]],
            15 => ['regulares' => [6], 'aprobadas' => [6]],
            // 16 requiere 3,4,5 regulares y 1er año aprobado (1 al 8)
            16 => [
                'regulares' => [3, 4, 5], 
                'aprobadas' => [1, 2, 3, 4, 5, 6, 7, 8]
            ],
            17 => ['regulares' => [9], 'aprobadas' => [9]],
            18 => ['regulares' => [10, 11, 12, 13], 'aprobadas' => [10, 11, 12, 13]],
            19 => ['regulares' => [10, 11, 12, 13], 'aprobadas' => [10, 11, 12, 13]],
            21 => ['regulares' => [11, 12, 13], 'aprobadas' => [11, 12, 13]],
            // 23 requiere 10,12,13 regulares y 2do año aprobado (9 al 16)
            23 => [
                'regulares' => [10, 12, 13], 
                'aprobadas' => [9, 10, 11, 12, 13, 14, 15, 16]
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
