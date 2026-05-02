<?php

namespace App\Policies;

use App\Models\Anket;
use App\Models\User;

class AnketPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function view(?User $user, Anket $anket): bool
    {
        if ($anket->status === 'published') {
            return true;
        }

        return $user && $user->id === $anket->user_id;
    }

    public function update(User $user, Anket $anket): bool
    {
        return $user->id === $anket->user_id;
    }

    public function delete(User $user, Anket $anket): bool
    {
        return $user->id === $anket->user_id;
    }
}
