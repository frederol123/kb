<?php

namespace App\Http\Middleware;

use App\Models\Anket;
use Closure;
use Illuminate\Http\Request;

class CheckAnketOwnership
{
    public function handle(Request $request, Closure $next)
    {
        $anket = $request->route('anket');

        if ($anket instanceof Anket && $anket->user_id !== $request->user()?->id) {
            abort(403);
        }

        return $next($request);
    }
}
