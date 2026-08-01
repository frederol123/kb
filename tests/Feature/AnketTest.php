<?php

namespace Tests\Feature;

use App\Models\Anket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AnketTest extends TestCase
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

    public function test_user_can_list_own_ankets(): void
    {
        Anket::factory(3)->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/ankets');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_user_cannot_see_other_user_ankets(): void
    {
        Anket::factory(3)->create(['user_id' => $this->otherUser->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/ankets');

        $response->assertStatus(200)
            ->assertJsonCount(0, 'data');
    }

    public function test_user_can_create_anket(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/ankets', [
                'info' => ['first_name' => 'Иван', 'last_name' => 'Петров'],
                'content' => ['biography' => 'Биография'],
                'status' => 'draft',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('slug', 'petrov-ivan')
            ->assertJsonPath('status', 'draft');

        $this->assertDatabaseHas('ankets', [
            'user_id' => $this->user->id,
            'slug' => 'petrov-ivan',
        ]);
    }

    public function test_user_can_update_anket_info(): void
    {
        $anket = Anket::factory()->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/ankets/{$anket->id}", [
                'info' => ['first_name' => 'Пётр', 'last_name' => 'Сидоров', 'contact' => 'test@test.com'],
                'status' => 'published',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'published');
    }

    public function test_user_cannot_update_other_user_anket(): void
    {
        $anket = Anket::factory()->create(['user_id' => $this->otherUser->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/ankets/{$anket->id}", [
                'info' => ['first_name' => 'Пётр'],
            ]);

        $response->assertStatus(403);
    }

    public function test_user_can_delete_own_anket(): void
    {
        $anket = Anket::factory()->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->deleteJson("/api/ankets/{$anket->id}");

        $response->assertStatus(204);
        $this->assertSoftDeleted($anket);
    }

    public function test_guest_can_view_published_anket(): void
    {
        $anket = Anket::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'published',
        ]);

        $response = $this->getJson("/api/m/{$anket->slug}");

        $response->assertStatus(200)
            ->assertJsonPath('slug', $anket->slug);
    }

    public function test_guest_cannot_view_draft_anket(): void
    {
        $anket = Anket::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'draft',
        ]);

        $response = $this->getJson("/api/m/{$anket->slug}");

        $response->assertStatus(403)
            ->assertJsonPath('message', 'Просмотр доступен только при статусе «Приватный» или «Опубликованный».');
    }

    public function test_public_memorial_page(): void
    {
        $anket = Anket::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'published',
        ]);

        $response = $this->getJson("/api/m/{$anket->slug}");

        $response->assertStatus(200)
            ->assertJsonPath('slug', $anket->slug);
    }

    public function test_public_memorial_page_not_found_for_draft(): void
    {
        $anket = Anket::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'draft',
        ]);

        $response = $this->getJson("/api/m/{$anket->slug}");

        $response->assertStatus(403)
            ->assertJsonPath('message', 'Просмотр доступен только при статусе «Приватный» или «Опубликованный».');
    }

    public function test_guest_cannot_view_private_anket(): void
    {
        $anket = Anket::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'private',
        ]);

        $response = $this->getJson("/api/m/{$anket->slug}");

        $response->assertStatus(403)
            ->assertJsonPath('message', 'Анкета приватная.');
    }

    public function test_non_owner_cannot_view_private_anket(): void
    {
        $anket = Anket::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'private',
        ]);

        $response = $this->actingAs($this->otherUser, 'sanctum')
            ->getJson("/api/m/{$anket->slug}");

        $response->assertStatus(403)
            ->assertJsonPath('message', 'Анкета приватная.');
    }

    public function test_owner_can_view_private_anket(): void
    {
        $anket = Anket::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'private',
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson("/api/m/{$anket->slug}");

        $response->assertStatus(200)
            ->assertJsonPath('slug', $anket->slug);
    }

    public function test_guest_401_for_protected_routes(): void
    {
        $response = $this->getJson('/api/ankets');
        $response->assertStatus(401);

        $response = $this->postJson('/api/ankets', []);
        $response->assertStatus(401);
    }

    public function test_slug_deduplication(): void
    {
        Anket::factory()->create([
            'user_id' => $this->user->id,
            'slug' => 'petrov-ivan',
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/ankets', [
                'info' => ['first_name' => 'Иван', 'last_name' => 'Петров'],
                'content' => ['biography' => 'Тест'],
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('slug', 'petrov-ivan-1');
    }
}
