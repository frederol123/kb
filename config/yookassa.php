<?php

return [

    'shop_id' => env('YK_SHOP_ID'),
    'api_key' => env('YK_API_KEY'),
    'test_mode' => env('YK_TEST_MODE', true),

    'redirect_url' => env('YK_REDIRECT_URL', env('APP_URL')),
    'currency' => 'RUB',

];
