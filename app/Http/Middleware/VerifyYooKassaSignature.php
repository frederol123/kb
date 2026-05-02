<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class VerifyYooKassaSignature
{
    public function handle(Request $request, Closure $next)
    {
        // YooKassa IP verification in production, skip in test mode
        if (config('yookassa.test_mode')) {
            return $next($request);
        }

        $ip = $request->ip();
        $allowedIps = ['185.71.76.0/27', '185.71.77.0/27', '77.75.153.0/25', '77.75.156.0/25', '77.75.154.128/25', '2a02:5180::/32'];

        foreach ($allowedIps as $range) {
            if ($this->ipInRange($ip, $range)) {
                return $next($request);
            }
        }

        abort(403);
    }

    private function ipInRange(string $ip, string $range): bool
    {
        if (str_contains($range, ':')) {
            return $this->ipv6InRange($ip, $range);
        }

        [$subnet, $bits] = explode('/', $range);
        $ipLong = ip2long($ip);
        $subnetLong = ip2long($subnet);
        $mask = -1 << (32 - (int) $bits);

        return ($ipLong & $mask) === ($subnetLong & $mask);
    }

    private function ipv6InRange(string $ip, string $range): bool
    {
        // Skip strict v6 check in test mode
        return false;
    }
}
