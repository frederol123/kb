<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Фейк запроса к Yandex SmartCaptcha — всегда успех
        Http::fake([
            'https://smartcaptcha.yandexcloud.net/validate' => Http::response([
                'status' => 'ok',
            ]),
        ]);
    }

    // ──────────────────────────────────────────────
    // Регистрация
    // ──────────────────────────────────────────────

    public function test_user_can_register_with_login(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'login' => 'ivan_petrov',
            'name' => 'Иван Петров',
            'email' => 'ivan@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'captcha_token' => 'test-token',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['token', 'user'])
            ->assertJsonPath('user.login', 'ivan_petrov')
            ->assertJsonPath('user.name', 'Иван Петров')
            ->assertJsonPath('user.email', 'ivan@example.com');

        $this->assertDatabaseHas('users', [
            'login' => 'ivan_petrov',
            'email' => 'ivan@example.com',
        ]);
    }

    public function test_register_requires_login(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'captcha_token' => 'test-token',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['login']);
    }

    public function test_register_requires_email(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'login' => 'testuser',
            'name' => 'Test',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'captcha_token' => 'test-token',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_register_requires_password_confirmation(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'login' => 'testuser',
            'email' => 'test@example.com',
            'password' => 'password123',
            'captcha_token' => 'test-token',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_register_requires_captcha(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'login' => 'testuser',
            'name' => 'Test',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['captcha_token']);
    }

    // ──────────────────────────────────────────────
    // Авторизация
    // ──────────────────────────────────────────────

    public function test_user_can_login_by_email(): void
    {
        User::factory()->create([
            'login' => 'loginuser',
            'email' => 'login@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'login@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['token', 'user'])
            ->assertJsonPath('user.email', 'login@example.com');
    }

    public function test_user_can_login_by_login(): void
    {
        User::factory()->create([
            'login' => 'ivan_login',
            'email' => 'ivan_login@example.com',
            'password' => bcrypt('secret123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'login' => 'ivan_login',
            'password' => 'secret123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['token', 'user'])
            ->assertJsonPath('user.login', 'ivan_login');
    }

    public function test_login_with_wrong_password_fails(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('correct_password'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'wrong_password',
        ]);

        $response->assertStatus(422);
    }

    public function test_login_with_nonexistent_user_fails(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'nobody@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(422);
    }

    // ──────────────────────────────────────────────
    // Профиль (me)
    // ──────────────────────────────────────────────

    public function test_me_requires_auth(): void
    {
        $response = $this->getJson('/api/auth/me');
        $response->assertStatus(401);
    }

    public function test_me_returns_user(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/auth/me');

        $response->assertStatus(200)
            ->assertJsonPath('login', $user->login)
            ->assertJsonPath('email', $user->email);
    }

    // ──────────────────────────────────────────────
    // Выход
    // ──────────────────────────────────────────────

    public function test_user_can_logout(): void
    {
        $user = User::factory()->create();

        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/auth/logout');

        $response->assertStatus(200);
    }

    // ──────────────────────────────────────────────
    // Phpass hash migration
    // ──────────────────────────────────────────────

    public function test_phpass_hash_validation_and_rehash(): void
    {
        $phpassHash = '$P$6d6wi7423zhQATchn8dop6viQqQ2ZV0';

        $userId = DB::table('users')->insertGetId([
            'login' => 'old_user_phpass',
            'name' => 'Old User',
            'email' => 'old@example.com',
            'password' => $phpassHash,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'old@example.com',
            'password' => 'oldpassword',
        ]);

        $response->assertStatus(200);

        $user = User::find($userId);
        $this->assertStringStartsWith('$2y$', $user->password);
    }
}
