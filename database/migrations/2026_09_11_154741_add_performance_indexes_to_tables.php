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
        Schema::table('categories', function (Blueprint $table) {
            $table->index(['is_active', 'order'], 'idx_categories_active_order');
        });

        Schema::table('nominees', function (Blueprint $table) {
            $table->index(['category_id', 'order'], 'idx_nominees_category_order');
        });

        Schema::table('backsounds', function (Blueprint $table) {
            $table->index(['is_active', 'context'], 'idx_backsounds_active_context');
        });

        Schema::table('employees', function (Blueprint $table) {
            $table->index('department', 'idx_employees_department');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropIndex('idx_categories_active_order');
        });

        Schema::table('nominees', function (Blueprint $table) {
            $table->dropIndex('idx_nominees_category_order');
        });

        Schema::table('backsounds', function (Blueprint $table) {
            $table->dropIndex('idx_backsounds_active_context');
        });

        Schema::table('employees', function (Blueprint $table) {
            $table->dropIndex('idx_employees_department');
        });
    }
};
