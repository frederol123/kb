<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;

class VerifyEmailNotification extends Notification
{
    use Queueable;

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $verificationUrl = URL::temporarySignedRoute(
            'auth.verify-email',
            Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
            ['id' => $notifiable->getKey(), 'hash' => sha1($notifiable->getEmailForVerification())]
        );

        return (new MailMessage)
            ->subject('Подтверждение регистрации — Код Бессмертия')
            ->greeting('Здравствуйте, ' . ($notifiable->login ?? $notifiable->name) . '!')
            ->line('Вы зарегистрировались на сайте «Код Бессмертия».')
            ->line('Для завершения регистрации, пожалуйста, подтвердите ваш email адрес, нажав на кнопку ниже:')
            ->action('Подтвердить Email', $verificationUrl)
            ->line('Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.')
            ->salutation('С уважением, команда «Код Бессмертия»');
    }
}
