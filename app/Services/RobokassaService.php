<?php

namespace App\Services;

use App\Models\Tariff;
use App\Models\Transaction;
use Illuminate\Support\Facades\Log;

class RobokassaService
{
    private string $merchantLogin;
    private string $password1;
    private string $password2;
    private bool $testMode;

    public function __construct()
    {
        $this->merchantLogin = config('robokassa.merchant_login');
        $this->password1 = config('robokassa.password1');
        $this->password2 = config('robokassa.password2');
        $this->testMode = config('robokassa.test_mode', true);
    }

    /**
     * Создать платёж и получить ссылку для редиректа на Robokassa.
     */
    public function createPayment(int $userId, int $tariffId, string $successUrl, string $failUrl, ?float $discountedAmount = null): array
    {
        $tariff = Tariff::findOrFail($tariffId);

        $amount = $discountedAmount ?? (float) $tariff->price;

        // Создаём транзакцию
        $transaction = Transaction::create([
            'user_id' => $userId,
            'purchasable_type' => Tariff::class,
            'purchasable_id' => $tariff->id,
            'amount' => $amount,
            'currency' => 'RUB',
            'status' => 'pending',
        ]);

        $invId = $transaction->id;
        $outSum = number_format((float) $amount, 2, '.', '');

        // Формируем Receipt для фискализации (54-ФЗ)
        $receipt = $this->buildReceipt($tariff->title, $amount);

        $url = $this->generatePaymentUrl($outSum, $invId, $tariff->title, $successUrl, $failUrl, $receipt);

        return [
            'payment_url' => $url,
            'transaction_id' => $transaction->id,
        ];
    }

    /**
     * Сформировать JSON для параметра Receipt (номенклатура по 54-ФЗ).
     */
    private function buildReceipt(string $name, float $amount): string
    {
        $kopecks = (int) round($amount * 100);

        $data = [
            'items' => [
                [
                    'name' => $name,
                    'quantity' => 1,
                    'sum' => $kopecks,
                    'cost' => $kopecks,
                    'payment_method' => 'full_payment',
                    'payment_object' => 'service',
                    'tax' => 'none',
                ],
            ],
        ];

        return json_encode($data, JSON_UNESCAPED_UNICODE);
    }

    /**
     * Сгенерировать полный URL для редиректа на Robokassa.
     */
    public function generatePaymentUrl(
        string $outSum,
        int $invId,
        string $description,
        string $successUrl,
        string $failUrl,
        string $receipt = ''
    ): string {
        // Receipt участвует в подписи — URL-кодируем его
        $receiptEncoded = $receipt !== '' ? urlencode($receipt) : '';
        $signature = $this->makeSignature($this->password1, $outSum, $invId, $receiptEncoded);

        $params = [
            'MerchantLogin'  => $this->merchantLogin,
            'OutSum'         => $outSum,
            'InvId'          => $invId,
            'Description'    => $description,
            'SignatureValue'  => $signature,
            'SuccessURL'     => $successUrl,
            'FailURL'        => $failUrl,
        ];

        if ($receipt !== '') {
            $params['Receipt'] = $receipt;
        }

        if ($this->testMode) {
            $params['IsTest'] = 1;
        }

        return 'https://auth.robokassa.ru/Merchant/Index.aspx?' . http_build_query($params);
    }

    /**
     * Проверить подпись из Result URL (вебхук от Robokassa).
     * Возвращает true если подпись верна.
     */
    public function validateResult(string $outSum, int $invId, string $signature): bool
    {
        $expected = $this->makeSignature($this->password2, $outSum, $invId);
        return strtolower($signature) === strtolower($expected);
    }

    /**
     * Проверить подпись из Success URL.
     */
    public function validateSuccess(string $outSum, int $invId, string $signature): bool
    {
        $expected = $this->makeSignature($this->password1, $outSum, $invId);
        return strtolower($signature) === strtolower($expected);
    }

    /**
     * Сформировать MD5-подпись по формату Robokassa.
     *
     * Формат: OutSum:InvId[:Receipt]:Password
     * Receipt — URL-encoded JSON, передаётся только если есть номенклатура.
     */
    private function makeSignature(string $password, string $outSum, int $invId, string $receipt = ''): string
    {
        $parts = [$outSum, (string) $invId];

        if ($receipt !== '') {
            $parts[] = $receipt;
        }

        $parts[] = $password;

        return md5(implode(':', $parts));
    }
}
