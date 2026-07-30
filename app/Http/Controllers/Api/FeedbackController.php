<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\FeedbackMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class FeedbackController extends Controller
{
    public function send(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'captcha_token' => ['required', 'string'],
        ]);

        // Проверяем Yandex SmartCaptcha
        $captchaResponse = Http::asForm()->post(
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

        Mail::to('immortal-code@mail.ru')->send(
            new FeedbackMail($validated['name'], $validated['phone'])
        );

        return response()->json(['message' => 'Заявка отправлена.']);
    }
}
