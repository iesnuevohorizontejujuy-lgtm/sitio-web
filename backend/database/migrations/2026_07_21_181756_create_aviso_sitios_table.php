<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('avisos_sitio', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->text('mensaje');
            $table->string('imagen_path')->nullable();
            $table->string('presentacion', 20)->default('modal');
            $table->json('paginas');
            $table->string('texto_enlace')->nullable();
            $table->string('url_enlace', 1000)->nullable();
            $table->string('frecuencia', 20)->default('sesion');
            $table->unsignedTinyInteger('prioridad')->default(0);
            $table->boolean('publicado')->default(false);
            $table->timestamp('inicia_at')->nullable();
            $table->timestamp('finaliza_at')->nullable();
            $table->timestamps();

            $table->index(['publicado', 'inicia_at', 'finaliza_at']);
            $table->index(['presentacion', 'prioridad']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('avisos_sitio');
    }
};
