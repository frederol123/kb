<?php

namespace Tests\Feature;

use App\Models\Condolence;
use App\Models\Anket;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CondolenceTest extends TestCase
{
    use RefreshDatabase;

    public function test_anyone_can_add_condolence(): void
    {
        $anket = Anket::factory()->create(['status' => 'published']);

        $response = $this->postJson('/api/condolences', [
            'anket_id' => $anket->id,
            'author_name' => 'Гость',
            'message' => 'Соболезную',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('author_name', 'Гость');

        $this->assertDatabaseHas('condolences', [
            'anket_id' => $anket->id,
            'author_name' => 'Гость',
        ]);
    }

    public function test_condolence_validation(): void
    {
        $response = $this->postJson('/api/condolences', [
            'anket_id' => 9999,
            'author_name' => '',
            'message' => '',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['anket_id', 'author_name', 'message']);
    }
}
