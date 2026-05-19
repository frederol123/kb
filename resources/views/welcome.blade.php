<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Код бессмертия') }}</title>
    <meta name="description" content="Цифровой мемориал для сохранения памяти о близких. QR-код на памятнике.">
    <meta property="og:title" content="{{ config('app.name', 'Код бессмертия') }}">
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

    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body>
    <div id="app"></div>
</body>
</html>
