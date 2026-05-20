<?php

namespace Tests\Feature;

use App\Models\Anket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QrTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_download_qr(): void
    {
        $user = User::factory()->create();
        $anket = Anket::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->get("/api/ankets/{$anket->id}/qr");

        $response->assertStatus(200)
            ->assertHeader('Content-Type', 'image/png');
    }

    public function test_guest_cannot_download_qr_for_draft(): void
    {
        $anket = Anket::factory()->create(['status' => 'draft']);

        $response = $this->get("/api/ankets/{$anket->id}/qr");

        $response->assertStatus(404);
    }

    public function test_other_user_cannot_download_qr_for_draft(): void
    {
        $user = User::factory()->create();
        $anket = Anket::factory()->create([
            'user_id' => User::factory()->create()->id,
            'status' => 'draft',
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->get("/api/ankets/{$anket->id}/qr");

        $response->assertStatus(404);
    }
}
