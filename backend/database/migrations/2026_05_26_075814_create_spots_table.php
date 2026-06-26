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
        Schema::create('spots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('userId')->constrained('users')->cascadeOnDelete();
            $table->string('spotId', 255);
            $table->string('address', 255);
            $table->boolean('isVisited')->default(false);
            $table->timestamps();
            $table->unique([
                'userId',
                'spotId'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spots');
    }
};
