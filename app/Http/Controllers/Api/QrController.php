<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Anket;
use App\Services\QrService;
use Illuminate\Http\Request;

class QrController extends Controller
{
    public function __construct(private QrService $qrService)
    {
    }

    public function download(Request $request, Anket $anket): \Illuminate\Http\Response|\Illuminate\Http\JsonResponse
    {
        $user = auth('sanctum')->user();

        // Published: QR доступен всем (без авторизации)
        if ($anket->status !== 'published') {
            // Private/Draft: только владелец
            if (! $user || $anket->user_id !== $user->id) {
                abort(404);
            }
        }

        // Проверка лимита QR-кодов — только для владельца анкеты
        if ($user && $anket->user_id === $user->id) {
            $user->load('tariff');
            $maxQr = $user->tariff?->limits['max_qr_codes'] ?? 1;
            $anketCount = $user->ankets()->count();
            if ($anketCount > $maxQr) {
                abort(403, "Достигнут лимит генерации QR-кодов ({$maxQr}) по вашему тарифу.");
            }
        }

        $url = url("/m/{$anket->slug}");

        return $this->qrService->generateStream($url, $anket->slug);
    }
}
