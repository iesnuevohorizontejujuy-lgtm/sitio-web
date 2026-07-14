<?php

namespace Database\Factories;

use App\Models\Noticia;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Noticia>
 */
class NoticiaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->sentence(6);

        return [
            'titulo' => $title,
            'slug' => Str::slug($title),
            'contenido' => '<p>'.fake()->paragraphs(3, true).'</p>',
            'categoria' => 'general',
            'fecha_evento' => null,
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

    public function importantDate(): static
    {
        return $this->state(fn (array $attributes) => [
            'categoria' => 'fecha_importante',
            'fecha_evento' => now()->addWeek()->toDateString(),
        ]);
    }
}
