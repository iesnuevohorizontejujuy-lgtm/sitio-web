<?php

namespace Database\Factories;

use App\Models\Autoridad;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Autoridad>
 */
class AutoridadFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nombre' => fake()->name(),
            'cargo' => fake()->jobTitle(),
            'descripcion' => fake()->sentence(),
            'publicada' => true,
            'orden' => fake()->numberBetween(0, 20),
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => ['publicada' => false]);
    }
}
