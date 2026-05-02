<?php

namespace App\Services;

use App\Models\Transaction;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class YooKassaService
{
    private string $shopId;
    private string $apiKey;
    private string $baseUrl;

    public function __construct()
    {
        $this->shopId = config('yookassa.shop_id');
        $this->apiKey = config('yookassa.api_key');
        $this->baseUrl = 'https://api.yookassa.ru/v3';
    }

    public function createPayment(array $data): array
    {
        $payment = Transaction::create([
            'user_id' => $data['user_id'],
            'purchasable_type' => $data['purchasable_type'],
            'purchasable_id' => $data['purchasable_id'],
            'amount' => $data['amount'],
            'currency' => $data['currency'] ?? 'RUB',
            'status' => 'pending',
        ]);

        $response = Http::withBasicAuth($this->shopId, $this->apiKey)
            ->post($this->baseUrl . '/payments', [
                'amount' => [
                    'value' => number_format($data['amount'], 2, '.', ''),
                    'currency' => $data['currency'] ?? 'RUB',
                ],
                'capture' => true,
                'confirmation' => [
                    'type' => 'redirect',
                    'return_url' => $data['return_url'] ?? config('app.url'),
                ],
                'description' => $data['description'] ?? '',
                'metadata' => [
                    'transaction_id' => $payment->id,
                ],
            ]);

        if ($response->successful()) {
            $body = $response->json();
            $payment->update(['yookassa_id' => $body['id']]);

            return [
                'payment_id' => $payment->id,
                'confirmation_url' => $body['confirmation']['confirmation_url'],
            ];
        }

        Log::error('YooKassa payment creation failed', $response->json());
        $payment->update(['status' => 'failed']);

        return ['error' => 'Payment creation failed'];
    }

    public function handleSucceeded(array $paymentData): void
    {
        $transactionId = $paymentData['metadata']['transaction_id'] ?? null;

        if ($transactionId) {
            Transaction::where('id', $transactionId)
                ->where('status', 'pending')
                ->update([
                    'status' => 'succeeded',
                    'yookassa_id' => $paymentData['id'],
                    'metadata' => $paymentData,
                ]);
        }
    }

    public function checkStatus(string $paymentId): array
    {
        $response = Http::withBasicAuth($this->shopId, $this->apiKey)
            ->get($this->baseUrl . '/payments/' . $paymentId);

        return $response->json();
    }
}
