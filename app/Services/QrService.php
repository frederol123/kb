<?php

namespace App\Services;

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\SvgWriter;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\StreamedResponse;

class QrService
{
    public function generateStream(string $url, string $filename): StreamedResponse
    {
        $cacheKey = 'qr_' . md5($url);

        $svg = Cache::remember($cacheKey, now()->addDay(), function () use ($url) {
            return (new SvgWriter())->write(new QrCode($url))->getString();
        });

        return response()->streamDownload(function () use ($svg) {
            echo $svg;
        }, $filename . '.svg', ['Content-Type' => 'image/svg+xml']);
    }

    public function generate(string $url): string
    {
        return (new SvgWriter())->write(new QrCode($url))->getString();
    }
}
