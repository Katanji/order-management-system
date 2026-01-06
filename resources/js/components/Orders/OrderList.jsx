import React, { useState, useEffect } from 'react';
import axios from '../../lib/axios';
import { Link } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchOrders = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`/orders?page=${page}`);
            setOrders(response.data.data);
            setCurrentPage(response.data.current_page);
            setTotalPages(response.data.last_page);
            setError(null);
        } catch (err) {
            setError('Failed to fetch orders');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage]);

    if (loading && orders.length === 0) return <div className="text-center py-10">Loading orders...</div>;
    if (error) return <div className="text-center py-10 text-destructive">{error}</div>;

    return (
        <Card className="border-0 shadow-none">
            <CardHeader className="px-0 pt-0">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold">Recent Orders</CardTitle>
                    <Button asChild>
                        <Link to="/orders/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Order
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="px-0">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium bg-muted/50 p-2 rounded-sm text-xs text-center">#{order.id}</TableCell>
                                        <TableCell>System User</TableCell>
                                        <TableCell className="font-bold">
                                            ${parseFloat(order.total_price).toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                order.status === 'completed' ? 'default' :
                                                    order.status === 'pending' ? 'secondary' : 'destructive'
                                            }>
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link to={`/orders/${order.id}`}>
                                                    View Details
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default OrderList;
