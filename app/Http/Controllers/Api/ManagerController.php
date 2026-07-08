<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Anket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ManagerController extends Controller
{
    public function ankets(Request $request): JsonResponse
    {
        $ankets = Anket::with(['user:id,login,name,phone,tariff_id', 'user.tariff:id,title'])
            ->orderByDesc('created_at')
            ->paginate(50);

        return response()->json($ankets);
    }

    public function toggleCheck(Request $request, Anket $anket): JsonResponse
    {
        $anket->update([
            'manager_checked' => $request->boolean('checked', !$anket->manager_checked),
        ]);

        return response()->json([
            'manager_checked' => $anket->fresh()->manager_checked,
        ]);
    }
}
