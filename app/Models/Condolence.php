<?php

namespace App\Models;

use Database\Factories\CondolenceFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['anket_id', 'user_id', 'author_name', 'message'])]
class Condolence extends Model
{
    /** @use HasFactory<CondolenceFactory> */
    use HasFactory;

    public function anket(): BelongsTo
    {
        return $this->belongsTo(Anket::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
