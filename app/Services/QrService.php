<?php

namespace App\Services;

use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Writer\PngWriter;
use Illuminate\Support\Facades\Cache;

class QrService
{
    public function generateStream(string $url, string $filename): \Illuminate\Http\Response
    {
        $cacheKey = 'qr_' . md5($url);

        $png = Cache::remember($cacheKey, now()->addDay(), function () use ($url) {
            $result = new Builder(
                writer: new PngWriter(),
                data: $url,
                encoding: new Encoding('UTF-8'),
                errorCorrectionLevel: ErrorCorrectionLevel::Medium,
                size: 600,
                margin: 20,
            );

            return $result->build()->getString();
        });

        return response($png, 200, [
            'Content-Type' => 'image/png',
            'Content-Disposition' => 'inline; filename="' . $filename . '.png"',
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }

    public function generate(string $url): string
    {
        $result = new Builder(
            writer: new PngWriter(),
            data: $url,
            encoding: new Encoding('UTF-8'),
            errorCorrectionLevel: ErrorCorrectionLevel::Medium,
            size: 600,
            margin: 20,
        );

        return $result->build()->getString();
    }
}
