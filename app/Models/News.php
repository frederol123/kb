<?php

namespace App\Models;

use Database\Factories\NewsFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['user_id', 'title', 'slug', 'content', 'published_at'])]
class News extends Model
{
    /** @use HasFactory<NewsFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'novosti';

    protected function casts(): array
    {
        return [
            'content' => 'json',
            'published_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
