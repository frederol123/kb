<?php

namespace Tests\Feature;

use App\Models\Anket;
use App\Models\Tariff;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
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

    private function givePrivacyTariff(User $user): void
    {
        $tariff = Tariff::create([
            'title' => 'Расширенная страница',
            'slug' => 'extended',
            'price' => 8250,
            'description' => 'Тариф с приватностью.',
            'features' => [],
            'limits' => [
                'max_qr_codes' => 3,
                'max_gallery_images' => 30,
                'max_videos' => 15,
                'has_installation' => false,
                'has_privacy' => true,
                'has_maintenance' => false,
                'has_family_tree' => false,
                'has_video_creation' => false,
            ],
            'is_active' => true,
        ]);

        $user->update(['tariff_id' => $tariff->id]);
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

    public function test_owner_can_set_private_pin(): void
    {
        $anket = Anket::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'private',
        ]);
        $this->givePrivacyTariff($this->user);

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/ankets/{$anket->id}", [
                'status' => 'private',
                'info' => ['contact' => '+7 999 000-00-00'],
                'private_pin' => '1234',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('has_private_pin', true);

        $this->assertTrue(Hash::check('1234', $anket->fresh()->private_pin));

        // хеш пина не должен утекать в ответ
        $response->assertJsonMissingPath('private_pin');
    }

    public function test_owner_can_clear_private_pin(): void
    {
        $anket = Anket::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'private',
            'private_pin' => Hash::make('1234'),
        ]);
        $this->givePrivacyTariff($this->user);

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/ankets/{$anket->id}", [
                'status' => 'private',
                'info' => ['contact' => '+7 999 000-00-00'],
                'private_pin' => null,
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('has_private_pin', false);

        $this->assertNull($anket->fresh()->private_pin);
    }

    public function test_private_pin_requires_4_to_6_digits(): void
    {
        $anket = Anket::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'private',
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/ankets/{$anket->id}", [
                'status' => 'private',
                'info' => ['contact' => '+7 999 000-00-00'],
                'private_pin' => '12',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('private_pin');

        $this->assertNull($anket->fresh()->private_pin);
    }

    public function test_guest_without_token_cannot_view_private_anket_with_pin(): void
    {
        $anket = Anket::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'private',
            'private_pin' => Hash::make('1234'),
        ]);

        $response = $this->getJson("/api/m/{$anket->slug}");

        $response->assertStatus(403)
            ->assertJsonPath('message', 'Анкета приватная.');
    }

    public function test_guest_with_wrong_pin_gets_403(): void
    {
        $anket = Anket::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'private',
            'private_pin' => Hash::make('1234'),
        ]);

        $response = $this->postJson("/api/m/{$anket->slug}/access", ['pin' => '9999']);

        $response->assertStatus(403)
            ->assertJsonPath('message', 'Неверный пин-код.');
    }

    public function test_guest_with_correct_pin_gets_access_for_four_hours(): void
    {
        $anket = Anket::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'private',
            'private_pin' => Hash::make('1234'),
        ]);

        $response = $this->postJson("/api/m/{$anket->slug}/access", ['pin' => '1234']);

        $response->assertStatus(200)
            ->assertJsonStructure(['access_token']);

        $token = $response->json('access_token');

        $view = $this->getJson("/api/m/{$anket->slug}?access_token={$token}");

        $view->assertStatus(200)
            ->assertJsonPath('slug', $anket->slug)
            ->assertJsonMissingPath('private_pin');
    }

    public function test_expired_access_token_is_rejected(): void
    {
        $anket = Anket::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'private',
            'private_pin' => Hash::make('1234'),
        ]);

        $expiredToken = Crypt::encryptString(implode('|', [
            $anket->id,
            $anket->private_pin,
            now()->subHour()->getTimestamp(),
        ]));

        $response = $this->getJson("/api/m/{$anket->slug}?access_token={$expiredToken}");

        $response->assertStatus(403)
            ->assertJsonPath('message', 'Анкета приватная.');
    }

    public function test_access_token_invalidated_after_pin_change(): void
    {
        $anket = Anket::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'private',
            'private_pin' => Hash::make('1234'),
        ]);
        $this->givePrivacyTariff($this->user);

        $token = Crypt::encryptString(implode('|', [
            $anket->id,
            $anket->private_pin,
            now()->addHours(4)->getTimestamp(),
        ]));

        $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/ankets/{$anket->id}", [
                'status' => 'private',
                'info' => ['contact' => '+7 999 000-00-00'],
                'private_pin' => '5678',
            ])->assertStatus(200);

        // следующий запрос — от гостя (actingAs не должен сохраняться)
        $this->app['auth']->forgetGuards();

        $response = $this->getJson("/api/m/{$anket->slug}?access_token={$token}");

        $response->assertStatus(403)
            ->assertJsonPath('message', 'Анкета приватная.');
    }

    public function test_gallery_limit_uses_tariff_limits(): void
    {
        $tariff = Tariff::create([
            'title' => 'Расширенная страница',
            'slug' => 'extended',
            'price' => 8250,
            'description' => 'Тариф с большими лимитами.',
            'features' => [],
            'limits' => [
                'max_qr_codes' => 3,
                'max_gallery_images' => 30,
                'max_videos' => 30,
                'has_installation' => false,
                'has_privacy' => true,
                'has_maintenance' => false,
                'has_family_tree' => false,
                'has_video_creation' => false,
            ],
            'is_active' => true,
        ]);
        $this->user->update(['tariff_id' => $tariff->id]);

        $anket = Anket::factory()->create(['user_id' => $this->user->id, 'status' => 'draft']);

        // 20 фото — больше дефолтной колонки (6), но в пределах тарифа (30)
        $gallery = array_map(
            fn ($i) => ['url' => "https://example.com/{$i}.webp", 'text' => "Фото {$i}"],
            range(1, 20)
        );

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/ankets/{$anket->id}", [
                'status' => 'draft',
                'info' => ['contact' => '+7 999 000-00-00'],
                'content' => ['gallery' => $gallery, 'videos' => []],
            ]);

        $response->assertStatus(200)
            ->assertJsonCount(20, 'content.gallery');
    }

    public function test_gallery_limit_falls_back_to_user_column_without_tariff(): void
    {
        // у пользователя без тарифа лимит из колонки (по умолчанию 6)
        $anket = Anket::factory()->create(['user_id' => $this->user->id, 'status' => 'draft']);

        $gallery = array_map(
            fn ($i) => ['url' => "https://example.com/{$i}.webp", 'text' => "Фото {$i}"],
            range(1, 7)
        );

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/ankets/{$anket->id}", [
                'status' => 'draft',
                'info' => ['contact' => '+7 999 000-00-00'],
                'content' => ['gallery' => $gallery, 'videos' => []],
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('content.gallery');
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
