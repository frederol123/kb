<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AnketController;
use App\Http\Controllers\Api\QrController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:10,1')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/auth/change-password', [AuthController::class, 'changePassword']);
});

Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    Route::get('/ankets', [AnketController::class, 'index']);
    Route::post('/ankets', [AnketController::class, 'store']);
    Route::get('/ankets/{anket}', [AnketController::class, 'show'])->withoutMiddleware('auth:sanctum');
    Route::put('/ankets/{anket}', [AnketController::class, 'updateInfo']);
    Route::put('/ankets/{anket}/content', [AnketController::class, 'updateContent']);
    Route::delete('/ankets/{anket}', [AnketController::class, 'destroy']);
    Route::get('/ankets/{anket}/qr', [QrController::class, 'download']);
});

Route::post('/condolences', function (Request $request) {
    $request->validate([
        'anket_id' => ['required', 'integer', 'exists:ankets,id'],
        'author_name' => ['required', 'string', 'max:255'],
        'message' => ['required', 'string'],
    ]);

    $condolence = \App\Models\Condolence::create([
        'anket_id' => $request->anket_id,
        'author_name' => $request->author_name,
        'message' => $request->message,
        'user_id' => $request->user()?->id,
    ]);

    return response()->json($condolence, 201);
})->middleware('throttle:30,1');

Route::get('/m/news', function () {
    $news = \App\Models\Novost::whereNotNull('published_at')
        ->orderByDesc('published_at')
        ->paginate(10);

    return response()->json($news);
});

Route::post('/payments/callback', [App\Http\Controllers\Api\PaymentController::class, 'callback'])
    ->middleware('throttle:10,1');

Route::get('/m/{anket:slug}', [AnketController::class, 'public']);
