<?php

namespace Database\Factories;

use App\Models\ConvocatoriaIngreso;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ConvocatoriaIngreso>
 */
class ConvocatoriaIngresoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'titulo' => 'Ingreso '.now()->year,
            'ciclo_lectivo' => (string) now()->year,
            'estado' => 'abiertas',
            'bajada' => fake()->sentence(),
            'fecha_inicio' => now()->subWeek()->toDateString(),
            'fecha_fin' => now()->addMonth()->toDateString(),
            'requisitos' => [['texto' => 'Documento requerido de ejemplo']],
            'documentos' => [],
            'preguntas_frecuentes' => [[
                'pregunta' => '¿Cómo comienzo?',
                'respuesta' => 'Consultá al equipo institucional.',
            ]],
            'esta_publicada' => true,
            'publicada_at' => now(),
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'esta_publicada' => false,
            'publicada_at' => null,
        ]);
    }
}
