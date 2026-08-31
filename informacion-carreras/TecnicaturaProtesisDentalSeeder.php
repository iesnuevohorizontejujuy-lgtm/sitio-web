<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Carrera;
use App\Models\Materia;
use Database\Seeders\Concerns\EnsuresCareerModules;
use Illuminate\Support\Str;

class TecnicaturaProtesisDentalSeeder extends Seeder
{
    use EnsuresCareerModules;

    public function run()
    {
        // 1. Crear o buscar la Carrera
        $carrera = Carrera::firstOrCreate(
            ['nombre' => 'Tecnicatura Superior en Prótesis Dental'],
            [
                'slug' => Str::slug('Protesis Dental'),
                'resolucion' => 'Res. 5594-E/S-23',
                'modalidad' => 'Presencial',
                'duracion' => '3 años',
                'activa' => true
            ]
        );

        $modulosPorAnio = $this->ensureCareerModules($carrera);

        // 2. Definir las Materias (N° de Orden => Datos)
        $materiasData = [
            // --- 1° AÑO ---
            1  => ['nombre' => 'Prótesis Removible Acrílica', 'anio' => 1],
            2  => ['nombre' => 'Materiales Dentales e Inst.', 'anio' => 1],
            3  => ['nombre' => 'Anatomía y Fisiología Dentaria', 'anio' => 1],
            4  => ['nombre' => 'Bioseguridad y Epid. Bucal', 'anio' => 1],
            5  => ['nombre' => 'Oclusión', 'anio' => 1],
            6  => ['nombre' => 'Matemática y Est. Aplicada', 'anio' => 1],
            7  => ['nombre' => 'Práctica Profesionalizante I', 'anio' => 1],

            // --- 2° AÑO ---
            8  => ['nombre' => 'Prótesis Fijas', 'anio' => 2],
            9  => ['nombre' => 'Metalurgia y Soldadura', 'anio' => 2],
            10 => ['nombre' => 'Administración y Gestión de Lab.', 'anio' => 2],
            11 => ['nombre' => 'Prótesis Superpuesta', 'anio' => 2],
            12 => ['nombre' => 'Práctica Profesionalizante II', 'anio' => 2],

            // --- 3° AÑO ---
            13 => ['nombre' => 'Prótesis Removible Definitiva', 'anio' => 3],
            14 => ['nombre' => 'Implantes y Cerámicas', 'anio' => 3],
            15 => ['nombre' => 'Ética Profesional y Legislación', 'anio' => 3],
            16 => ['nombre' => 'Ortodoncia y Ortopedia Dentomax.', 'anio' => 3],
            17 => ['nombre' => 'EDI', 'anio' => 3],
            18 => ['nombre' => 'Práctica Profesionalizante III', 'anio' => 3],
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
            8  => ['regulares' => [3], 'aprobadas' => []],
            9  => ['regulares' => [2, 6], 'aprobadas' => []],
            10 => ['regulares' => [6], 'aprobadas' => []],
            11 => ['regulares' => [1, 5], 'aprobadas' => [1]],
            12 => ['regulares' => [1, 3, 5, 7], 'aprobadas' => [5, 7]],
            13 => ['regulares' => [11], 'aprobadas' => [1, 3]],
            14 => ['regulares' => [8], 'aprobadas' => [2, 4]],
            15 => ['regulares' => [], 'aprobadas' => [12]],
            16 => ['regulares' => [8], 'aprobadas' => [5]],
            18 => ['regulares' => [8, 11, 12], 'aprobadas' => [7, 12]],
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
