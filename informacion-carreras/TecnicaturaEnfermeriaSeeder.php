<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Carrera;
use App\Models\Materia;
use Database\Seeders\Concerns\EnsuresCareerModules;
use Illuminate\Support\Str;

class TecnicaturaEnfermeriaSeeder extends Seeder
{
    use EnsuresCareerModules;

    public function run()
    {
        // 1. Crear o buscar la Carrera
        $carrera = Carrera::firstOrCreate(
            ['nombre' => 'Tecnicatura Superior en Enfermería'],
            [
                'slug' => Str::slug('Enfermeria'),
                'resolucion' => 'Res. 3586-E/S-22',
                'modalidad' => 'Presencial',
                'duracion' => '3 años',
                'activa' => true
            ]
        );

        $modulosPorAnio = $this->ensureCareerModules($carrera);

        // 2. Definir las Materias (N° de Orden => Datos)
        $materiasData = [
            // --- 1° AÑO ---
            1  => ['nombre' => 'Fundamentos Enf. Básica y Com.', 'anio' => 1],
            2  => ['nombre' => 'Anatomía y Fisiología Humana', 'anio' => 1],
            3  => ['nombre' => 'Microbiología y Parasitología', 'anio' => 1],
            4  => ['nombre' => 'Expresión Oral y Escrita', 'anio' => 1],
            5  => ['nombre' => 'Física y Química Aplicada a Enf.', 'anio' => 1],
            6  => ['nombre' => 'Antropología Filosófica y Soc. Cult.', 'anio' => 1],
            7  => ['nombre' => 'Informática Básica', 'anio' => 1],
            8  => ['nombre' => 'Práctica Profesionalizante I', 'anio' => 1],

            // --- 2° AÑO ---
            9  => ['nombre' => 'Enf. Médica y Especialidades', 'anio' => 2],
            10 => ['nombre' => 'Ética y Marco Legal en la Práctica', 'anio' => 2],
            11 => ['nombre' => 'Farmacología', 'anio' => 2],
            12 => ['nombre' => 'Nutrición', 'anio' => 2],
            13 => ['nombre' => 'Enf. Quirúrgica y Especialidades', 'anio' => 2],
            14 => ['nombre' => 'Psicología', 'anio' => 2],
            15 => ['nombre' => 'Introducción a Metodología Inv.', 'anio' => 2],
            16 => ['nombre' => 'EDI I', 'anio' => 2],
            17 => ['nombre' => 'Práctica Profesionalizante II', 'anio' => 2],

            // --- 3° AÑO ---
            18 => ['nombre' => 'Enf. Materno Infanto Juvenil', 'anio' => 3],
            19 => ['nombre' => 'Informática Aplicada a Enf.', 'anio' => 3],
            20 => ['nombre' => 'Inglés Técnico', 'anio' => 3],
            21 => ['nombre' => 'Organización y Gestión en Enf.', 'anio' => 3],
            22 => ['nombre' => 'Enfermería en Salud Mental', 'anio' => 3],
            23 => ['nombre' => 'EDI II', 'anio' => 3],
            24 => ['nombre' => 'Práctica Profesionalizante III', 'anio' => 3],
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
            9  => ['regulares' => [1, 2], 'aprobadas' => [1, 2]],
            10 => ['regulares' => [5], 'aprobadas' => []],
            11 => ['regulares' => [2, 3, 5], 'aprobadas' => [2, 5]],
            12 => ['regulares' => [1, 2, 3, 5], 'aprobadas' => [2, 5]],
            13 => ['regulares' => [1, 2, 3, 5], 'aprobadas' => [3, 5]],
            14 => ['regulares' => [6], 'aprobadas' => [6]],
            15 => ['regulares' => [4, 7], 'aprobadas' => [4, 7]],
            17 => ['regulares' => [1, 3, 5], 'aprobadas' => [2, 3, 5, 8]],
            18 => ['regulares' => [9, 11, 13], 'aprobadas' => [9, 11, 12, 14]],
            19 => ['regulares' => [15], 'aprobadas' => [15]],
            21 => ['regulares' => [10, 15], 'aprobadas' => [9, 11, 13]],
            22 => ['regulares' => [9, 13], 'aprobadas' => [9, 11, 12, 13, 14]],
            // 24 requiere 9, 11, 12, 13, 14 regulares y 9 al 15 + 17 aprobadas
            24 => [
                'regulares' => [9, 11, 12, 13, 14], 
                'aprobadas' => [9, 10, 11, 12, 13, 14, 15, 17]
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
