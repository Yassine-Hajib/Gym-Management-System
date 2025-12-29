<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id(); 
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('role', ['owner', 'coach', 'member'])->default('member'); 
            $table->unsignedBigInteger('coach_id')->nullable(); 
            $table->foreign('coach_id')->references('id')->on('users')->onDelete('set null');
            $table->rememberToken();
            $table->timestamps();
            $table->date('dob')->nullable(); 
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};