<?php

namespace Tests\Feature;

use App\Models\SocialAccount;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use Tests\TestCase;

class SocialAuthTest extends TestCase
{
    use RefreshDatabase;

    private function fakeSocialiteUser(array $attrs = []): void
    {
        $user = new SocialiteUser();
        $user->id = $attrs['id'] ?? 'google-123';
        $user->name = $attrs['name'] ?? 'Иван Петров';
        $user->email = $attrs['email'] ?? 'ivan.petrov@gmail.com';
        $user->token = 'fake-access-token';

        Socialite::shouldReceive('driver')
            ->with('google')
            ->andReturnSelf()
            ->shouldReceive('stateless')
            ->andReturnSelf()
            ->shouldReceive('user')
            ->andReturn($user);
    }

    public function test_callback_creates_new_user(): void
    {
        $this->fakeSocialiteUser();

        $response = $this->get('/api/auth/google/callback');

        $response->assertStatus(302);
        $response->assertRedirectContains('social_token=');

        $this->assertDatabaseHas('users', [
            'email' => 'ivan.petrov@gmail.com',
            'name' => 'Иван Петров',
        ]);

        $user = User::where('email', 'ivan.petrov@gmail.com')->first();
        $this->assertNotNull($user);
        $this->assertDatabaseHas('social_accounts', [
            'user_id' => $user->id,
            'provider' => 'google',
            'provider_user_id' => 'google-123',
        ]);
    }

    public function test_callback_logs_in_existing_user_by_email(): void
    {
        $user = User::create([
            'login' => 'ivan_petrov',
            'name' => 'Иван Петров',
            'email' => 'ivan.petrov@gmail.com',
            'password' => 'password123',
        ]);

        $this->fakeSocialiteUser();

        $this->get('/api/auth/google/callback');

        $this->assertSame(1, User::where('email', 'ivan.petrov@gmail.com')->count());
        $this->assertDatabaseHas('social_accounts', [
            'user_id' => $user->id,
            'provider' => 'google',
        ]);
    }

    public function test_callback_returns_same_user_on_second_login(): void
    {
        $this->fakeSocialiteUser();

        $this->get('/api/auth/google/callback');
        $this->get('/api/auth/google/callback');

        $this->assertSame(1, User::where('email', 'ivan.petrov@gmail.com')->count());
        $this->assertSame(1, SocialAccount::where('provider', 'google')->count());
    }

    public function test_callback_generates_unique_login(): void
    {
        User::create([
            'login' => 'ivan-petrov',
            'name' => 'Иван Петров',
            'email' => 'other@example.com',
            'password' => 'password123',
        ]);

        $this->fakeSocialiteUser(['name' => 'Ivan Petrov']);

        $this->get('/api/auth/google/callback');

        $this->assertDatabaseHas('users', ['login' => 'ivan-petrov2']);
    }

    // ──────────────────────────────────────────────
    // VK ID SDK (exchange silent token)
    // ──────────────────────────────────────────────

    private function fakeVkApi(): void
    {
        // ВАЖНО: Http::fake матчит только паттерны со '*' (Str::is).
        // Последовательность ответов — только через Http::sequence()
        // (массив из Http::response в этой версии Laravel не работает).
        $json = ['Content-Type' => 'application/json'];

        Http::fake([
            '*' => Http::sequence()
                ->push([
                    'response' => [
                        'access_token' => 'vk-access-token',
                        'user_id' => 123456,
                    ],
                ], 200, $json)
                ->push([
                    'response' => [
                        ['id' => 123456, 'first_name' => 'Иван', 'last_name' => 'Петров'],
                    ],
                ], 200, $json),
        ]);
    }

    public function test_vk_exchange_creates_new_user(): void
    {
        $this->fakeVkApi();

        $response = $this->postJson('/api/auth/vk/exchange', ['token' => 'silent-token']);

        $response->assertStatus(201)
            ->assertJsonStructure(['token', 'user'])
            ->assertJsonPath('user.name', 'Иван Петров');

        $user = User::where('name', 'Иван Петров')->first();
        $this->assertNotNull($user);
        $this->assertDatabaseHas('social_accounts', [
            'user_id' => $user->id,
            'provider' => 'vkontakte',
            'provider_user_id' => '123456',
        ]);
    }

    public function test_vk_exchange_requires_token(): void
    {
        $response = $this->postJson('/api/auth/vk/exchange', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('token');
    }

    public function test_vk_exchange_handles_vk_error(): void
    {
        Http::fake([
            '*' => Http::response([
                'error' => ['error_code' => 5, 'error_msg' => 'User authorization failed'],
            ], 200, ['Content-Type' => 'application/json']),
        ]);

        $response = $this->postJson('/api/auth/vk/exchange', ['token' => 'bad-token']);

        $response->assertStatus(422)
            ->assertJsonPath('message', 'Не удалось авторизоваться через VK.');
    }
}
