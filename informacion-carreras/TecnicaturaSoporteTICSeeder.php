<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Carrera;
use App\Models\Materia;
use Database\Seeders\Concerns\EnsuresCareerModules;
use Illuminate\Support\Str;

class TecnicaturaSoporteTICSeeder extends Seeder
{
    use EnsuresCareerModules;

    public function run()
    {
        // 1. Crear o buscar la Carrera
        $carrera = Carrera::firstOrCreate(
            ['nombre' => 'Tecnicatura Superior en Soporte TIC'],
            [
                'slug' => Str::slug('Soporte TIC'),
                'resolucion' => 'Res. 2772-E-22',
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
            2  => ['nombre' => 'Álgebra', 'anio' => 1],
            3  => ['nombre' => 'Análisis Matemático', 'anio' => 1],
            4  => ['nombre' => 'Tecnologías de la Información', 'anio' => 1],
            5  => ['nombre' => 'Arquitectura de Computadoras', 'anio' => 1],
            6  => ['nombre' => 'Bases de Datos I', 'anio' => 1],
            7  => ['nombre' => 'Sistemas Operativos I', 'anio' => 1],
            8  => ['nombre' => 'Organización y Adm. Empresas', 'anio' => 1],
            9  => ['nombre' => 'Prácticas Profesionalizantes I', 'anio' => 1],
            10 => ['nombre' => 'Expresión Oral y Escrita', 'anio' => 1],

            // --- 2° AÑO ---
            11 => ['nombre' => 'Inglés Técnico', 'anio' => 2],
            12 => ['nombre' => 'Probabilidades y Estadísticas', 'anio' => 2],
            13 => ['nombre' => 'Programación', 'anio' => 2],
            14 => ['nombre' => 'Bases de Datos II', 'anio' => 2],
            15 => ['nombre' => 'Redes', 'anio' => 2],
            16 => ['nombre' => 'Sistemas Operativos II', 'anio' => 2],
            17 => ['nombre' => 'Prácticas Profesionalizantes II', 'anio' => 2],
            18 => ['nombre' => 'EDI I', 'anio' => 2],

            // --- 3° AÑO ---
            19 => ['nombre' => 'Ética Profesional', 'anio' => 3],
            20 => ['nombre' => 'Legislación Informática', 'anio' => 3],
            21 => ['nombre' => 'Seguridad Informática', 'anio' => 3],
            22 => ['nombre' => 'Adm. y Mantenimiento Redes', 'anio' => 3],
            23 => ['nombre' => 'Administración de Servidores', 'anio' => 3],
            24 => ['nombre' => 'Ajuste y Opt. Bases de Datos', 'anio' => 3],
            25 => ['nombre' => 'Prácticas Profesionalizantes III', 'anio' => 3],
            26 => ['nombre' => 'EDI II', 'anio' => 3],
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
            11 => ['regulares' => [1], 'aprobadas' => [1]],
            12 => ['regulares' => [2], 'aprobadas' => [2, 3]],
            13 => ['regulares' => [4, 6], 'aprobadas' => [4, 6]],
            14 => ['regulares' => [6], 'aprobadas' => [6]],
            15 => ['regulares' => [4, 5], 'aprobadas' => [4, 5]],
            16 => ['regulares' => [5, 7], 'aprobadas' => [5, 7]],
            // 17 requiere 4 al 9 regulares y 1er año aprobado (1 al 10)
            17 => [
                'regulares' => [4, 5, 6, 7, 8, 9], 
                'aprobadas' => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            ],
            20 => ['regulares' => [10], 'aprobadas' => [10]],
            21 => ['regulares' => [14, 15, 16], 'aprobadas' => [14, 15, 16]],
            22 => ['regulares' => [15, 16], 'aprobadas' => [15, 16]],
            23 => ['regulares' => [14, 15, 16], 'aprobadas' => [14, 15, 16]],
            24 => ['regulares' => [14, 15, 16], 'aprobadas' => [14, 15, 16]],
            25 => ['regulares' => [14, 15, 16, 17], 'aprobadas' => [14, 15, 16, 17]],
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
