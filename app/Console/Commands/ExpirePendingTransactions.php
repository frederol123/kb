<?php

namespace App\Console\Commands;

use App\Models\Transaction;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ExpirePendingTransactions extends Command
{
    protected $signature = 'transactions:expire-pending {--minutes=30 : возраст pending-транзакций в минутах, старше которых отменяем}';

    protected $description = 'Отменяет давние pending-транзакции (оплата не поступила)';

    public function handle(): int
    {
        $minutes = (int) $this->option('minutes');
        $threshold = now()->subMinutes($minutes);

        $count = Transaction::query()
            ->where('status', 'pending')
            ->where('created_at', '<', $threshold)
            ->update(['status' => 'cancelled']);

        if ($count > 0) {
            Log::info('Robokassa: expired pending transactions', [
                'count' => $count,
                'threshold' => $threshold->toDateTimeString(),
            ]);
        }

        $this->info("Отменено pending-транзакций старше {$minutes} мин: {$count}.");

        return self::SUCCESS;
    }
}
