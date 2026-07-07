<?php

namespace App\Providers;

use App\Mail\UnisenderTransport;
use App\Services\PhpassPasswordHasher;
use Illuminate\Hashing\BcryptHasher;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Hash::extend('bcrypt_phpass', function () {
            return new PhpassPasswordHasher(new BcryptHasher([
                'rounds' => config('hashing.bcrypt.rounds', 12),
            ]));
        });

        if (class_exists(\Laravel\Horizon\Horizon::class)) {
            \Laravel\Horizon\Horizon::auth(function ($request) {
                return app()->environment('local')
                    || $request->user()?->email === 'admin@example.com';
            });
        }

        Mail::extend("unisender", function (array $config) {
            return new UnisenderTransport(
                apiKey: $config["key"] ?? "",
                senderEmail: $config["sender_email"] ?? null,
                senderName: $config["sender_name"] ?? null,
            );
        });

    }
}
