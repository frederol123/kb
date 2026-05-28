<?php

namespace Tests\Feature;

use App\Models\Condolence;
use App\Models\Anket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CondolenceTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_add_condolence(): void
    {
        $user = User::factory()->create(['name' => 'Иван']);
        $anket = Anket::factory()->create(['status' => 'published']);

        $response = $this->actingAs($user)
            ->postJson('/api/condolences', [
                'anket_id' => $anket->id,
                'message' => 'Соболезную',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('author_name', 'Иван')
            ->assertJsonPath('user_id', $user->id);
    }

    public function test_unauthenticated_user_cannot_add_condolence(): void
    {
        $anket = Anket::factory()->create(['status' => 'published']);

        $response = $this->postJson('/api/condolences', [
            'anket_id' => $anket->id,
            'message' => 'Соболезную',
        ]);

        $response->assertStatus(401);
    }

    public function test_cannot_add_duplicate_condolence(): void
    {
        $user = User::factory()->create();
        $anket = Anket::factory()->create(['status' => 'published']);

        // Первое — OK
        $this->actingAs($user)->postJson('/api/condolences', [
            'anket_id' => $anket->id,
            'message' => 'Первое сообщение',
        ])->assertStatus(201);

        // Второе — дубликат, должно быть отклонено
        $response = $this->actingAs($user)->postJson('/api/condolences', [
            'anket_id' => $anket->id,
            'message' => 'Второе сообщение',
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('message', 'Вы уже оставили соболезнование на этой странице');
    }

    public function test_validation_errors(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/condolences', [
            'anket_id' => 9999,
            'message' => '',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['anket_id', 'message']);
    }
}
