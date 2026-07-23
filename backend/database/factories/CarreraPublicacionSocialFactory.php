<?php

namespace Database\Factories;

use App\Models\Carrera;
use App\Models\CarreraPublicacionSocial;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CarreraPublicacionSocial>
 */
class CarreraPublicacionSocialFactory extends Factory
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
            'plataforma' => 'instagram',
            'tipo_contenido' => 'reel',
            'titulo' => fake()->sentence(5),
            'descripcion' => fake()->sentence(),
            'url' => 'https://www.instagram.com/reel/'.fake()->bothify('???????????').'/',
            'cuenta' => '@iesnuevohorizonte',
            'fecha_publicacion' => fake()->dateTimeBetween('-1 year', 'now'),
            'texto_boton' => 'Ver en Instagram',
            'imagen_previsualizacion_path' => null,
            'imagen_previsualizacion_alt' => null,
            'uso_institucional_autorizado' => true,
            'publicada' => true,
            'orden' => 0,
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes): array => ['publicada' => false]);
    }

    public function unauthorized(): static
    {
        return $this->state(fn (array $attributes): array => ['uso_institucional_autorizado' => false]);
    }
}
