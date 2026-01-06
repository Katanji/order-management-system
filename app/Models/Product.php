<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'stock_quantity',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock_quantity' => 'integer',
    ];

    public function scopeSearch($query, $search)
    {
        return $query->where('name', 'ilike', '%' . $search . '%');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
