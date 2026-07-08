<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\VerifyEmailNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'login' => ['required_without:email', 'string'],
            'email' => ['required_without:login', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = null;
        $field = '';

        if ($request->login) {
            $user = User::where('login', $request->login)->first();
            $field = 'login';
        } elseif ($request->email) {
            $user = User::where('email', $request->email)->first();
            $field = 'email';
        }

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                $field => ['Неверный логин/email или пароль.'],
            ]);
        }

        if (Hash::needsRehash($user->password)) {
            $user->password = Hash::make($request->password);
            $user->save();
        }

        $user->tokens()->delete();

        return response()->json([
            'token' => $user->createToken('api')->plainTextToken,
            'user' => $user->only(['id', 'login', 'name', 'email']),
        ]);
    }

    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'login' => ['required', 'string', 'max:255', 'unique:users,login'],
            'name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', PasswordRule::defaults(), 'confirmed'],
            'captcha_token' => ['required', 'string'],
        ]);

        // Проверяем Yandex SmartCaptcha
        $captchaResponse = \Illuminate\Support\Facades\Http::asForm()->post(
            'https://smartcaptcha.yandexcloud.net/validate',
            [
                'secret' => config('services.yandex_captcha.server_key'),
                'token' => $request->captcha_token,
            ]
        );

        $captchaResult = $captchaResponse->json();
        if (($captchaResult['status'] ?? '') !== 'ok') {
            throw ValidationException::withMessages([
                'captcha_token' => ['Неверная капча. Попробуйте ещё раз.'],
            ]);
        }

        $user = User::create([
            'name' => $request->name ?: $request->login,
            'email' => $request->email,
            'password' => $request->password,
            'login' => $request->login,
        ]);

        // Отправляем письмо с подтверждением email
        $user->notify(new VerifyEmailNotification());

        return response()->json([
            'token' => $user->createToken('api')->plainTextToken,
            'user' => $user->only(['id', 'login', 'name', 'email']),
        ], 201);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => ['required', 'email']]);

        Password::sendResetLink($request->only('email'));

        return response()->json(['message' => 'Ссылка для восстановления отправлена на email.']);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', PasswordRule::defaults(), 'confirmed'],
        ]);

        $user = $request->user();

        if (! Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Текущий пароль неверен.'],
            ]);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        $user->tokens()->delete();

        return response()->json([
            'token' => $user->createToken('api')->plainTextToken,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $token = $request->user()->currentAccessToken();

        if ($token) {
            $token->delete();
        }

        return response()->json(['message' => 'Выход выполнен.']);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('tariff');
        return response()->json($user->only(['id', 'login', 'name', 'email', 'email_verified_at', 'max_gallery_images', 'max_videos', 'tariff_id']) + [
            'tariff' => $user->tariff ? $user->tariff->only(['id', 'title', 'slug', 'price', 'limits']) : null,
            'roles' => $user->getRoleNames(),
        ]);
    }

    public function changeName(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $user = $request->user();

        if ($user->name_changed_at && $user->name_changed_at->gt(now()->subHour())) {
            $remaining = (int) ceil($user->name_changed_at->copy()->addHour()->diffInSeconds(now()) / 60);
            return response()->json([
                'message' => "Имя можно сменить через {$remaining} мин.",
            ], 429);
        }

        $user->name = $request->name;
        $user->name_changed_at = now();
        $user->save();

        return response()->json([
            'message' => 'Имя успешно изменено.',
            'user' => $user->only(['id', 'login', 'name', 'email']),
        ]);
    }
}
