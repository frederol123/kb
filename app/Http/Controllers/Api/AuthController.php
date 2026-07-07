<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
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
            'email' => ['required_without:phone', 'email'],
            'phone' => ['required_without:email', 'string'],
            'password' => ['required', 'string'],
        ]);

        $user = null;
        if ($request->email) {
            $user = User::where('email', $request->email)->first();
        } elseif ($request->phone) {
            $phone = preg_replace('/[^0-9]/', '', $request->phone);
            if (strlen($phone) === 11 && $phone[0] === '8') {
                $phone = '7' . substr($phone, 1);
            }
            $phone = '+' . $phone;
            $user = User::where('phone', $phone)->first();
        }

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Неверный email/телефон или пароль.'],
            ]);
        }

        if (Hash::needsRehash($user->password)) {
            $user->password = Hash::make($request->password);
            $user->save();
        }

        $user->tokens()->delete();

        return response()->json([
            'token' => $user->createToken('api')->plainTextToken,
            'user' => $user->only(['id', 'name', 'email']),
        ]);
    }

    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'unique:users'],
            'phone' => ['nullable', 'string', 'unique:users'],
            'password' => ['required', 'string', PasswordRule::defaults()],
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
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'login' => $request->input('login') ?: explode('@', $request->email)[0],
            'password' => $request->password,
        ]);

        return response()->json([
            'token' => $user->createToken('api')->plainTextToken,
            'user' => $user->only(['id', 'name', 'email']),
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
        return response()->json($user->only(['id', 'name', 'email', 'max_gallery_images', 'max_videos', 'tariff_id']) + [
            'tariff' => $user->tariff ? $user->tariff->only(['id', 'title', 'slug', 'price', 'limits']) : null,
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
            'user' => $user->only(['id', 'name', 'email']),
        ]);
    }
}
