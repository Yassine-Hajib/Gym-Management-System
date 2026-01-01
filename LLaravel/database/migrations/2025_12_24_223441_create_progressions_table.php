<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   
    public function up(): void
    {
        Schema::create('progressions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->float('weight');
            $table->date('date');
            $table->string('image_path')->nullable(); // Pour stocker le chemin de l'image
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('progressions');
    }
};