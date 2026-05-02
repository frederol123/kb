<?php

namespace Database\Factories;

use App\Models\Anket;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Transaction>
 */
class TransactionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'purchasable_type' => Anket::class,
            'purchasable_id' => Anket::factory(),
            'amount' => fake()->randomFloat(2, 100, 10000),
            'currency' => 'RUB',
            'status' => fake()->randomElement(['pending', 'succeeded', 'canceled']),
            'yookassa_id' => fake()->unique()->uuid(),
            'metadata' => null,
        ];
    }

    public function succeeded(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'succeeded',
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }
}
