<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('CREATE EXTENSION IF NOT EXISTS pg_trgm');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_ankets_info_name ON ankets USING gin ((info->>\'first_name\') gin_trgm_ops, (info->>\'last_name\') gin_trgm_ops, (info->>\'middle_name\') gin_trgm_ops)');
    }

    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS idx_ankets_info_name');
    }
};
