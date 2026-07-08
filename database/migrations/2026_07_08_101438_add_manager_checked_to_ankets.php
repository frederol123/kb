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
        Schema::table('ankets', function (Blueprint $table) {
            $table->boolean('manager_checked')->default(false)->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('ankets', function (Blueprint $table) {
            $table->dropColumn('manager_checked');
        });
    }
};
