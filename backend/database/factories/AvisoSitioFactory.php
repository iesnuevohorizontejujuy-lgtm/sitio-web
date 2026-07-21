<?php

namespace Database\Factories;

use App\Models\AvisoSitio;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AvisoSitio>
 */
class AvisoSitioFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'titulo' => fake()->sentence(5),
            'mensaje' => fake()->paragraph(),
            'presentacion' => 'modal',
            'paginas' => ['todas'],
            'texto_enlace' => 'Más información',
            'url_enlace' => '/ingresantes',
            'frecuencia' => 'sesion',
            'prioridad' => fake()->numberBetween(0, 10),
            'publicado' => true,
            'inicia_at' => now()->subHour(),
            'finaliza_at' => now()->addWeek(),
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => ['publicado' => false]);
    }

    public function scheduled(): static
    {
        return $this->state(fn (array $attributes) => [
            'inicia_at' => now()->addDay(),
            'finaliza_at' => now()->addWeek(),
        ]);
    }

    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'inicia_at' => now()->subWeek(),
            'finaliza_at' => now()->subDay(),
        ]);
    }
}
