<?php

namespace Database\Factories;

use App\Models\ConfiguracionPermisoExamen;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ConfiguracionPermisoExamen>
 */
class ConfiguracionPermisoExamenFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'titulo' => 'Antes de completar tu permiso',
            'introduccion' => 'Revisá la información de la convocatoria y prepará los datos necesarios antes de comenzar.',
            'indicaciones' => [
                ['texto' => 'Tené a mano tu DNI.'],
                ['texto' => 'Verificá las fechas y los llamados publicados.'],
                ['texto' => 'Podés incluir hasta ocho materias.'],
            ],
            'advertencia_titulo' => 'Importante',
            'advertencia' => 'Después de pagar, esperá la redirección automática de Mercado Pago.',
            'publicada' => true,
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'publicada' => false,
        ]);
    }
}
