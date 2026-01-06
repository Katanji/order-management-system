<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Order::with('items.product');

        if ($request->has('status')) {
            $query->filterByStatus($request->status);
        }

        $query->filterByDateRange($request->date_from, $request->date_to);

        return response()->json($query->latest()->paginate(10));
    }

    public function store(StoreOrderRequest $request): JsonResponse
    {
        return DB::transaction(function () use ($request) {
            $totalPrice = 0;
            $itemsData = [];

            // Pre-fetch products to avoid N+1 and check stock
            $productIds = collect($request->items)->pluck('product_id');
            $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

            foreach ($request->items as $item) {
                $product = $products->get($item['product_id']);
                
                if (!$product) {
                    abort(422, "Product ID {$item['product_id']} not found.");
                }

                if ($item['quantity'] > $product->stock_quantity) {
                    abort(422, "Not enough stock for product '{$product->name}'. Requested: {$item['quantity']}, Available: {$product->stock_quantity}");
                }

                $itemsData[] = [
                    'product' => $product,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'subtotal' => $product->price * $item['quantity'],
                ];

                $totalPrice += $product->price * $item['quantity'];
            }

            $order = Order::create([
                'status' => \App\Enums\OrderStatus::Pending,
                'total_price' => $totalPrice,
            ]);

            foreach ($itemsData as $data) {
                $order->items()->create([
                    'product_id' => $data['product']->id,
                    'quantity' => $data['quantity'],
                    'price_at_purchase' => $data['price'],
                ]);
            }

            return response()->json($order->load('items'), 201);
        });
    }

    public function show(Order $order): JsonResponse
    {
        return response()->json($order->load('items.product'));
    }

    public function confirm(Order $order): JsonResponse
    {
        if ($order->status !== \App\Enums\OrderStatus::Pending) {
            return response()->json(['message' => 'Order is not pending.'], 400);
        }

        return DB::transaction(function () use ($order) {
            // Re-load items with products to check current stock
            $order->load('items.product');

            foreach ($order->items as $item) {
                // Lock the product row for update to prevent race conditions
                $product = Product::lockForUpdate()->find($item->product_id);

                if ($item->quantity > $product->stock_quantity) {
                    abort(422, "Not enough stock for product '{$product->name}' at confirmation. Requested: {$item->quantity}, Available: {$product->stock_quantity}");
                }

                $product->decrement('stock_quantity', $item->quantity);
            }

            $order->update(['status' => \App\Enums\OrderStatus::Confirmed]);

            return response()->json($order);
        });
    }

    public function cancel(Order $order): JsonResponse
    {
        if ($order->status !== \App\Enums\OrderStatus::Pending) {
            return response()->json(['message' => 'Only pending orders can be cancelled.'], 400);
        }

        $order->update(['status' => \App\Enums\OrderStatus::Cancelled]);

        return response()->json($order);
    }
}
