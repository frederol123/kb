<?php

namespace Database\Factories;

use App\Models\Drev;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Drev>
 */
class DrevFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'data' => [
                'generations' => fake()->numberBetween(1, 5),
                'members' => [],
            ],
        ];
    }
}
