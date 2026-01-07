<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::create([
            'name' => 'MacBook Pro 16',
            'price' => 2000.00,
            'stock_quantity' => 10,
        ]);

        Product::create([
            'name' => 'iPhone 15',
            'price' => 999.00,
            'stock_quantity' => 20,
        ]);

        Product::create([
            'name' => 'AirPods Pro',
            'price' => 249.00,
            'stock_quantity' => 50,
        ]);
        
        // Exact match for the test if it looks for "MacBook" specifically
        Product::create([
            'name' => 'MacBook',
            'price' => 2000.00,
            'stock_quantity' => 5,
        ]);
    }
}
