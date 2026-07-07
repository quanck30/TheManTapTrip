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
        Schema::create('query_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('questionId')->constrained('questions');
            $table->string('itemId');
            $table->string('title');
            $table->string('searchValue', 100);
            $table->unsignedBigInteger('radius')->nullable();
            $table->timestamps();
            $table->unique(['questionId', 'itemId']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('query_items');
    }
};
