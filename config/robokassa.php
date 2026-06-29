<?php

return [
    'merchant_login' => env('ROBO_MERCHANT_LOGIN'),
    'password1'      => env('ROBO_PASSWORD1'),
    'password2'      => env('ROBO_PASSWORD2'),
    'test_mode'      => env('ROBO_TEST_MODE', true),
    'currency'       => 'RUB',
    'success_url'    => env('ROBO_SUCCESS_URL', env('APP_URL') . '/lk'),
    'fail_url'       => env('ROBO_FAIL_URL', env('APP_URL') . '/tariffs'),
];
