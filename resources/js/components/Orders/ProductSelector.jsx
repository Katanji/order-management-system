import React, { useState, useEffect } from 'react';
import axios from '../../lib/axios';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const ProductSelector = ({ onAddToCart }) => {
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/products?per_page=100');
            setProducts(response.data.data);
        } catch (err) {
            console.error(err);
            setError('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!selectedProductId) return;
        const product = products.find(p => p.id === parseInt(selectedProductId));
        if (product) {
            onAddToCart(product);
            setSelectedProductId('');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Products</CardTitle>
                <CardDescription>Select products from the catalog to add to your order.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {error && <div className="text-destructive text-sm">{error}</div>}
                <div className="flex flex-col gap-4">
                    <div className="grid w-full items-center gap-1.5">
                        <Select value={selectedProductId} onValueChange={setSelectedProductId} disabled={loading}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a product..." />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map(product => (
                                    <SelectItem
                                        key={product.id}
                                        value={product.id.toString()}
                                        disabled={product.stock_quantity === 0}
                                    >
                                        {product.name} — ${parseFloat(product.price).toFixed(2)}
                                        {product.stock_quantity === 0 ? ' (Out of Stock)' : ''}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleAddToCart} disabled={!selectedProductId} className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" /> Add to Order
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductSelector;
