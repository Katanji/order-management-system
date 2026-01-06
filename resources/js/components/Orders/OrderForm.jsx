import React, { useState, useEffect } from 'react';
import axios from '../../lib/axios';
import { useNavigate, Link } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator" // I might need to create this if I use it, but I can use <hr className="my-4" /> or border-b for now. I'll stick to border utils or instal separator. I'll avoid importing Separator if not installed.
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Plus, Trash2, ShoppingCart, Loader2, Minus, ArrowLeft } from "lucide-react"

const OrderForm = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/products?per_page=100');
            setProducts(response.data.data);
        } catch (err) {
            console.error(err);
            setError('Failed to load products');
        }
    };

    const addToCart = () => {
        if (!selectedProductId) return;

        const product = products.find(p => p.id === parseInt(selectedProductId));
        if (!product) return;

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
        setSelectedProductId('');
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;

        const product = products.find(p => p.id === productId);
        if (newQuantity > product.stock_quantity) {
            alert(`Only ${product.stock_quantity} units available in stock.`);
            return;
        }

        setCart(cart.map(item =>
            item.product_id === productId ? { ...item, quantity: newQuantity } : item
        ));
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.product_id !== productId));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cart.length === 0) {
            setError('Please add at least one product to the order');
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
            navigate('/orders');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to create order');
            }
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
                {/* Product Selection Panel */}
                <div className="lg:col-span-7 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add Products</CardTitle>
                            <CardDescription>Select products from the catalog to add to your order.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col gap-4">
                                <div className="grid w-full items-center gap-1.5">
                                    <Select value={selectedProductId} onValueChange={setSelectedProductId}>
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
                                <Button onClick={addToCart} disabled={!selectedProductId} className="w-full sm:w-auto">
                                    <Plus className="mr-2 h-4 w-4" /> Add to Order
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Cart / Order Summary Panel */}
                <div className="lg:col-span-5">
                    <Card className="h-full flex flex-col">
                        <CardHeader className="bg-muted/50 pb-4">
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center">
                                    <ShoppingCart className="mr-2 h-5 w-5" /> Your Cart
                                </span>
                                {cart.length > 0 && (
                                    <span className="text-sm font-medium bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                                        {cart.reduce((acc, item) => acc + item.quantity, 0)} items
                                    </span>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 overflow-y-auto max-h-[500px]">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                                    <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
                                    <p className="text-lg font-medium">Your cart is empty</p>
                                    <p className="text-sm">Add items to view them here.</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead className="text-center">Qty</TableHead>
                                            <TableHead className="text-right">Price</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {cart.map((item) => (
                                            <TableRow key={item.product_id}>
                                                <TableCell className="font-medium">
                                                    <div className="line-clamp-1">{item.name}</div>
                                                    <div className="text-xs text-muted-foreground">${item.price.toFixed(2)}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-center space-x-1">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-6 w-6"
                                                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-6 w-6"
                                                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-bold">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => removeFromCart(item.product_id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                        {cart.length > 0 && (
                            <CardFooter className="flex flex-col gap-4 border-t bg-muted/50 p-6">
                                <div className="flex w-full justify-between items-center">
                                    <span className="text-muted-foreground">Total</span>
                                    <span className="text-2xl font-bold">${calculateTotal()}</span>
                                </div>
                                <div className="flex w-full gap-4">
                                    <Button variant="outline" className="w-full" onClick={() => navigate('/orders')}>
                                        Cancel
                                    </Button>
                                    <Button
                                        className="w-full"
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                    >
                                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Place Order
                                    </Button>
                                </div>
                            </CardFooter>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default OrderForm;
