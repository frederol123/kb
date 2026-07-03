<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SmsService
{
    private string $clientId;
    private string $clientSecret;
    private string $appName;
    private bool $testMode;
    private string $apiUrl;

    public function __construct()
    {
        $this->clientId = config('services.sms_aero.mobile_client_id');
        $this->clientSecret = config('services.sms_aero.mobile_client_secret');
        $this->appName = config('services.sms_aero.mobile_app_name', 'immortal-code');
        $this->testMode = config('services.sms_aero.mobile_test_mode', true);
        $this->apiUrl = config('services.sms_aero.mobile_api_url', 'https://midsdk.smsaero.ru');
    }

    /**
     * Генерирует JWT для аутентификации в SMS Aero MobileID API
     */
    private function generateJwt(): string
    {
        $now = time();
        $payload = [
            'sub' => $this->clientId,
            'iat' => $now,
            'exp' => $now + 300, // 5 минут
            'client_id' => $this->clientId,
            'app_name' => $this->appName,
        ];

        return JWT::encode($payload, $this->clientSecret, 'HS256');
    }

    /**
     * Инициализировать сессию MobileID
     */
    private function initSession(string $jwt): string|false
    {
        $response = Http::withToken($jwt)
            ->post($this->apiUrl . '/api/session/init', [
                'fingerprint_hash' => $this->generateFingerprint(),
            ]);

        $data = $response->json();

        Log::info('MobileID init session', [
            'status' => $response->status(),
            'response' => $data,
        ]);

        if (!$response->successful() || !isset($data['session_id'])) {
            Log::error('MobileID init session failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            return false;
        }

        return $data['session_id'];
    }

    /**
     * Отправить SMS с кодом подтверждения через MobileID
     */
    private function startSession(string $sessionId, string $jwt, string $phone): bool
    {
        $response = Http::withToken($jwt)
            ->post($this->apiUrl . '/api/session/' . $sessionId . '/start', [
                'phone' => $phone,
                'fingerprint_hash' => $this->generateFingerprint(),
            ]);

        $data = $response->json();

        Log::info('MobileID start session', [
            'phone' => $phone,
            'status' => $response->status(),
            'response' => $data,
        ]);

        if (!$response->successful()) {
            Log::error('MobileID start session failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            return false;
        }

        return true;
    }

    /**
     * Проверить код подтверждения через MobileID
     */
    public function verifyCode(string $sessionId, string $code): bool
    {
        $jwt = $this->generateJwt();

        $response = Http::withToken($jwt)
            ->post($this->apiUrl . '/api/session/' . $sessionId . '/otp', [
                'code' => $code,
                'fingerprint_hash' => $this->generateFingerprint(),
            ]);

        $data = $response->json();

        Log::info('MobileID verify OTP', [
            'session_id' => $sessionId,
            'status' => $response->status(),
            'response' => $data,
        ]);

        if (!$response->successful()) {
            Log::error('MobileID verify failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            return false;
        }

        return ($data['status'] ?? '') === 'verified';
    }

    /**
     * Сгенерировать и отправить код подтверждения на телефон
     * Возвращает session_id для последующей верификации
     */
    public function sendVerificationCode(string $phone): string|false
    {
        $phone = $this->normalizePhone($phone);

        if ($this->testMode) {
            // В тестовом режиме — генерируем фейковую сессию
            $code = str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
            Log::info("MobileID TEST MODE: verification code for {$phone}: {$code}");
            return 'test_session_' . md5($phone . $code . time());
        }

        $jwt = $this->generateJwt();

        // Инициализируем сессию
        $sessionId = $this->initSession($jwt);
        if (!$sessionId) {
            // Fallback: в тестовом/отладочном режиме
            $code = str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
            Log::info("MobileID INIT FAILED, fallback code for {$phone}: {$code}");
            return 'debug_session_' . md5($phone . $code . time());
        }

        // Отправляем SMS
        $started = $this->startSession($sessionId, $jwt, $phone);
        if (!$started) {
            Log::error('MobileID start failed after init', ['session_id' => $sessionId]);
            return false;
        }

        return $sessionId;
    }

    /**
     * Сгенерировать UUID-подобный fingerprint (для совместимости с API)
     */
    private function generateFingerprint(): string
    {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            random_int(0, 0xffff), random_int(0, 0xffff),
            random_int(0, 0xffff),
            random_int(0, 0x0fff) | 0x4000,
            random_int(0, 0x3fff) | 0x8000,
            random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff)
        );
    }

    /**
     * Нормализовать номер телефона
     */
    private function normalizePhone(string $phone): string
    {
        $digits = preg_replace('/[^0-9]/', '', $phone);
        if (strlen($digits) === 11 && $digits[0] === '8') {
            $digits = '7' . substr($digits, 1);
        }
        if (strlen($digits) === 10) {
            $digits = '7' . $digits;
        }
        return '+' . $digits;
    }
}
