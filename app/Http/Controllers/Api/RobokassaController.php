<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Services\RobokassaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RobokassaController extends Controller
{
    public function __construct(private RobokassaService $robokassa)
    {
    }

    /**
     * Создать платёж и вернуть ссылку на Robokassa.
     */
    public function pay(Request $request): JsonResponse
    {
        $request->validate([
            'tariff_id' => ['required', 'integer', 'exists:tariffs,id'],
            'discounted_amount' => ['nullable', 'numeric', 'min:0'],
        ]);

        $user = $request->user();
        $tariffId = $request->input('tariff_id');
        $discountedAmount = $request->input('discounted_amount');

        // Проверка апгрейда — нельзя купить тариф младше или равный текущему
        $tariff = \App\Models\Tariff::find($tariffId);
        if (!$tariff) {
            return response()->json(['message' => 'Тариф не найден'], 404);
        }
        if ($user->tariff && (float) $user->tariff->price >= (float) $tariff->price) {
            return response()->json([
                'message' => 'Этот тариф недоступен для покупки. Вы уже используете тариф такого же или более высокого уровня.',
            ], 422);
        }

        if ($discountedAmount !== null) {
            $discountedAmount = (float) $discountedAmount;
        }

        $result = $this->robokassa->createPayment(
            userId: $user->id,
            tariffId: $tariffId,
            successUrl: route('robokassa.success'),
            failUrl: route('robokassa.fail'),
            discountedAmount: $discountedAmount,
        );

        if (isset($result['error'])) {
            return response()->json(['message' => $result['error']], 500);
        }

        return response()->json($result);
    }

    /**
     * Result URL — вебхук от Robokassa (HTTP POST).
     * Проверяет подпись и обновляет статус транзакции + назначает тариф.
     */
    public function result(Request $request): string
    {
        $outSum = $request->input('OutSum');
        $invId = (int) $request->input('InvId');
        $signature = $request->input('SignatureValue');

        if (! $this->robokassa->validateResult($outSum, $invId, $signature)) {
            Log::warning('Robokassa: invalid signature', $request->all());
            return 'BAD_SIGNATURE';
        }

        $transaction = Transaction::find($invId);

        if (! $transaction) {
            Log::warning('Robokassa: transaction not found', ['inv_id' => $invId]);
            return 'NOT_FOUND';
        }

        if ($transaction->status === 'succeeded') {
            return 'OK'; // Уже обработан
        }

        $transaction->update(['status' => 'succeeded']);

        // Назначаем тариф пользователю
        $tariffId = $transaction->purchasable_id;
        $transaction->user->update(['tariff_id' => $tariffId]);

        Log::info('Robokassa: payment succeeded', [
            'transaction_id' => $transaction->id,
            'user_id' => $transaction->user_id,
            'tariff_id' => $tariffId,
        ]);

        return 'OK' . $invId;
    }

    /**
     * Success URL — редирект после успешной оплаты.
     */
    public function success(Request $request)
    {
        return redirect(config('robokassa.success_url'))
            ->with('success', 'Оплата прошла успешно! Тариф активирован.');
    }

    /**
     * Fail URL — редирект при ошибке оплаты.
     */
    public function fail(Request $request)
    {
        return redirect(config('robokassa.fail_url'))
            ->with('error', 'Оплата не прошла. Попробуйте снова.');
    }
}
