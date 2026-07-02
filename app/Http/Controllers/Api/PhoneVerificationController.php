<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\SmsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;

class PhoneVerificationController extends Controller
{
    public function __construct(
        private SmsService $smsService
    ) {}

    /**
     * Отправить SMS с кодом подтверждения
     */
    public function sendCode(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => ['required', 'string', 'regex:/^(\+7|8)[0-9]{10}$/'],
        ]);

        $phone = $this->normalizePhone($request->phone);

        // Проверяем, не занят ли номер
        if (User::where('phone', $phone)->exists()) {
            throw ValidationException::withMessages([
                'phone' => ['Этот номер телефона уже зарегистрирован.'],
            ]);
        }

        // Удаляем старые коды для этого номера
        \App\Models\PhoneVerification::where('phone', $phone)->delete();

        // Генерируем и отправляем код
        $code = $this->smsService->sendVerificationCode($phone);

        if ($code === false) {
            // В режиме отладки — выводим в лог
            $code = $this->smsService->sendVerificationCodeDebug($phone);
        }

        // Сохраняем код в БД
        \App\Models\PhoneVerification::create([
            'phone' => $phone,
            'code' => $code,
            'expires_at' => now()->addMinutes(5),
        ]);

        return response()->json([
            'message' => 'Код подтверждения отправлен на указанный номер.',
        ]);
    }

    /**
     * Подтвердить код и зарегистрировать пользователя
     */
    public function verifyAndRegister(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => ['required', 'string', 'regex:/^(\+7|8)[0-9]{10}$/'],
            'code' => ['required', 'string', 'size:4'],
            'name' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', PasswordRule::defaults()],
        ]);

        $phone = $this->normalizePhone($request->phone);

        // Проверяем код
        $verification = \App\Models\PhoneVerification::where('phone', $phone)
            ->where('code', $request->code)
            ->whereNull('verified_at')
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        if (!$verification) {
            throw ValidationException::withMessages([
                'code' => ['Неверный или просроченный код подтверждения.'],
            ]);
        }

        // Проверяем, не занят ли номер
        if (User::where('phone', $phone)->exists()) {
            throw ValidationException::withMessages([
                'phone' => ['Этот номер телефона уже зарегистрирован.'],
            ]);
        }

        // Помечаем код как использованный
        $verification->update(['verified_at' => now()]);

        // Создаём пользователя
        $user = User::create([
            'name' => $request->name,
            'email' => null,
            'phone' => $phone,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'token' => $user->createToken('api')->plainTextToken,
            'user' => $user->only(['id', 'name', 'phone']),
        ], 201);
    }

    private function normalizePhone(string $phone): string
    {
        // 8 (999) 999-99-99 → +79999999999
        $digits = preg_replace('/[^0-9]/', '', $phone);
        if (strlen($digits) === 11 && $digits[0] === '8') {
            $digits = '7' . substr($digits, 1);
        }
        return '+' . $digits;
    }
}
