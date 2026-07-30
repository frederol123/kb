<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Код бессмертия') }} — цифровой мемориал и QR-код на памятник</title>
    <meta name="description" content="Код Бессмертия — создайте вечную память о близких с помощью цифрового мемориала. QR-код на памятнике, фотографии, история жизни, видео, книга соболезнований. Современный способ сохранить память навсегда.">
    <meta name="keywords" content="цифровой мемориал, QR код на памятник, память о близких, онлайн мемориал, история жизни, фотографии умерших, хронология жизни, код памяти, сохранить память, мемориальная страница">
    <meta property="og:title" content="{{ config('app.name', 'Код бессмертия') }} — цифровой мемориал и QR-код на памятник">
    <meta property="og:description" content="Создайте вечную память о близких с помощью цифрового мемориала. QR-код на памятнике, фотографии, история жизни и хронология важных событий.">
    <meta property="og:type" content="website">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
    <link rel="shortcut icon" href="/favicon.ico">
    <meta name="msapplication-TileColor" content="#2d89ef">
    <meta name="msapplication-config" content="/browserconfig.xml">
    <meta name="theme-color" content="#3476F5">
    <meta name="mailru-domain" content="sginZDRvEdC485vz" />
    <meta name="yandex-verification" content="a522f66ffba243c9" />

    <link rel="canonical" href="{{ url()->current() }}">

    <script type="application/ld+json">
    <?php echo json_encode([
        '@context' => 'https://schema.org',
        '@graph' => [
            [
                '@type' => 'Organization',
                '@id' => 'https://immortal-code.ru/#organization',
                'name' => 'Код бессмертия',
                'url' => 'https://immortal-code.ru',
                'logo' => [
                    '@type' => 'ImageObject',
                    'url' => 'https://immortal-code.ru/images/logo.svg',
                ],
                'description' => 'Цифровой мемориал и QR-код на памятник. Сохраните историю жизни близких навсегда.',
                'foundingDate' => '2025',
                'contactPoint' => [
                    '@type' => 'ContactPoint',
                    'telephone' => '+7-951-313-21-82',
                    'contactType' => 'customer service',
                    'availableLanguage' => ['Russian'],
                ],
            ],
            [
                '@type' => 'WebSite',
                '@id' => 'https://immortal-code.ru/#website',
                'url' => 'https://immortal-code.ru',
                'name' => 'Код бессмертия',
                'description' => 'Создайте вечную память о близких с помощью цифрового мемориала. QR-код на памятнике, фотографии, история жизни, видео, книга соболезнований.',
                'inLanguage' => 'ru',
                'publisher' => [
                    '@id' => 'https://immortal-code.ru/#organization',
                ],
            ],
        ],
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); ?>
    </script>

    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    <script src="https://smartcaptcha.yandexcloud.net/captcha.js" defer></script>
</head>
<body>
    <div id="app"></div>
</body>
</html>
