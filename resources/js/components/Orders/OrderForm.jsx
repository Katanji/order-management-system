import React, { useState } from 'react';
import axios from '../../lib/axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ProductSelector from './ProductSelector';
import OrderCart from './OrderCart';

const OrderForm = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.product_id === product.id);
        if (existingItem) {
            updateQuantity(product.id, existingItem.quantity + 1);
        } else {
            setCart([...cart, {
                product_id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                quantity: 1,
                max_stock: product.stock_quantity
            }]);
        }
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;

        const maxStock = cart.find(item => item.product_id === productId)?.max_stock;

        if (maxStock && newQuantity > maxStock) {
            toast.error(`Only ${maxStock} units available in stock.`);
            return;
        }

        setCart(cart.map(item =>
            item.product_id === productId ? { ...item, quantity: newQuantity } : item
        ));
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.product_id !== productId));
    };

    const handleSubmit = async () => {
        if (cart.length === 0) {
            toast.error('Please add at least one product to the order');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const payload = {
                items: cart.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity
                }))
            };

            await axios.post('/orders', payload);
            toast.success('Order placed successfully!');
            navigate('/orders');
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || 'Failed to create order';
            // If validation errors exist, show the first one
            if (err.response?.data?.errors?.items) {
                toast.error(err.response.data.errors.items[0]);
            } else if (err.response?.data?.errors?.stock) {
                toast.error(err.response.data.errors.stock[0]);
            } else {
                toast.error(errorMessage);
            }
            setError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8 container">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Create Order</h2>
                    <p className="text-muted-foreground mt-1">Add products to your cart and create a new order.</p>
                </div>
                <Button variant="outline" asChild>
                    <Link to="/orders">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
                    </Link>
                </Button>
            </div>

            {error && (
                <div className="mb-6 bg-destructive/15 text-destructive px-4 py-3 rounded-md flex items-center">
                    <span className="font-semibold mr-2">Error:</span> {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-6">
                    <ProductSelector onAddToCart={addToCart} />
                </div>

                <div className="lg:col-span-5">
                    <OrderCart
                        cart={cart}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeFromCart}
                        onSubmit={handleSubmit}
                        onCancel={() => navigate('/orders')}
                        submitting={submitting}
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderForm;
