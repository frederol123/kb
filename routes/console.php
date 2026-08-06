<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Отмена pending-транзакций Robokassa, по которым не поступила оплата (старше 30 минут)
Schedule::command('transactions:expire-pending')->everyFifteenMinutes();
