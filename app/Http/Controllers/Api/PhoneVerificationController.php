<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\PhoneVerification;
use App\Services\SmsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            'phone' => ['required', 'string'],
        ]);

        $phone = $this->normalizePhone($request->phone);

        // Проверяем формат после нормализации
        if (!preg_match('/^\+\d{9,15}$/', $phone)) {
            throw ValidationException::withMessages([
                'phone' => ['Неверный формат номера телефона.'],
            ]);
        }

        // Проверяем, не занят ли номер
        if (User::where('phone', $phone)->exists()) {
            throw ValidationException::withMessages([
                'phone' => ['Этот номер телефона уже зарегистрирован.'],
            ]);
        }

        // Удаляем старые коды для этого номера
        PhoneVerification::where('phone', $phone)->delete();

        // Генерируем и отправляем код
        $code = $this->smsService->sendVerificationCode($phone);

        if ($code === false) {
            return response()->json([
                'message' => 'Ошибка отправки кода. Попробуйте позже.',
            ], 500);
        }

        // Сохраняем код в БД
        PhoneVerification::create([
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
            'phone' => ['required', 'string'],
            'code' => ['required', 'string', 'size:4'],
            'login' => ['required', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', PasswordRule::defaults()],
        ]);

        $phone = $this->normalizePhone($request->phone);

        if (!preg_match('/^\+\d{9,15}$/', $phone)) {
            throw ValidationException::withMessages([
                'phone' => ['Неверный формат номера телефона.'],
            ]);
        }

        // Находим код по номеру телефона
        $verification = PhoneVerification::where('phone', $phone)
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

        // В транзакции: помечаем код + создаём пользователя
        try {
            $user = DB::transaction(function () use ($verification, $request, $phone) {
                // Проверяем уникальность логина
                if (User::where('login', $request->login)->exists()) {
                    throw ValidationException::withMessages([
                        'login' => ['Этот логин уже используется.'],
                    ]);
                }

                // Помечаем код как использованный
                $verification->update(['verified_at' => now()]);

                // Создаём пользователя
                return User::create([
                    'login' => $request->login,
                    'name' => $request->name,
                    'email' => null,
                    'phone' => $phone,
                    'password' => Hash::make($request->password),
                ]);
            });
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            Log::error('User registration failed', [
                'phone' => $phone,
                'error' => $e->getMessage(),
            ]);
            throw ValidationException::withMessages([
                'phone' => ['Ошибка регистрации. Попробуйте позже.'],
            ]);
        }

        return response()->json([
            'token' => $user->createToken('api')->plainTextToken,
            'user' => $user->only(['id', 'login', 'name', 'phone']),
        ], 201);
    }

    private function normalizePhone(string $phone): string
    {
        $digits = preg_replace('/[^0-9]/', '', $phone);
        if (strlen($digits) === 11 && $digits[0] === '8') {
            $digits = '7' . substr($digits, 1);
        }
        return '+' . $digits;
    }
}
