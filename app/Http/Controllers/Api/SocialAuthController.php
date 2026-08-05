<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SocialAccount;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
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
}
