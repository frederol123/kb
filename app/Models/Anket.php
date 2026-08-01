<?php

namespace App\Models;

use Database\Factories\AnketFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['user_id', 'slug', 'status', 'manager_checked', 'private_pin', 'info', 'content', 'family'])]
class Anket extends Model
{
    /** @use HasFactory<AnketFactory> */
    use HasFactory, SoftDeletes;

    /**
     * Хеш пин-кода не должен попадать в API-ответы.
     * Фронту нужен только флаг has_private_pin (accessor ниже).
     */
    protected $hidden = ['private_pin'];

    protected $appends = ['has_private_pin'];

    protected function casts(): array
    {
        return [
            'info' => 'json',
            'content' => 'json',
            'family' => 'json',
            'manager_checked' => 'boolean',
        ];
    }

    public function getHasPrivatePinAttribute(): bool
    {
        return ! empty($this->attributes['private_pin'] ?? null);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function condolences(): HasMany
    {
        return $this->hasMany(Condolence::class);
    }

    public function transactions(): HasMany
    {
        return $this->morphMany(Transaction::class, 'purchasable');
    }
}
