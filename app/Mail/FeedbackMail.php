<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class FeedbackMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $senderName;
    public string $senderPhone;

    public function __construct(string $name, string $phone)
    {
        $this->senderName = $name;
        $this->senderPhone = $phone;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Новая заявка с сайта',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.feedback',
        );
    }
}
