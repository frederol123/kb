<?php

namespace Database\Seeders;

use App\Models\Tariff;
use Illuminate\Database\Seeder;

class TariffSeeder extends Seeder
{
    public function run(): void
    {
        Tariff::create([
            'title' => 'Базовая страница',
            'slug' => 'basic',
            'price' => 3400,
            'description' => 'Металлическая табличка с QR-кодом, биография, фото, видео и аудио.',
            'features' => [
                ['icon' => 'icon-list-qr.svg', 'text' => 'Табличка с QR-кодом в футляре'],
                ['icon' => 'icon-list-note.svg', 'text' => 'Добавление биографии'],
                ['icon' => 'icon-list-picture.svg', 'text' => 'Добавление фото, видео и аудио'],
            ],
            'limits' => [
                'max_qr_codes' => 1,
                'max_gallery_images' => 6,
                'max_videos' => 6,
                'has_installation' => false,
                'has_privacy' => false,
                'has_maintenance' => false,
                'has_family_tree' => false,
                'has_video_creation' => false,
            ],
        ]);

        Tariff::create([
            'title' => 'Расширенная страница',
            'slug' => 'extended',
            'price' => 8250,
            'description' => 'Всё из базового тарифа + 3 QR-кода, установка за счёт компании, приватность, обслуживание.',
            'features' => [
                ['icon' => 'icon-list-picture.svg', 'text' => 'Добавление фото, видео и аудио'],
                ['icon' => 'icon-list-mount.svg', 'text' => 'Установка за счёт компании'],
                ['icon' => 'icon-list-privacy.svg', 'text' => 'Приватность'],
                ['icon' => 'icon-list-support.svg', 'text' => 'Обслуживание страницы'],
            ],
            'limits' => [
                'max_qr_codes' => 3,
                'max_gallery_images' => 10,
                'max_videos' => 10,
                'has_installation' => true,
                'has_privacy' => true,
                'has_maintenance' => true,
                'has_family_tree' => false,
                'has_video_creation' => false,
            ],
        ]);

        Tariff::create([
            'title' => 'Особая страница',
            'slug' => 'special',
            'price' => 13750,
            'description' => 'Максимальный тариф: 5 QR-кодов, видеоролик, генеалогическое древо, всё включено.',
            'features' => [
                ['icon' => 'icon-list-tree.svg', 'text' => 'Создание генеалогического древа в профиле пользователя.'],
            ],
            'limits' => [
                'max_qr_codes' => 5,
                'max_gallery_images' => 20,
                'max_videos' => 20,
                'has_installation' => true,
                'has_privacy' => true,
                'has_maintenance' => true,
                'has_family_tree' => true,
                'has_video_creation' => true,
            ],
        ]);

        Tariff::create([
            'title' => 'Страница питомца',
            'slug' => 'pet',
            'price' => 2200,
            'description' => 'Табличка с QR-кодом, биография питомца, фото, видео и аудио.',
            'features' => [
                ['icon' => 'icon-list-qr.svg', 'text' => 'Табличка с QR-кодом в футляре'],
                ['icon' => 'icon-list-note.svg', 'text' => 'Добавление биографии'],
                ['icon' => 'icon-list-picture.svg', 'text' => 'Добавление фото, видео и аудио'],
            ],
            'limits' => [
                'max_qr_codes' => 1,
                'max_gallery_images' => 6,
                'max_videos' => 6,
                'has_installation' => false,
                'has_privacy' => false,
                'has_maintenance' => false,
                'has_family_tree' => false,
                'has_video_creation' => false,
            ],
        ]);
    }
}
