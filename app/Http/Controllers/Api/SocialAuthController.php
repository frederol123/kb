<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SocialAccount;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    private const SUPPORTED_PROVIDERS = ['google', 'vkontakte'];

    /**
     * Редирект пользователя на страницу провайдера (Google/VK).
     */
    public function redirect(string $provider): RedirectResponse
    {
        $this->ensureSupported($provider);

        return Socialite::driver($provider)->redirect();
    }

    /**
     * Обработка ответа провайдера после авторизации.
     */
    public function callback(string $provider): RedirectResponse
    {
        $this->ensureSupported($provider);

        $frontendUrl = config('app.url');

        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Social auth callback failed', [
                'provider' => $provider,
                'error' => $e->getMessage(),
            ]);

            return redirect($frontendUrl . '/?social_error=' . urlencode('Не удалось войти через ' . $provider . '. Попробуйте ещё раз.'));
        }

        $user = $this->findOrCreateUser($provider, $socialUser);

        $token = $user->createToken('social-' . $provider)->plainTextToken;

        // Если пользователь не подтвердил email — подтверждаем автоматически (соцсеть уже подтвердила личность)
        if (is_null($user->email_verified_at) && $user->email) {
            $user->forceFill(['email_verified_at' => now()])->save();
        }

        return redirect($frontendUrl . '/?social_token=' . $token . '&provider=' . $provider);
    }

    private function findOrCreateUser(string $provider, $socialUser): User
    {
        $providerUserId = (string) $socialUser->getId();

        // 1. Ищем привязанный соц-аккаунт
        $socialAccount = SocialAccount::where('provider', $provider)
            ->where('provider_user_id', $providerUserId)
            ->first();

        if ($socialAccount) {
            return $socialAccount->user;
        }

        // 2. Ищем пользователя по email (если провайдер его отдал)
        $email = $socialUser->getEmail();
        if ($email) {
            $user = User::where('email', $email)->first();
            if ($user) {
                $this->attachAccount($user, $provider, $providerUserId);
                return $user;
            }
        }

        // 3. Создаём нового пользователя
        $user = User::create([
            'login' => $this->generateUniqueLogin($socialUser->getName() ?? $email ?? $provider),
            'name' => $socialUser->getName() ?? $provider,
            'email' => $email,
            'password' => Str::random(32),
        ]);

        $this->attachAccount($user, $provider, $providerUserId);

        return $user;
    }

    private function attachAccount(User $user, string $provider, string $providerUserId): void
    {
        $user->socialAccounts()->firstOrCreate([
            'provider' => $provider,
            'provider_user_id' => $providerUserId,
        ]);
    }

    private function generateUniqueLogin(string $base): string
    {
        $slug = Str::slug($base, '-') ?: 'user';
        $slug = Str::lower($slug);

        if (!User::where('login', $slug)->exists()) {
            return $slug;
        }

        $i = 2;
        while (User::where('login', $slug . $i)->exists()) {
            $i++;
        }

        return $slug . $i;
    }

    private function ensureSupported(string $provider): void
    {
        if (!in_array($provider, self::SUPPORTED_PROVIDERS, true)) {
            abort(404, 'Unknown provider');
        }
    }

    /**
     * VK ID SDK: обмен silent-токена (с фронта) на данные пользователя.
     * Принимает POST { token } — silent token от VKID.Auth.exchangeCode.
     */
    public function vkExchange(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'token' => ['required', 'string'],
        ]);

        $serviceToken = config('services.vkontakte.service_token');

        if (!$serviceToken) {
            return response()->json(['message' => 'VK не настроен (нет сервисного ключа).'], 500);
        }

        // 1. Обмениваем silent-токен на обычный access_token
        $exchange = \Illuminate\Support\Facades\Http::get('https://api.vk.com/method/auth.exchangeSilentToken', [
            'token' => $request->token,
            'access_token' => $serviceToken,
            'token_ttl' => 3600,
            'v' => '5.199',
        ])->json();

        if (isset($exchange['error'])) {
            \Illuminate\Support\Facades\Log::warning('VK exchangeSilentToken failed', [
                'error' => $exchange['error'],
            ]);

            return response()->json(['message' => 'Не удалось авторизоваться через VK.'], 422);
        }

        $vkUserId = $exchange['response']['user_id'] ?? null;
        $accessToken = $exchange['response']['access_token'] ?? null;

        if (!$vkUserId || !$accessToken) {
            return response()->json(['message' => 'VK не вернул данные пользователя.'], 422);
        }

        // 2. Получаем профиль
        $profile = \Illuminate\Support\Facades\Http::get('https://api.vk.com/method/users.get', [
            'user_ids' => $vkUserId,
            'fields' => 'first_name,last_name,email',
            'access_token' => $accessToken,
            'v' => '5.199',
        ])->json();

        $userData = $profile['response'][0] ?? null;

        if (!$userData) {
            return response()->json(['message' => 'VK не вернул профиль пользователя.'], 422);
        }

        $fullName = trim(($userData['first_name'] ?? '') . ' ' . ($userData['last_name'] ?? '')) ?: 'vk-user';
        $email = $userData['email'] ?? null;

        // 3. Находим или создаём пользователя
        $socialUser = new \Laravel\Socialite\Two\User();
        $socialUser->id = $vkUserId;
        $socialUser->name = $fullName;
        $socialUser->email = $email;

        $user = $this->findOrCreateUser('vkontakte', $socialUser);

        // 4. Выдаём наш токен
        $token = $user->createToken('social-vkontakte')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user->only(['id', 'login', 'name', 'email']),
        ], 201);
    }
}
