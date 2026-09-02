<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('configuraciones_permiso_examen', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->text('introduccion');
            $table->json('indicaciones')->nullable();
            $table->string('advertencia_titulo')->nullable();
            $table->text('advertencia')->nullable();
            $table->boolean('publicada')->default(false)->index();
            $table->timestamps();
        });

        DB::table('configuraciones_permiso_examen')->insert([
            'titulo' => 'Antes de completar tu permiso',
            'introduccion' => 'Prepará la información necesaria y revisá cada dato antes de continuar al pago.',
            'indicaciones' => json_encode([
                ['texto' => 'Tené a mano tu DNI y escribí todos tus nombres y apellidos sin abreviaturas.'],
                ['texto' => 'Verificá las fechas, el llamado y las materias que vas a rendir.'],
                ['texto' => 'Seleccioná la carrera y el turno en el que cursás. Podés incluir hasta ocho materias.'],
                ['texto' => 'Después de pagar, esperá la redirección automática al sitio institucional.'],
            ], JSON_THROW_ON_ERROR),
            'advertencia_titulo' => 'Revisá antes de pagar',
            'advertencia' => 'Los datos incorrectos pueden invalidar el permiso. No cierres la pestaña de Mercado Pago: al regresar podrás consultar la acreditación y descargar el comprobante.',
            'publicada' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('configuraciones_permiso_examen');
    }
};
