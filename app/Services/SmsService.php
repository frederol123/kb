<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SmsService
{
    private string $email;
    private string $apiKey;
    private string $sign;

    public function __construct()
    {
        $this->email = config('services.sms_aero.email');
        $this->apiKey = config('services.sms_aero.api_key');
        $this->sign = 'SMS Aero'; // Стандартная подпись SMS Aero
    }

    /**
     * Отправить SMS-сообщение
     */
    public function send(string $phone, string $text): bool
    {
        $phone = preg_replace('/[^0-9]/', '', $phone);

        $response = Http::withBasicAuth($this->email, $this->apiKey)
            ->asForm()
            ->post('https://gate.smsaero.ru/v2/sms/send', [
                'number' => $phone,
                'text' => $text,
                'sign' => $this->sign,
            ]);

        $data = $response->json();

        Log::info('SMS Aero response', [
            'phone' => $phone,
            'text' => $text,
            'status' => $response->status(),
            'body' => $data,
        ]);

        if ($response->failed()) {
            Log::error('SMS Aero send failed', [
                'phone' => $phone,
                'response' => $response->body(),
            ]);
            return false;
        }

        if (!($data['success'] ?? false)) {
            Log::error('SMS Aero success false', [
                'phone' => $phone,
                'data' => $data,
            ]);
            return false;
        }

        return true;
    }

    /**
     * Сгенерировать и отправить код подтверждения
     */
    public function sendVerificationCode(string $phone): string|false
    {
        $phone = $this->normalizePhone($phone);
        $code = str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
        $text = "Код подтверждения: {$code}";

        $sent = $this->send($phone, $text);
        if (!$sent) {
            return false;
        }

        return $code;
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
        return $digits;
    }
}
