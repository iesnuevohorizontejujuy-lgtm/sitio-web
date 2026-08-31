<?php

namespace Database\Factories;

use App\Models\DiapositivaPortada;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DiapositivaPortada>
 */
class DiapositivaPortadaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'etiqueta' => 'Educación superior en Jujuy',
            'titulo' => fake()->sentence(6),
            'bajada' => fake()->sentence(16),
            'imagen_escritorio_path' => 'portada/imagen-escritorio.webp',
            'imagen_movil_path' => null,
            'imagen_alt' => 'Actividad educativa del IES Nuevo Horizonte',
            'texto_boton' => 'Conocé más',
            'url_boton' => '/carreras',
            'texto_boton_secundario' => null,
            'url_boton_secundario' => null,
            'orden' => 0,
            'publicada' => true,
            'inicia_at' => now()->subDay(),
            'finaliza_at' => now()->addMonth(),
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'publicada' => false,
        ]);
    }
}
