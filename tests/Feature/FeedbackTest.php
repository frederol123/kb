<?php

namespace Tests\Feature;

use App\Mail\FeedbackMail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class FeedbackTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Фейк запроса к Yandex SmartCaptcha
        Http::fake([
            'https://smartcaptcha.yandexcloud.net/validate' => Http::response([
                'status' => 'ok',
            ]),
        ]);
    }

    public function test_feedback_sends_email(): void
    {
        Mail::fake();

        $response = $this->postJson('/api/feedback', [
            'name' => 'Иван Петров',
            'phone' => '+7 (921) 183-47-82',
            'captcha_token' => 'test-token',
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Заявка отправлена.']);

        Mail::assertSent(FeedbackMail::class, function (FeedbackMail $mail) {
            return $mail->hasTo('immortal-code@mail.ru')
                && $mail->senderName === 'Иван Петров'
                && $mail->senderPhone === '+7 (921) 183-47-82';
        });
    }

    public function test_feedback_requires_name(): void
    {
        $response = $this->postJson('/api/feedback', [
            'phone' => '+7 (921) 183-47-82',
            'captcha_token' => 'test-token',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_feedback_requires_phone(): void
    {
        $response = $this->postJson('/api/feedback', [
            'name' => 'Тест',
            'captcha_token' => 'test-token',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['phone']);
    }
}
