<?php

namespace Database\Factories;

use App\Models\Anket;
use App\Models\Condolence;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Condolence>
 */
class CondolenceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'anket_id' => Anket::factory(),
            'user_id' => User::factory(),
            'author_name' => fake()->name(),
            'message' => fake()->paragraph(),
        ];
    }

    public function anonymous(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => null,
            'author_name' => fake()->name(),
        ]);
    }
}
