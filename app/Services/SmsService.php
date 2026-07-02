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
        $this->sign = config('services.sms_aero.sign', 'Kod Bessmertiya');
    }

    /**
     * Отправить SMS-сообщение
     */
    public function send(string $phone, string $text): bool
    {
        $phone = preg_replace('/[^0-9]/', '', $phone);

        $response = Http::withBasicAuth($this->email, $this->apiKey)
            ->asForm()
            ->post('https://api.smsaero.ru/v2/sms/send', [
                'number' => $phone,
                'text' => $text,
                'sign' => $this->sign,
            ]);

        if ($response->failed()) {
            Log::error('SMS Aero send failed', [
                'phone' => $phone,
                'response' => $response->body(),
            ]);
            return false;
        }

        $data = $response->json();
        return ($data['success'] ?? false) === true;
    }

    /**
     * Сгенерировать и отправить код подтверждения
     */
    public function sendVerificationCode(string $phone): string|false
    {
        $code = str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
        $text = "Код подтверждения: {$code}";

        $sent = $this->send($phone, $text);
        if (!$sent) {
            return false;
        }

        return $code;
    }

    /**
     * Отправить код подтверждения (режим разработки — выводим в лог)
     */
    public function sendVerificationCodeDebug(string $phone): string
    {
        $code = str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
        Log::info("SMS verification code for {$phone}: {$code}");
        return $code;
    }
}
