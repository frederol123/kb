<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Intervention\Image\Drivers\Imagick\Driver as ImagickDriver;
use Intervention\Image\ImageManager;
use RuntimeException;

/**
 * Сервис обработки изображений — кадрирование под ширину 1540px без искажений.
 */
final class ImageService
{
    private const TARGET_WIDTH = 1540;
    private const TARGET_HEIGHT = 963; // 1540 × 963 ≈ 16:10 (как в memorial-hero)
    private const QUALITY = 85;
    private const FORMAT = 'webp';

    /**
     * Обработать загруженное фото: cover(1540, 963) → webp 85%.
     *
     * @throws RuntimeException если файл повреждён или не читается
     */
    public function process(UploadedFile $file): string
    {
        try {
            $manager = new ImageManager(ImagickDriver::class);

            $image = $manager->decode($file->getRealPath());

            // Cover: масштабирует и обрезает лишнее, сохраняя пропорции без растяжения
            $image->cover(self::TARGET_WIDTH, self::TARGET_HEIGHT);

            $filename = uniqid('img_', true) . '.' . self::FORMAT;
            $path = sys_get_temp_dir() . '/' . $filename;

            $image->save($path, quality: self::QUALITY);

            return $path;
        } catch (\Throwable $e) {
            throw new RuntimeException('Ошибка обработки изображения: ' . $e->getMessage(), 0, $e);
        }
    }
}
