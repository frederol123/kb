<?php

namespace Database\Factories;

use App\Models\Novost;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Novost>
 */
class NovostFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(4),
            'slug' => fn () => Str::slug(fake()->unique()->words(3, true)),
            'content' => [
                'body' => fake()->paragraphs(3, true),
                'excerpt' => fake()->sentence(),
            ],
            'published_at' => fake()->dateTimeBetween('-1 year', 'now'),
        ];
    }

    public function unpublished(): static
    {
        return $this->state(fn (array $attributes) => [
            'published_at' => null,
        ]);
    }
}
