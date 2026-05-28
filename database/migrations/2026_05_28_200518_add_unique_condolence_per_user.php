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
        // Удаляем дубликаты перед добавлением уникального индекса
        DB::statement("
            DELETE FROM condolences WHERE id IN (
                SELECT id FROM (
                    SELECT id,
                           ROW_NUMBER() OVER (PARTITION BY user_id, anket_id ORDER BY created_at ASC) AS rn
                    FROM condolences
                    WHERE user_id IS NOT NULL
                ) AS dup
                WHERE dup.rn > 1
            )
        ");

        Schema::table('condolences', function (Blueprint $table) {
            $table->unique(['user_id', 'anket_id'], 'condolences_user_anket_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('condolences', function (Blueprint $table) {
            $table->dropUnique('condolences_user_anket_unique');
        });
    }
};
