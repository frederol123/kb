<?php

namespace Database\Factories;

use App\Models\Anket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Anket>
 */
class AnketFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'slug' => fn () => Str::slug(fake()->unique()->words(3, true)),
            'status' => fake()->randomElement(['draft', 'published', 'private']),
            'info' => [
                'first_name' => fake()->firstName(),
                'last_name' => fake()->lastName(),
                'middle_name' => fake()->firstName(),
                'birth_date' => fake()->date('Y-m-d', '-30 years'),
                'death_date' => fake()->date('Y-m-d', 'now'),
                'photo' => null,
            ],
            'content' => [
                'biography' => fake()->paragraphs(3, true),
                'achievements' => fake()->sentence(),
            ],
            'family' => null,
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
        ]);
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
        ]);
    }

    public function withFamily(): static
    {
        return $this->state(fn (array $attributes) => [
            'family' => [
                'father' => fake()->name('male'),
                'mother' => fake()->name('female'),
                'children' => [fake()->name()],
            ],
        ]);
    }
}
