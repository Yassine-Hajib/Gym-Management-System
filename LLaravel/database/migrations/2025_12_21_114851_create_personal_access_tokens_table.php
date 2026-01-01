<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  
    public function up(): void
    {
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');     // Définit l'utilisateur Connecter
            $table->text('name');
            $table->string('token', 64)->unique();  //Le code geenerer quand L'utilisateur se connecte
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamps();
        });
    }
        
    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
    }
};
