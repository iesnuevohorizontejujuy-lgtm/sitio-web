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
        Schema::create('materias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('carrera_id')->constrained()->cascadeOnDelete();
            $table->string('nombre');
            $table->unsignedTinyInteger('anio');
            $table->unsignedSmallInteger('orden')->default(0);
            $table->timestamps();

            $table->index(['carrera_id', 'anio', 'orden']);
            $table->unique(['carrera_id', 'anio', 'nombre']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materias');
    }
};
