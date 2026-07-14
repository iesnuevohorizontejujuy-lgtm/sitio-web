<?php

namespace Database\Factories;

use App\Models\Carrera;
use App\Models\CarreraImagen;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CarreraImagen>
 */
class CarreraImagenFactory extends Factory
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
            'path' => 'carreras/galerias/'.fake()->uuid().'.jpg',
            'texto_alternativo' => fake()->sentence(6),
            'epigrafe' => fake()->sentence(),
            'orden' => 0,
        ];
    }
}
