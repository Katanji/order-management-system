import React, { useState, useEffect } from 'react';
import axios from '../../lib/axios';
import { useParams, Link } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ArrowLeft, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react"

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/orders/${id}`);
            setOrder(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch order details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return <Badge className="bg-green-600 hover:bg-green-700"><CheckCircle className="w-3 h-3 mr-1" /> Completed</Badge>;
            case 'pending':
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
            case 'cancelled':
                return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <XCircle className="h-12 w-12 text-destructive" />
            <p className="text-xl font-semibold text-destructive">{error}</p>
            <Button variant="outline" asChild>
                <Link to="/orders">Back to Orders</Link>
            </Button>
        </div>
    );

    if (!order) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <p className="text-xl font-medium">Order not found</p>
            <Button variant="outline" asChild>
                <Link to="/orders">Back to Orders</Link>
            </Button>
        </div>
    );

    const handleConfirmOrder = async () => {
        if (!confirm('Are you sure you want to confirm this order? Stock will be deducted.')) return;

        try {
            await axios.post(`/orders/${id}/confirm`);
            await fetchOrder(); // Refresh to see new status
        } catch (err) {
            console.error(err);
            alert('Failed to confirm order: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 container">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Order Details</h2>
                    <p className="text-muted-foreground mt-1">View details for order #{order.id}</p>
                </div>
                <Button variant="outline" asChild>
                    <Link to="/orders">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">Order #{order.id}</CardTitle>
                            <CardDescription>
                                Placed on {new Date(order.created_at).toLocaleString()}
                            </CardDescription>
                        </div>
                        <div>
                            {getStatusBadge(order.status)}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-center">Quantity</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.items && order.items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            {item.product ? item.product.name : <span className="text-muted-foreground italic">Unknown Product</span>}
                                        </TableCell>
                                        <TableCell className="text-center">{item.quantity}</TableCell>
                                        <TableCell className="text-right">${parseFloat(item.price_at_purchase).toFixed(2)}</TableCell>
                                        <TableCell className="text-right font-bold">${(item.price_at_purchase * item.quantity).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                <CardFooter className="bg-muted/50 p-6">
                    <div className="flex w-full items-center justify-between">
                        <span className="text-lg font-medium text-muted-foreground">Total Amount</span>
                        <span className="text-3xl font-bold">${parseFloat(order.total_price).toFixed(2)}</span>
                    </div>
                </CardFooter>
            </Card>

            {order.status === 'pending' && (
                <div className="mt-6 flex justify-end">
                    <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={handleConfirmOrder}
                    >
                        Confirm Order
                    </Button>
                </div>
            )}
        </div>
    );
};

export default OrderDetails;
