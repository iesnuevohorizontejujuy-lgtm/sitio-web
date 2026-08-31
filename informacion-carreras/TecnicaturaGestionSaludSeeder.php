<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Carrera;
use App\Models\Materia;
use Database\Seeders\Concerns\EnsuresCareerModules;
use Illuminate\Support\Str;

class TecnicaturaGestionSaludSeeder extends Seeder
{
    use EnsuresCareerModules;

    public function run()
    {
        // 1. Crear o buscar la Carrera por SLUG para evitar duplicados
        $carrera = Carrera::firstOrCreate(
            ['slug' => Str::slug('Administracion y Gestion de Servicios de Salud')],
            [
                'nombre' => 'Tecnicatura Superior en Adm. y Gestión de Servicios de Salud',
                'resolucion' => 'Res. 3731-E/S-23',
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
            2  => ['nombre' => 'Salud Pública', 'anio' => 1],
            3  => ['nombre' => 'Administración', 'anio' => 1],
            4  => ['nombre' => 'Vademécum', 'anio' => 1],
            5  => ['nombre' => 'Economía', 'anio' => 1],
            6  => ['nombre' => 'Régimen de Facturación', 'anio' => 1],
            7  => ['nombre' => 'Tecnologías de la Info. y Com.', 'anio' => 1],
            8  => ['nombre' => 'Legislación Sanitaria', 'anio' => 1],

            // --- 2° AÑO ---
            9  => ['nombre' => 'Matemática Financiera', 'anio' => 2],
            10 => ['nombre' => 'Org. y Adm. de Obras Sociales', 'anio' => 2],
            11 => ['nombre' => 'Costos y Presupuestos en Salud', 'anio' => 2],
            12 => ['nombre' => 'Higiene y Seguridad en el Trabajo', 'anio' => 2],
            13 => ['nombre' => 'Comercialización Serv. de Salud', 'anio' => 2],
            14 => ['nombre' => 'Información y Atención al Cliente', 'anio' => 2],
            15 => ['nombre' => 'Planificación y Prog. Sanitaria', 'anio' => 2],
            16 => ['nombre' => 'Práctica Profesionalizante I', 'anio' => 2],

            // --- 3° AÑO ---
            17 => ['nombre' => 'Ética y Deontología Profesional', 'anio' => 3],
            18 => ['nombre' => 'Adm. de Recursos Humanos', 'anio' => 3],
            19 => ['nombre' => 'Infraestructura y Equipamiento', 'anio' => 3],
            20 => ['nombre' => 'Gestión Sanitaria y Efectividad', 'anio' => 3],
            21 => ['nombre' => 'Compras y Gestión de Inventarios', 'anio' => 3],
            22 => ['nombre' => 'Estadística', 'anio' => 3],
            23 => ['nombre' => 'Práctica Profesionalizante II', 'anio' => 3],
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
            9  => ['regulares' => [1], 'aprobadas' => [1]],
            10 => ['regulares' => [3, 8], 'aprobadas' => [3, 8]],
            11 => ['regulares' => [1, 4, 6], 'aprobadas' => [1, 4, 6]],
            12 => ['regulares' => [2, 8], 'aprobadas' => [2, 8]],
            13 => ['regulares' => [3, 5], 'aprobadas' => [3, 5]],
            14 => ['regulares' => [2, 3, 7, 8], 'aprobadas' => [2, 3, 7, 8]],
            15 => ['regulares' => [2, 3, 5, 6], 'aprobadas' => [2, 3, 5, 6]],
            16 => ['regulares' => [2, 3, 5, 6], 'aprobadas' => [2, 3, 5, 6]],
            17 => ['regulares' => [8], 'aprobadas' => [8]],
            18 => ['regulares' => [3, 10], 'aprobadas' => [3, 10]],
            19 => ['regulares' => [5, 12], 'aprobadas' => [5, 12]],
            20 => ['regulares' => [10, 11, 12, 13, 14, 15], 'aprobadas' => [10, 11, 12, 13, 14, 15]],
            21 => ['regulares' => [9, 11], 'aprobadas' => [9, 11]],
            22 => ['regulares' => [9], 'aprobadas' => [9]],
            // 23 requiere 9 al 16 (toda la cursada de 2do año y bases de 1ro)
            23 => [
                'regulares' => [9, 10, 11, 12, 13, 14, 15, 16], 
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
