<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderStockTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_stock_decrements_on_order_confirmation(): void
    {
        // Arrange: Create a product with 10 stock
        $product = Product::factory()->create(['stock_quantity' => 10]);

        // Create an order with 3 items
        $orderResponse = $this->actingAs($this->user)->postJson('/api/orders', [
            'items' => [
                ['product_id' => $product->id, 'quantity' => 3],
            ],
        ]);

        $orderResponse->assertStatus(201);
        $orderId = $orderResponse->json('id');

        // Assert stock unchanged after creation (still pending)
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock_quantity' => 10,
        ]);

        // Act: Confirm the order
        $confirmResponse = $this->actingAs($this->user)->postJson("/api/orders/{$orderId}/confirm");
        $confirmResponse->assertStatus(200);

        // Assert: Stock decreased by 3
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock_quantity' => 7,
        ]);
    }

    public function test_order_confirmation_fails_with_insufficient_stock(): void
    {
        // Arrange: Create a product with only 2 stock
        $product = Product::factory()->create(['stock_quantity' => 2]);

        // Create an order requesting 5 items (more than available)
        $orderResponse = $this->actingAs($this->user)->postJson('/api/orders', [
            'items' => [
                ['product_id' => $product->id, 'quantity' => 5],
            ],
        ]);

        // Should fail at creation time
        $orderResponse->assertStatus(422);
    }

    public function test_order_status_changes_to_confirmed(): void
    {
        // Arrange
        $product = Product::factory()->create(['stock_quantity' => 10]);

        $orderResponse = $this->actingAs($this->user)->postJson('/api/orders', [
            'items' => [
                ['product_id' => $product->id, 'quantity' => 1],
            ],
        ]);

        $orderId = $orderResponse->json('id');

        // Assert initial status is pending
        $this->assertDatabaseHas('orders', [
            'id' => $orderId,
            'status' => \App\Enums\OrderStatus::Pending,
        ]);

        // Act: Confirm
        $this->actingAs($this->user)->postJson("/api/orders/{$orderId}/confirm");

        // Assert: Status changed to confirmed
        $this->assertDatabaseHas('orders', [
            'id' => $orderId,
            'status' => \App\Enums\OrderStatus::Confirmed,
        ]);
    }

    public function test_cannot_confirm_already_confirmed_order(): void
    {
        // Arrange
        $product = Product::factory()->create(['stock_quantity' => 10]);

        $orderResponse = $this->actingAs($this->user)->postJson('/api/orders', [
            'items' => [
                ['product_id' => $product->id, 'quantity' => 1],
            ],
        ]);

        $orderId = $orderResponse->json('id');

        // First confirmation
        $this->actingAs($this->user)->postJson("/api/orders/{$orderId}/confirm")->assertStatus(200);

        // Second confirmation should fail
        $this->actingAs($this->user)->postJson("/api/orders/{$orderId}/confirm")->assertStatus(409);

        // Stock should only be decremented once
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock_quantity' => 9,
        ]);
    }
}
