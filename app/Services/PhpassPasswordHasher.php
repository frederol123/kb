<?php

namespace App\Services;

use Illuminate\Contracts\Hashing\Hasher;

class PhpassPasswordHasher implements Hasher
{
    private Hasher $bcrypt;

    public function __construct(Hasher $bcrypt)
    {
        $this->bcrypt = $bcrypt;
    }

    public function info($hashedValue): array
    {
        if ($this->isPhpassHash($hashedValue)) {
            return ['algo' => 'phpass', 'options' => []];
        }

        return $this->bcrypt->info($hashedValue);
    }

    public function make($value, array $options = []): string
    {
        return $this->bcrypt->make($value, $options);
    }

    public function check($value, $hashedValue, array $options = []): bool
    {
        if ($hashedValue === null) {
            return false;
        }

        if ($this->isPhpassHash($hashedValue)) {
            return $this->checkPhpassHash($value, $hashedValue);
        }

        return $this->bcrypt->check($value, $hashedValue, $options);
    }

    public function needsRehash($hashedValue, array $options = []): bool
    {
        if ($hashedValue === null) {
            return false;
        }

        if ($this->isPhpassHash($hashedValue)) {
            return true;
        }

        return $this->bcrypt->needsRehash($hashedValue, $options);
    }

    private function isPhpassHash(string $hash): bool
    {
        return str_starts_with($hash, '$P$') || str_starts_with($hash, '$H$');
    }

    private function checkPhpassHash(string $value, string $hash): bool
    {
        $itoa = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

        if (strlen($hash) < 34) {
            return false;
        }

        $count = 1 << strpos($itoa, $hash[3]);
        $salt = substr($hash, 4, 8);

        $input = md5($salt . $value, true);
        $input = md5($input . $value, true);

        for ($i = 0; $i < $count; $i++) {
            $input = md5($input . $value, true);
        }

        $output = $hash[0] . $hash[1] . $hash[2] . $hash[3] . $salt;
        $output .= $this->encode64($input, 16);

        return hash_equals($hash, $output);
    }

    private function encode64(string $input, int $count): string
    {
        $itoa = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        $output = '';
        $i = 0;

        do {
            $value = ord($input[$i++]);
            $output .= $itoa[$value & 0x3f];
            if ($i < $count) {
                $value |= ord($input[$i]) << 8;
            }
            $output .= $itoa[($value >> 6) & 0x3f];
            if ($i++ >= $count) {
                break;
            }
            if ($i < $count) {
                $value |= ord($input[$i]) << 16;
            }
            $output .= $itoa[($value >> 12) & 0x3f];
            if ($i++ >= $count) {
                break;
            }
            $output .= $itoa[($value >> 18) & 0x3f];
        } while ($i < $count);

        return $output;
    }
}
