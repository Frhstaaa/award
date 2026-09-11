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
        Schema::create('backsounds', function (Blueprint $table) {
            $table->id();
            $table->string('title', 150);
            $table->string('file_path');
            $table->enum('context', ['nominee_display', 'winner_reveal', 'general', 'background_loop'])->default('general');
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('backsounds');
    }
};
