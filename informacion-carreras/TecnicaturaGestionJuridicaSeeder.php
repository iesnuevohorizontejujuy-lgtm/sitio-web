<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Carrera;
use App\Models\Materia;
use Database\Seeders\Concerns\EnsuresCareerModules;
use Illuminate\Support\Str;

class TecnicaturaGestionJuridicaSeeder extends Seeder
{
    use EnsuresCareerModules;

    public function run()
    {
        // 1. Crear o buscar la Carrera
        $carrera = Carrera::firstOrCreate(
            ['nombre' => 'Tecnicatura Superior en Gestión Jurídica'],
            [
                'slug' => Str::slug('Gestion Juridica'),
                'resolucion' => 'Res. 3748-E-22',
                'modalidad' => 'Presencial',
                'duracion' => '3 años',
                'activa' => true
            ]
        );

        $modulosPorAnio = $this->ensureCareerModules($carrera);

        // 2. Definir las Materias (N° de Orden => Datos)
        $materiasData = [
            // --- 1° AÑO ---
            1  => ['nombre' => 'Matemática Financiera', 'anio' => 1],
            2  => ['nombre' => 'Derecho Civil y Comercial', 'anio' => 1],
            3  => ['nombre' => 'Administración', 'anio' => 1],
            4  => ['nombre' => 'Economía', 'anio' => 1],
            5  => ['nombre' => 'Informática', 'anio' => 1],
            6  => ['nombre' => 'Atención al Cliente', 'anio' => 1],
            7  => ['nombre' => 'Práctica Profesionalizante I', 'anio' => 1],

            // --- 2° AÑO ---
            8  => ['nombre' => 'Inglés', 'anio' => 2],
            9  => ['nombre' => 'Informática Aplicada a la Gestión', 'anio' => 2],
            10 => ['nombre' => 'Comunicación Oral y Escrita', 'anio' => 2],
            11 => ['nombre' => 'Derecho Laboral y Seg. Social', 'anio' => 2],
            12 => ['nombre' => 'Contabilidad', 'anio' => 2],
            13 => ['nombre' => 'Gestión del Tiempo y Org. Trabajo', 'anio' => 2],
            14 => ['nombre' => 'Práctica Profesionalizante II', 'anio' => 2],

            // --- 3° AÑO ---
            15 => ['nombre' => 'Ética y Deontología Profesional', 'anio' => 3],
            16 => ['nombre' => 'Derecho Público', 'anio' => 3],
            17 => ['nombre' => 'Derecho de Familia y Sucesiones', 'anio' => 3],
            18 => ['nombre' => 'Régimen Tributario de Empresas', 'anio' => 3],
            19 => ['nombre' => 'Gestión y Planificación Estratégica', 'anio' => 3],
            20 => ['nombre' => 'Derecho Penal', 'anio' => 3],
            21 => ['nombre' => 'Práctica Profesionalizante III', 'anio' => 3],
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
        // Según Res. 3748-E-22 los espacios NO registran correlatividades
        $correlatividadesData = [];

        // 5. Insertar Correlatividades (Se ejecuta la limpieza por si había datos previos)
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
