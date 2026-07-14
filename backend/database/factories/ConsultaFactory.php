<?php

namespace Database\Factories;

use App\Models\Carrera;
use App\Models\Consulta;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Consulta>
 */
class ConsultaFactory extends Factory
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
            'nombre' => fake()->name(),
            'telefono' => '549388'.fake()->numerify('######'),
            'email' => fake()->safeEmail(),
            'asunto' => 'Consulta sobre la carrera',
            'mensaje' => fake()->paragraph(),
            'horario_preferido' => 'Por la tarde',
            'pagina_origen' => 'http://localhost:3000/carreras/carrera-ejemplo',
            'estado' => 'nueva',
        ];
    }
}
