<?php

namespace Tests\Feature;

use App\Models\Drev;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DrevTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private User $otherUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->otherUser = User::factory()->create();
    }

    public function test_user_can_list_own_drevs(): void
    {
        Drev::factory(3)->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/drevs');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_user_cannot_see_other_user_drevs(): void
    {
        Drev::factory(3)->create(['user_id' => $this->otherUser->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/drevs');

        $response->assertStatus(200)
            ->assertJsonCount(0);
    }

    public function test_user_can_create_drev(): void
    {
        $payload = [
            'title' => 'Моё генеалогическое древо',
            'description' => 'Описание древа',
            'data' => [
                'generations' => [
                    [
                        'name' => 'Первое поколение',
                        'families' => [
                            [
                                'name' => 'Семья Ивановых',
                                'marriage' => '1975-06-15',
                                'husband_anket_id' => 1,
                                'wife_anket_id' => 2,
                                'kids_anket_ids' => [3, 4],
                            ],
                        ],
                    ],
                ],
            ],
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/drevs', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('title', 'Моё генеалогическое древо')
            ->assertJsonPath('data.generations.0.name', 'Первое поколение')
            ->assertJsonPath('data.generations.0.families.0.name', 'Семья Ивановых');

        $this->assertDatabaseHas('drevs', [
            'user_id' => $this->user->id,
            'title' => 'Моё генеалогическое древо',
        ]);
    }

    public function test_create_drev_requires_title(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/drevs', [
                'data' => ['generations' => []],
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title']);
    }

    public function test_user_can_view_own_drev(): void
    {
        $drev = Drev::factory()->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson("/api/drevs/{$drev->id}");

        $response->assertStatus(200)
            ->assertJsonPath('title', $drev->title);
    }

    public function test_user_cannot_view_other_user_drev(): void
    {
        $drev = Drev::factory()->create(['user_id' => $this->otherUser->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson("/api/drevs/{$drev->id}");

        $response->assertStatus(403);
    }

    public function test_user_can_update_drev(): void
    {
        $drev = Drev::factory()->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/drevs/{$drev->id}", [
                'title' => 'Обновлённое название',
                'data' => ['generations' => [['name' => 'Новое поколение', 'families' => []]]],
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('title', 'Обновлённое название')
            ->assertJsonPath('data.generations.0.name', 'Новое поколение');
    }

    public function test_user_cannot_update_other_user_drev(): void
    {
        $drev = Drev::factory()->create(['user_id' => $this->otherUser->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/drevs/{$drev->id}", [
                'title' => 'Чужое древо',
            ]);

        $response->assertStatus(403);
    }

    public function test_user_can_delete_own_drev(): void
    {
        $drev = Drev::factory()->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->deleteJson("/api/drevs/{$drev->id}");

        $response->assertStatus(204);
        $this->assertSoftDeleted($drev);
    }

    public function test_user_cannot_delete_other_user_drev(): void
    {
        $drev = Drev::factory()->create(['user_id' => $this->otherUser->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->deleteJson("/api/drevs/{$drev->id}");

        $response->assertStatus(403);
    }

    public function test_guest_401_for_drev_routes(): void
    {
        $response = $this->getJson('/api/drevs');
        $response->assertStatus(401);

        $response = $this->postJson('/api/drevs', ['title' => 'test']);
        $response->assertStatus(401);

        $drev = Drev::factory()->create();
        $response = $this->getJson("/api/drevs/{$drev->id}");
        $response->assertStatus(401);
    }
}
