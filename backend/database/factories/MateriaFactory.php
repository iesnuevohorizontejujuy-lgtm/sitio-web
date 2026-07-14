<?php

namespace Database\Factories;

use App\Models\Carrera;
use App\Models\Materia;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Materia>
 */
class MateriaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'carrera_id' => Carrera::factory(),
            'nombre' => fake()->unique()->words(3, true),
            'anio' => fake()->numberBetween(1, 3),
            'orden' => fake()->numberBetween(1, 10),
        ];
    }
}
