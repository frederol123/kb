<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('login', 255)->nullable()->unique()->after('name');
        });

        // Копируем name в login для существующих пользователей
        DB::table('users')->whereNull('login')->update(['login' => DB::raw('name')]);

        // Делаем login обязательным
        Schema::table('users', function (Blueprint $table) {
            $table->string('login', 255)->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('login');
        });
    }
};
