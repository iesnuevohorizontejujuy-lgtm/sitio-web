<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Carrera;
use App\Models\Materia;
use Database\Seeders\Concerns\EnsuresCareerModules;
use Illuminate\Support\Str;

class TecnicaturaGestionTributariaSeeder extends Seeder
{
    use EnsuresCareerModules;

    public function run()
    {
        // 1. Crear o buscar la Carrera
        $carrera = Carrera::firstOrCreate(
            ['nombre' => 'Tecnicatura Superior en Administración y Gestión Tributaria'],
            [
                'slug' => Str::slug('Administracion y Gestion Tributaria'),
                'resolucion' => 'Res. 2768-E-16',
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
            2  => ['nombre' => 'Informática', 'anio' => 1],
            3  => ['nombre' => 'Contabilidad General', 'anio' => 1],
            4  => ['nombre' => 'Derecho Público y Privado', 'anio' => 1],
            5  => ['nombre' => 'Introducción a la Administración', 'anio' => 1],
            6  => ['nombre' => 'Administración General', 'anio' => 1],
            7  => ['nombre' => 'Introducción a la Economía', 'anio' => 1],
            8  => ['nombre' => 'Microeconomía', 'anio' => 1],
            9  => ['nombre' => 'Formulación y Eval. de Proyectos', 'anio' => 1],
            10 => ['nombre' => 'Inglés', 'anio' => 1],

            // --- 2° AÑO ---
            11 => ['nombre' => 'Estadística', 'anio' => 2],
            12 => ['nombre' => 'Matemática Financiera', 'anio' => 2],
            13 => ['nombre' => 'Contabilidad Superior', 'anio' => 2],
            14 => ['nombre' => 'Estructuras y Procesos', 'anio' => 2],
            15 => ['nombre' => 'Administración Aplicada', 'anio' => 2],
            16 => ['nombre' => 'Inglés Técnico', 'anio' => 2],
            17 => ['nombre' => 'Impuestos I', 'anio' => 2],
            18 => ['nombre' => 'Impuestos II', 'anio' => 2],
            19 => ['nombre' => 'Informática Aplicada a la Trib.', 'anio' => 2],
            20 => ['nombre' => 'Práctica Prof. I: Técnicas Impositivas', 'anio' => 2],

            // --- 3° AÑO ---
            21 => ['nombre' => 'Análisis e Interp. Estados Contables', 'anio' => 3],
            22 => ['nombre' => 'Costos y Presupuestos', 'anio' => 3],
            23 => ['nombre' => 'Administración Financiera', 'anio' => 3],
            24 => ['nombre' => 'Macroeconomía', 'anio' => 3],
            25 => ['nombre' => 'Finanzas Públicas', 'anio' => 3],
            26 => ['nombre' => 'Ética y Deontología Profesional', 'anio' => 3],
            27 => ['nombre' => 'Comercialización y Estudios de Mercados', 'anio' => 3],
            28 => ['nombre' => 'Práctica Profesionalizante II', 'anio' => 3],
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

        // 4. Definir Correlatividades
        $correlatividadesData = [
            6  => ['regulares' => [5], 'aprobadas' => [5]],
            8  => ['regulares' => [7], 'aprobadas' => [7]],
            11 => ['regulares' => [1], 'aprobadas' => [1]],
            12 => ['regulares' => [1, 10], 'aprobadas' => [1, 10]],
            13 => ['regulares' => [3], 'aprobadas' => [3]],
            14 => ['regulares' => [5, 6], 'aprobadas' => [5, 6]],
            15 => ['regulares' => [5, 6, 14], 'aprobadas' => [5, 6, 14]],
            16 => ['regulares' => [9], 'aprobadas' => [9]],
            17 => ['regulares' => [4], 'aprobadas' => [4]],
            18 => ['regulares' => [4], 'aprobadas' => [4]],
            19 => ['regulares' => [2], 'aprobadas' => [2]],
            20 => ['regulares' => [3, 4, 5, 6, 7, 8], 'aprobadas' => [3, 4, 5, 6, 7, 8]],
            21 => ['regulares' => [3, 12], 'aprobadas' => [3, 12]],
            22 => ['regulares' => [1, 10, 11], 'aprobadas' => [1, 10, 11]],
            23 => ['regulares' => [5, 6, 14, 15], 'aprobadas' => [5, 6, 14, 15]],
            24 => ['regulares' => [6, 7], 'aprobadas' => [6, 7]],
            25 => ['regulares' => [6, 7, 22], 'aprobadas' => [6, 7, 22]],
            // 27 requiere 1° año (1 al 10)
            27 => [
                'regulares' => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                'aprobadas' => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            ],
            // 28 requiere 1° y 2° año (1 al 20)
            28 => [
                'regulares' => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                'aprobadas' => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            ],
        ];

        // 5. Insertar Correlatividades
        DB::table('materia_materia')
            ->whereIn('materia_id', array_values($materiasInsertadas))
            ->delete();

        foreach ($correlatividadesData as $ordenMateria => $requisitos) {
            if (!isset($materiasInsertadas[$ordenMateria])) continue;
            
            $materiaId = $materiasInsertadas[$ordenMateria];

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
