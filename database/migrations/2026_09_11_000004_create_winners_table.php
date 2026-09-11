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
        Schema::create('winners', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->unique()->constrained('categories')->cascadeOnDelete();
            $table->foreignId('nominee_id')->constrained('nominees')->cascadeOnDelete();
            $table->timestamp('announced_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('winners');
    }
};
