<?php

namespace Database\Seeders;

use App\Models\Anket;
use App\Models\Condolence;
use App\Models\Drev;
use App\Models\Novost;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        User::factory(5)->create();

        Anket::factory(10)->published()->create();
        Anket::factory(3)->draft()->create();
        Anket::factory(2)->withFamily()->published()->create();

        Drev::factory(5)->create();

        Novost::factory(8)->create();
        Novost::factory(2)->unpublished()->create();

        Transaction::factory(5)->succeeded()->create();
        Transaction::factory(2)->pending()->create();

        Condolence::factory(8)->create();
        Condolence::factory(3)->anonymous()->create();
    }
}
