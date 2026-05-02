<?php

namespace App\Policies;

use App\Models\Drev;
use App\Models\User;

class DrevPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function view(User $user, Drev $drev): bool
    {
        return $user->id === $drev->user_id;
    }

    public function update(User $user, Drev $drev): bool
    {
        return $user->id === $drev->user_id;
    }

    public function delete(User $user, Drev $drev): bool
    {
        return $user->id === $drev->user_id;
    }
}
