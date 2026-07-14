<?php

namespace Database\Factories;

use App\Models\Carrera;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Carrera>
 */
class CarreraFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->sentence(4);

        return [
            'nombre' => $name,
            'slug' => Str::slug($name),
            'nombre_corto' => fake()->words(2, true),
            'area' => fake()->randomElement(['Salud', 'Tecnología', 'Gestión', 'Sociedad y comunicación', 'Actividad física']),
            'duracion_anios' => 3,
            'modalidad' => 'Presencial',
            'titulo_otorgado' => $name,
            'resolucion' => 'Res. '.fake()->numberBetween(1000, 9999).'-E-22',
            'descripcion_corta' => fake()->sentence(),
            'descripcion' => '<p>'.fake()->paragraph().'</p>',
            'perfil_profesional' => '<p>'.fake()->paragraph().'</p>',
            'capacidades' => [fake()->sentence(4), fake()->sentence(4)],
            'salida_laboral' => [fake()->company(), fake()->company()],
            'destacada' => false,
            'publicada' => true,
            'orden' => 0,
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => ['publicada' => false]);
    }
}
