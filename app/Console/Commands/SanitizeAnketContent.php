<?php

namespace App\Console\Commands;

use App\Models\Anket;
use Illuminate\Console\Command;
use Mews\Purifier\Facades\Purifier;

class SanitizeAnketContent extends Command
{
    protected $signature = 'ankets:sanitize {--dry-run : Показать, что будет изменено, без записи}';

    protected $description = 'Прогоняет biography/timeline всех анкет через HTMLPurifier (очистка от XSS, сохранённого до фикса)';

    public function handle(): int
    {
        $total = 0;
        $changed = 0;

        Anket::withTrashed()->chunkById(100, function ($ankets) use (&$total, &$changed) {
            foreach ($ankets as $anket) {
                $content = $anket->content;

                if (! is_array($content)) {
                    continue;
                }

                $original = $content;
                $total++;

                if (isset($content['biography']) && is_string($content['biography'])) {
                    $content['biography'] = Purifier::clean($content['biography']);
                }

                if (isset($content['timeline']) && is_array($content['timeline'])) {
                    foreach ($content['timeline'] as &$event) {
                        if (! is_array($event)) {
                            continue;
                        }
                        foreach (['year', 'title', 'desc'] as $field) {
                            if (isset($event[$field]) && is_string($event[$field])) {
                                $event[$field] = strip_tags($event[$field]);
                            }
                        }
                    }
                    unset($event);
                }

                if ($content !== $original) {
                    $changed++;
                    $this->line("  [{$anket->id}] {$anket->slug} — будет очищено");

                    if (! $this->option('dry-run')) {
                        $anket->update(['content' => $content]);
                    }
                }
            }
        });

        $this->info("Проверено анкет: {$total}");
        $this->info("Требуют очистки: {$changed}" . ($this->option('dry-run') ? ' (dry-run, запись отключена)' : ' — очищено'));

        return self::SUCCESS;
    }
}
