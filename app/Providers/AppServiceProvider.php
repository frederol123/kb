<?php

namespace App\Providers;

use App\Services\PhpassPasswordHasher;
use Illuminate\Hashing\BcryptHasher;
use Illuminate\Support\Facades\Hash;
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
    }
}
