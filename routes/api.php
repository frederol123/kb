<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PhoneVerificationController;
use App\Http\Controllers\Api\AnketController;
use App\Http\Controllers\Api\QrController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

Route::middleware('throttle:10,1')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/auth/change-password', [AuthController::class, 'changePassword']);

    // Регистрация по телефону
    Route::post('/auth/send-code', [PhoneVerificationController::class, 'sendCode']);
    Route::post('/auth/verify-phone', [PhoneVerificationController::class, 'verifyAndRegister']);
});

Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/change-name', [AuthController::class, 'changeName']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Robokassa — создание платежа
    Route::post('/robokassa/pay', [App\Http\Controllers\Api\RobokassaController::class, 'pay']);

    Route::get('/drevs', function (Request $request) {
        return $request->user()->drevs()->latest()->get();
    });

    Route::post('/drevs', function (Request $request) {
        $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'data' => ['nullable', 'array'],
        ]);

        return $request->user()->drevs()->create($request->only(['title', 'description', 'data']));
    });

    Route::get('/drevs/{drev}', function (\App\Models\Drev $drev, Request $request) {
        if ($drev->user_id !== $request->user()->id) abort(403);
        return $drev;
    });

    Route::put('/drevs/{drev}', function (\App\Models\Drev $drev, Request $request) {
        if ($drev->user_id !== $request->user()->id) abort(403);

        $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'data' => ['nullable', 'array'],
        ]);

        $drev->update($request->only(['title', 'description', 'data']));
        return $drev;
    });

    Route::delete('/drevs/{drev}', function (\App\Models\Drev $drev, Request $request) {
        if ($drev->user_id !== $request->user()->id) abort(403);
        $drev->delete();
        return response()->noContent();
    });

    Route::get('/transactions', function (Request $request) {
        return $request->user()->transactions()->latest()->get();
    });

    Route::prefix('ankets')->group(function () {
        Route::get('/', [AnketController::class, 'index']);
        Route::post('/', [AnketController::class, 'store']);
        Route::get('/{anket}', [AnketController::class, 'show'])->withoutMiddleware('auth:sanctum');
        Route::put('/{anket}', [AnketController::class, 'updateInfo']);
        Route::put('/{anket}/content', [AnketController::class, 'updateContent']);
        Route::delete('/{anket}', [AnketController::class, 'destroy']);
        Route::get('/{anket}/qr', [QrController::class, 'download'])->withoutMiddleware('auth:sanctum');
        Route::post('/{anket}/upload', function (Request $request, \App\Models\Anket $anket) {
            if ($anket->user_id !== $request->user()->id) abort(403);

            $request->validate([
                'file' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp,ico', 'max:65536'],
            ]);

            $type = $request->input('type', ''); // 'relative' — для фото родственников
            $file = $request->file('file');

            if ($type === 'relative') {
                // Фото родственника — клиент уже отдаёт готовый квадратный кроп (800×800)
                // Сохраняем без серверной обработки, чтобы не исказить пропорции
                $originalName = $file->getClientOriginalName();
                $hash = substr(md5(uniqid($originalName, true)), 0, 8);
                $filename = time() . '_' . $hash . '_' . Str::slug(pathinfo($originalName, PATHINFO_FILENAME)) . '.jpg';
                $path = Storage::disk('s3')->putFileAs('uploads/relatives', $file, $filename);
                return response()->json(['url' => Storage::disk('s3')->url($path)], 201);
            }

            // Обработка: cover(1540, 963) → webp без искажений
            $imageService = app(\App\Services\ImageService::class);
            $processedPath = $imageService->process($request->file('file'));

            $originalName = $request->file('file')->getClientOriginalName();
            $hash = substr(md5(uniqid($originalName, true)), 0, 8);
            $filename = time() . '_' . $hash . '_' . Str::slug(pathinfo($originalName, PATHINFO_FILENAME)) . '.webp';

            $path = Storage::disk('s3')->putFileAs('uploads', new \Illuminate\Http\File($processedPath), $filename);

            // Удаляем временный файл
            @unlink($processedPath);

            return response()->json(['url' => Storage::disk('s3')->url($path)], 201);
        });

        Route::post('/{anket}/upload-video', function (Request $request, \App\Models\Anket $anket) {
            if ($anket->user_id !== $request->user()->id) abort(403);

            $videos = $anket->content['videos'] ?? [];
            if (count($videos) >= $request->user()->max_videos) {
                abort(422, 'Достигнут лимит видео');
            }

            $request->validate([
                'file' => ['required', 'file', 'mimes:mp4,webm,mov,avi,mkv,ogv,ogg,mpeg,3gp,wmv,flv', 'max:204800'],
            ]);

            $originalName = $request->file('file')->getClientOriginalName();
            $hash = substr(md5(uniqid($originalName, true)), 0, 8);
            $path = $request->file('file')->storeAs('uploads', time() . '_' . $hash . '_' . Str::slug(pathinfo($originalName, PATHINFO_FILENAME)) . '.' . $request->file('file')->getClientOriginalExtension(), 's3');

            return response()->json([
                'url' => Storage::disk('s3')->url($path),
                'original_name' => $request->file('file')->getClientOriginalName(),
                'mime_type' => $request->file('file')->getMimeType(),
            ], 201);
        });
    });
});

Route::post('/condolences', function (Request $request) {
    $request->validate([
        'anket_id' => ['required', 'integer', 'exists:ankets,id'],
        'message' => ['required', 'string'],
    ]);

    // Проверка на дубликат — один пользователь не может оставить больше
    // одного соболезнования на одной странице
    $exists = \App\Models\Condolence::where('anket_id', $request->anket_id)
        ->where('user_id', $request->user()->id)
        ->exists();

    if ($exists) {
        return response()->json([
            'message' => 'Вы уже оставили соболезнование на этой странице',
        ], 422);
    }

    $condolence = \App\Models\Condolence::create([
        'anket_id' => $request->anket_id,
        'author_name' => $request->user()->name,
        'message' => $request->message,
        'user_id' => $request->user()->id,
    ]);

    return response()->json($condolence, 201);
})->middleware(['auth:sanctum', 'throttle:30,1']);

Route::get('/m/news', function () {
    $news = \App\Models\News::whereNotNull('published_at')
        ->orderByDesc('published_at')
        ->paginate(10);

    return response()->json($news);
});

Route::post('/payments/callback', [App\Http\Controllers\Api\PaymentController::class, 'callback'])
    ->middleware('throttle:10,1');

Route::get('/m/{anket:slug}', [AnketController::class, 'public']);

Route::get('/tariffs', function () {
    return \App\Models\Tariff::where('is_active', true)->orderBy('price')->get();
});

// Robokassa — вебхуки и редиректы (без auth, только подпись)
Route::post('/robokassa/result', [App\Http\Controllers\Api\RobokassaController::class, 'result'])
    ->name('robokassa.result');
Route::get('/robokassa/success', [App\Http\Controllers\Api\RobokassaController::class, 'success'])
    ->name('robokassa.success');
Route::get('/robokassa/fail', [App\Http\Controllers\Api\RobokassaController::class, 'fail'])
    ->name('robokassa.fail');
