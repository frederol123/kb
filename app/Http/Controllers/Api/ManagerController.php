<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Anket;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

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

    public function users(Request $request): JsonResponse
    {
        $users = User::with(['tariff:id,title', 'roles'])
            ->withCount('ankets')
            ->orderByDesc('id')
            ->paginate(50);

        return response()->json($users);
    }

    public function updateUser(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'login' => ['sometimes', 'string', 'max:255', Rule::unique('users')->ignore($user->id)],
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'nullable', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => ['sometimes', 'nullable', 'string', 'max:20'],
            'tariff_id' => ['sometimes', 'nullable', 'integer', 'exists:tariffs,id'],
        ]);

        $user->update($data);

        return response()->json($user->load('tariff:id,title'));
    }

    public function deleteUser(Request $request, User $user): JsonResponse
    {
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Нельзя удалить самого себя'], 422);
        }

        $user->delete();

        return response()->noContent();
    }

    public function loginAsUser(Request $request, User $user): JsonResponse
    {
        Log::info('Manager login-as', [
            'manager_id' => $request->user()->id,
            'manager_name' => $request->user()->name,
            'target_user_id' => $user->id,
            'target_user_login' => $user->login,
        ]);

        $token = $user->createToken('manager-login-as', ['*'], Carbon::now()->addHour())->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user->load('tariff:id,title'),
        ]);
    }
}
