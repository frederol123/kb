<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\YooKassaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(private YooKassaService $yooKassa)
    {
    }

    public function callback(Request $request): JsonResponse
    {
        $data = $request->all();

        if (! isset($data['event'], $data['object'])) {
            return response()->json(['message' => 'Invalid payload'], 400);
        }

        if ($data['event'] === 'payment.succeeded') {
            $this->yooKassa->handleSucceeded($data['object']);
        }

        return response()->json(['message' => 'OK']);
    }
}
