<?php

namespace Tests\Unit;

use App\Services\PhpassPasswordHasher;
use Illuminate\Hashing\BcryptHasher;
use Tests\TestCase;

class PhpassPasswordHasherTest extends TestCase
{
    private PhpassPasswordHasher $hasher;

    protected function setUp(): void
    {
        parent::setUp();
        $this->hasher = new PhpassPasswordHasher(new BcryptHasher(['rounds' => 4]));
    }

    public function test_make_returns_bcrypt_hash(): void
    {
        $hash = $this->hasher->make('password');

        $this->assertStringStartsWith('$2y$', $hash);
    }

    public function test_check_bcrypt_hash(): void
    {
        $hash = $this->hasher->make('password');

        $this->assertTrue($this->hasher->check('password', $hash));
        $this->assertFalse($this->hasher->check('wrong', $hash));
    }

    public function test_check_phpass_hash(): void
    {
        $phpassHash = $this->generatePhpassHash('password');

        $this->assertTrue($this->hasher->check('password', $phpassHash));
        $this->assertFalse($this->hasher->check('wrong', $phpassHash));
    }

    public function test_phpass_hash_needs_rehash(): void
    {
        $phpassHash = $this->generatePhpassHash('test');

        $this->assertTrue($this->hasher->needsRehash($phpassHash));
    }

    public function test_bcrypt_hash_does_not_need_rehash(): void
    {
        $hash = $this->hasher->make('password');

        $this->assertFalse($this->hasher->needsRehash($hash));
    }

    public function test_check_null_hash_returns_false(): void
    {
        $this->assertFalse($this->hasher->check('password', null));
    }

    public function test_info_returns_phpass_algo_for_phpass_hash(): void
    {
        $phpassHash = $this->generatePhpassHash('test');
        $info = $this->hasher->info($phpassHash);

        $this->assertEquals('phpass', $info['algo']);
    }

    public function test_info_returns_bcrypt_algo(): void
    {
        $hash = $this->hasher->make('test');
        $info = $this->hasher->info($hash);

        $this->assertArrayHasKey('algo', $info);
        $this->assertNotEquals('phpass', $info['algo']);
    }

    private function generatePhpassHash(string $password): string
    {
        $itoa = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        $countLog2 = 8;
        $salt = substr(str_shuffle('abcdefghijklmnopqrstuvwxyz0123456789'), 0, 8);

        $input = md5($salt . $password, true);
        $input = md5($input . $password, true);

        for ($i = 0; $i < (1 << $countLog2); $i++) {
            $input = md5($input . $password, true);
        }

        $output = '$P$' . $itoa[$countLog2] . $salt;
        $count = 16;
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
