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
        if ($anket->user_id !== $request->user()?->id && $anket->status !== 'published') {
            abort(404);
        }

        $url = url("/m/{$anket->slug}");

        return $this->qrService->generateStream($url, $anket->slug);
    }
}
