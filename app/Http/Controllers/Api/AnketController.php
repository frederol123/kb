<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Anket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
        ]);

        $status = $request->input('status', 'draft');
        if ($status === 'private' && !($request->user()->tariff?->limits['has_privacy'] ?? false)) {
            abort(403, 'Функция «Приватность» недоступна на вашем тарифе.');
        }

        $slug = $this->generateSlug($request);

        $anket = $request->user()->ankets()->create([
            'slug' => $slug,
            'status' => $request->input('status', 'draft'),
            'info' => $request->input('info'),
            'content' => $request->input('content'),
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

    public function public(string $slug): JsonResponse
    {
        $anket = Anket::where('slug', $slug)->first();

        if (! $anket) {
            abort(404);
        }

        if ($anket->status !== 'published') {
            if ($anket->status === 'draft') {
                return response()->json([
                    'message' => 'Просмотр доступен только при статусе «Приватный» или «Опубликованный».',
                ], 403);
            }

            // private — только авторизованный владелец
            if ($anket->status === 'private') {
                $user = auth()->user();

                if (! $user || $anket->user_id !== $user->id) {
                    abort(404);
                }
            }
        }

        return response()->json($anket->load('condolences.user:id,name'));
    }

    public function updateInfo(Request $request, Anket $anket): JsonResponse
    {
        if ($anket->user_id !== $request->user()->id) {
            if (! $request->user()->hasAnyRole(['admin', 'manager'])) {
                abort(403);
            }
        }

        $request->validate([
            'status' => ['string', 'in:draft,published,private'],
            'info' => ['array'],
            'info.contact' => ['required', 'string', 'max:255'],
            'family' => ['array', 'nullable'],
            'content' => ['nullable', 'array'],
            'content.gallery' => ['nullable', 'array', 'max:' . $request->user()->max_gallery_images],
            'content.videos' => ['nullable', 'array', 'max:' . $request->user()->max_videos],
        ], [
            'info.contact.required' => 'Заполните контакты для связи',
        ]);

        if ($request->input('status') === 'private' && !($request->user()->tariff?->limits['has_privacy'] ?? false)) {
            abort(403, 'Функция «Приватность» недоступна на вашем тарифе.');
        }

        $data = $request->only(['status', 'info', 'family']);

        if ($request->has('content')) {
            $data['content'] = $request->input('content');
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

        $request->validate([
            'content' => ['required', 'array'],
            'content.gallery' => ['nullable', 'array', 'max:' . $request->user()->max_gallery_images],
            'content.videos' => ['nullable', 'array', 'max:' . $request->user()->max_videos],
        ]);

        $anket->update(['content' => $request->input('content')]);

        return response()->json($anket);
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
