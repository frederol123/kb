<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'sms_aero' => [
        'email' => env('SMS_AERO_EMAIL'),
        'api_key' => env('SMS_AERO_API_KEY'),
        'sign' => env('SMS_AERO_SIGN', 'KodBessmert'),
        'debug' => env('SMS_DEBUG', true),

        // Mobile Auth (MobileID)
        'mobile_client_id' => env('SMS_AERO_MOBILE_CLIENT_ID'),
        'mobile_client_secret' => env('SMS_AERO_MOBILE_CLIENT_SECRET'),
        'mobile_app_name' => env('SMS_AERO_MOBILE_APP_NAME', 'immortal-code'),
        'mobile_test_mode' => env('SMS_AERO_MOBILE_TEST_MODE', true),
        'mobile_api_url' => 'https://midsdk.smsaero.ru',
    ],


    'yandex_captcha' => [
        'site_key' => env('YANDEX_CAPTCHA_SITE_KEY'),
        'server_key' => env('YANDEX_CAPTCHA_SERVER_KEY'),
    ],
];
