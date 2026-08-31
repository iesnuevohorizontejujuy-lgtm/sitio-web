<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Carrera;
use App\Models\Materia;
use Database\Seeders\Concerns\EnsuresCareerModules;
use Illuminate\Support\Str;

class TecnicaturaAgenteSanitarioSeeder extends Seeder
{
    use EnsuresCareerModules;

    public function run()
    {
        // 1. Crear o buscar la Carrera
        $carrera = Carrera::firstOrCreate(
            ['nombre' => 'Tecnicatura Superior en Agente Sanitario y Promotor de la Salud'],
            [
                'slug' => Str::slug('Agente Sanitario y Promotor de la Salud'),
                'resolucion' => 'Res. 3466-E/S-22',
                'modalidad' => 'Presencial',
                'duracion' => '3 años',
                'activa' => true
            ]
        );

        $modulosPorAnio = $this->ensureCareerModules($carrera);

        // 2. Definir las Materias (N° de Orden => Datos)
        $materiasData = [
            // --- 1° AÑO ---
            1  => ['nombre' => 'Anatomía y Fisiología Humana', 'anio' => 1],
            2  => ['nombre' => 'Salud y Políticas Públicas', 'anio' => 1],
            3  => ['nombre' => 'Comunicación Sanitaria', 'anio' => 1],
            4  => ['nombre' => 'Psicología', 'anio' => 1],
            5  => ['nombre' => 'Epidemiología y Estadística', 'anio' => 1],
            6  => ['nombre' => 'Introducción al campo del A.S.', 'anio' => 1],
            7  => ['nombre' => 'Interculturalidad en Salud', 'anio' => 1],
            8  => ['nombre' => 'Regionalización Sanitaria y Población', 'anio' => 1],
            9  => ['nombre' => 'Seguridad Alimentaria', 'anio' => 1],
            10 => ['nombre' => 'Práctica I', 'anio' => 1],

            // --- 2° AÑO ---
            11 => ['nombre' => 'Psicología Evolutiva', 'anio' => 2],
            12 => ['nombre' => 'Metodología de la Inv. en Salud', 'anio' => 2],
            13 => ['nombre' => 'Enfermería Aplicada en APS', 'anio' => 2],
            14 => ['nombre' => 'Enf. Transmisibles y No Transm.', 'anio' => 2],
            15 => ['nombre' => 'Salud Com. y Ed. para la Salud', 'anio' => 2],
            16 => ['nombre' => 'Informática en Salud', 'anio' => 2],
            17 => ['nombre' => 'Equipo de Salud y Redes', 'anio' => 2],
            18 => ['nombre' => 'Adm. y Sist. de Información CAPS', 'anio' => 2],
            19 => ['nombre' => 'Práctica II', 'anio' => 2],
            20 => ['nombre' => 'EDI I', 'anio' => 2],

            // --- 3° AÑO ---
            21 => ['nombre' => 'Educación Salud Sexual Integral', 'anio' => 3],
            22 => ['nombre' => 'Ética y Legislación Sanitaria', 'anio' => 3],
            23 => ['nombre' => 'Salud Materno Infantil', 'anio' => 3],
            24 => ['nombre' => 'Salud del Adolescente y Mayor', 'anio' => 3],
            25 => ['nombre' => 'Salud Mental', 'anio' => 3],
            26 => ['nombre' => 'Salud y Discapacidad', 'anio' => 3],
            27 => ['nombre' => 'Proyectos e Intervención Com.', 'anio' => 3],
            28 => ['nombre' => 'EDI II', 'anio' => 3],
            29 => ['nombre' => 'Práctica III', 'anio' => 3],
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
            11 => ['regulares' => [4], 'aprobadas' => [4]],
            12 => ['regulares' => [5], 'aprobadas' => [5]],
            13 => ['regulares' => [1, 6], 'aprobadas' => [1, 6]],
            14 => ['regulares' => [1, 9], 'aprobadas' => [1, 9]],
            15 => ['regulares' => [2, 3, 4], 'aprobadas' => [2, 3, 4, 8]],
            16 => ['regulares' => [5, 6], 'aprobadas' => [5, 6]],
            17 => ['regulares' => [3, 6], 'aprobadas' => [3, 6]],
            18 => ['regulares' => [2], 'aprobadas' => [2]],
            19 => ['regulares' => [2, 6], 'aprobadas' => [2, 6, 10]],
            21 => ['regulares' => [11, 15, 17], 'aprobadas' => [11, 15, 17]],
            23 => ['regulares' => [11], 'aprobadas' => [11]],
            24 => ['regulares' => [11, 14], 'aprobadas' => [11, 14]],
            25 => ['regulares' => [11, 15], 'aprobadas' => [11, 15]],
            26 => ['regulares' => [11, 25], 'aprobadas' => [11]],
            27 => ['regulares' => [12, 15, 17], 'aprobadas' => [12, 15, 17]],
            29 => ['regulares' => [13, 14, 15], 'aprobadas' => [19]],
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
