<?php

namespace App\Models;

use Database\Factories\AnketFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['user_id', 'slug', 'status', 'info', 'content', 'family'])]
class Anket extends Model
{
    /** @use HasFactory<AnketFactory> */
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'info' => 'json',
            'content' => 'json',
            'family' => 'json',
        ];
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
