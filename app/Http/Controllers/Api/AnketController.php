<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Anket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AnketController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $ankets = Anket::query()
            ->where('user_id', $request->user()->id)
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->status))
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json($ankets);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'status' => ['string', 'in:draft,published,private'],
            'info' => ['array'],
            'content' => ['array'],
            'family' => ['array', 'nullable'],
        ] + $this->infoTextFieldRules(), $this->infoTextFieldMessages());

        $status = $request->input('status', 'draft');
        if ($status === 'private' && !($request->user()->tariff?->limits['has_privacy'] ?? false)) {
            abort(403, 'Функция «Приватность» недоступна на вашем тарифе.');
        }

        $slug = $this->generateSlug($request);

        $anket = $request->user()->ankets()->create([
            'slug' => $slug,
            'status' => $request->input('status', 'draft'),
            'info' => $request->input('info'),
            'content' => $this->sanitizeContent($request->input('content') ?? []),
            'family' => $request->input('family'),
        ]);

        return response()->json($anket, 201);
    }

    public function show(Anket $anket): JsonResponse
    {
        $user = auth()->user();

        if (! in_array($anket->status, ['published']) && $anket->user_id !== $user->id) {
            if (! $user->hasAnyRole(['admin', 'manager'])) {
                abort(404);
            }
        }

        return response()->json($anket->load('condolences.user:id,name'));
    }

    public function public(Request $request, string $slug): JsonResponse
    {
        $anket = Anket::where('slug', $slug)->first();

        if (! $anket) {
            abort(404);
        }

        if ($anket->status !== 'published') {
            if ($anket->status === 'draft') {
                // Черновик — только владельцу или сотрудникам (admin/manager)
                $user = auth('sanctum')->user();
                $isOwner = $user && $anket->user_id === $user->id;
                $isStaff = $user && $user->hasAnyRole(['admin', 'manager']);

                if (! $isOwner && ! $isStaff) {
                    return response()->json([
                        'message' => 'Просмотр доступен только при статусе «Приватный» или «Опубликованный».',
                    ], 403);
                }
            }

            // private — владелец или гость с действующим пин-токеном (4 часа)
            if ($anket->status === 'private') {
                $user = auth('sanctum')->user();
                $isOwner = $user && $anket->user_id === $user->id;

                if (! $isOwner && ! $this->validPrivateAccessToken($anket, $request->query('access_token'))) {
                    abort(403, 'Анкета приватная.');
                }
            }
        }

        return response()->json($anket->load('condolences.user:id,name'));
    }

    /**
     * Проверка пин-кода приватной анкеты. При успехе выдаёт подписанный
     * токен доступа на 4 часа (привязан к хешу пина — смена пина аннулирует токены).
     */
    public function requestAccess(Request $request, string $slug): JsonResponse
    {
        $anket = Anket::where('slug', $slug)->first();

        if (! $anket || $anket->status !== 'private' || ! $anket->private_pin) {
            abort(404);
        }

        $request->validate([
            'pin' => ['required', 'string'],
        ]);

        if (! Hash::check($request->input('pin'), $anket->private_pin)) {
            return response()->json(['message' => 'Неверный пин-код.'], 403);
        }

        $token = Crypt::encryptString(implode('|', [
            $anket->id,
            $anket->private_pin,
            now()->addHours(4)->getTimestamp(),
        ]));

        return response()->json(['access_token' => $token]);
    }

    private function validPrivateAccessToken(Anket $anket, ?string $token): bool
    {
        if (! $token) {
            return false;
        }

        try {
            $payload = Crypt::decryptString($token);
        } catch (\Throwable) {
            return false;
        }

        [$anketId, $pinHash, $expiresAt] = array_pad(explode('|', $payload), 3, '');

        return (int) $anketId === $anket->id
            && hash_equals($anket->private_pin ?? '', $pinHash)
            && now()->getTimestamp() <= (int) $expiresAt;
    }

    public function updateInfo(Request $request, Anket $anket): JsonResponse
    {
        if ($anket->user_id !== $request->user()->id) {
            if (! $request->user()->hasAnyRole(['admin', 'manager'])) {
                abort(403);
            }
        }

        $limits = $request->user()->tariff?->limits ?? [];
        $maxGallery = (int) ($limits['max_gallery_images'] ?? $request->user()->max_gallery_images ?? 6);
        $maxVideos = (int) ($limits['max_videos'] ?? $request->user()->max_videos ?? 6);

        $request->validate([
            'status' => ['string', 'in:draft,published,private'],
            'info' => ['array'],
            'info.contact' => ['required', 'string', 'max:255'],
            'family' => ['array', 'nullable'],
            'content' => ['nullable', 'array'],
            'content.gallery' => ['nullable', 'array', 'max:' . $maxGallery],
            'content.videos' => ['nullable', 'array', 'max:' . $maxVideos],
            'private_pin' => ['nullable', 'string', 'digits_between:4,6'],
        ] + $this->infoTextFieldRules(), array_merge($this->infoTextFieldMessages(), [
            'info.contact.required' => 'Заполните контакты для связи',
            'private_pin.digits_between' => 'Пин-код должен содержать от 4 до 6 цифр',
        ]));

        if ($request->input('status') === 'private' && !($request->user()->tariff?->limits['has_privacy'] ?? false)) {
            abort(403, 'Функция «Приватность» недоступна на вашем тарифе.');
        }

        $data = $request->only(['status', 'info', 'family']);

        if ($request->has('content')) {
            $data['content'] = $this->sanitizeContent($request->input('content'));
        }

        // private_pin: null — очистить, строка — захешировать, не передан — не менять
        if ($request->exists('private_pin')) {
            $pin = $request->input('private_pin');
            $data['private_pin'] = $pin === null ? null : Hash::make($pin);
        }

        $anket->update($data);

        return response()->json($anket);
    }

    public function updateContent(Request $request, Anket $anket): JsonResponse
    {
        if ($anket->user_id !== $request->user()->id) {
            if (! $request->user()->hasAnyRole(['admin', 'manager'])) {
                abort(403);
            }
        }

        $limits = $request->user()->tariff?->limits ?? [];
        $maxGallery = (int) ($limits['max_gallery_images'] ?? $request->user()->max_gallery_images ?? 6);
        $maxVideos = (int) ($limits['max_videos'] ?? $request->user()->max_videos ?? 6);

        $request->validate([
            'content' => ['required', 'array'],
            'content.gallery' => ['nullable', 'array', 'max:' . $maxGallery],
            'content.videos' => ['nullable', 'array', 'max:' . $maxVideos],
        ]);

        $anket->update(['content' => $this->sanitizeContent($request->input('content'))]);

        return response()->json($anket);
    }

    /**
     * Правила валидации текстовых полей первого блока (ФИО, места):
     * значение не может состоять только из цифр.
     */
    private function infoTextFieldRules(): array
    {
        return [
            'info.last_name' => ['nullable', 'string', 'not_regex:/^\d+$/'],
            'info.first_name' => ['nullable', 'string', 'not_regex:/^\d+$/'],
            'info.middle_name' => ['nullable', 'string', 'not_regex:/^\d+$/'],
            'info.birthplace' => ['nullable', 'string', 'not_regex:/^\d+$/'],
            'info.deathplace' => ['nullable', 'string', 'not_regex:/^\d+$/'],
        ];
    }

    private function infoTextFieldMessages(): array
    {
        return [
            'info.last_name.not_regex' => 'Неправильный формат поля "Фамилия"',
            'info.first_name.not_regex' => 'Неправильный формат поля "Имя"',
            'info.middle_name.not_regex' => 'Неправильный формат поля "Отчество"',
            'info.birthplace.not_regex' => 'Неправильный формат поля "Место рождения"',
            'info.deathplace.not_regex' => 'Неправильный формат поля "Место смерти"',
        ];
    }

    /**
     * Санитизация контента анкеты.
     *
     * - biography — HTML от TipTap-редактора: пропускается через HTMLPurifier
     *   (whitelist тегов в config/purifier.php, img намеренно запрещён).
     * - timeline — текст: strip_tags как defense-in-depth (React и так экранирует).
     * - gallery/videos — только URL/текст, React экранирует.
     */
    private function sanitizeContent(array $content): array
    {
        foreach (['biography'] as $field) {
            if (isset($content[$field]) && is_string($content[$field])) {
                $content[$field] = \Mews\Purifier\Facades\Purifier::clean($content[$field]);
            }
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

        return $content;
    }

    public function destroy(Request $request, Anket $anket): \Illuminate\Http\Response
    {
        if ($anket->user_id !== $request->user()->id) {
            abort(403);
        }

        $anket->delete();

        return response()->noContent();
    }

    private function generateSlug(Request $request): string
    {
        $info = $request->input('info', []);
        $base = trim(sprintf('%s %s %s',
            $info['last_name'] ?? '',
            $info['first_name'] ?? '',
            $info['middle_name'] ?? ''
        ));

        if (empty($base)) {
            $base = 'anketa';
        }

        $slug = Str::slug($base);
        $original = $slug;
        $counter = 1;

        while (Anket::withTrashed()->where('slug', $slug)->exists()) {
            $slug = $original . '-' . $counter++;
        }

        return $slug;
    }
}
