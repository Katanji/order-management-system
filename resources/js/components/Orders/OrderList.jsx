import React, { useState, useEffect } from 'react';
import axios from '../../lib/axios';
import { Link } from 'react-router-dom';
import PageLayout from '../PageLayout';
import DataTable from '../DataTable';
import { TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye } from "lucide-react"

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

    if (error) return <div className="container mx-auto py-10 text-center text-destructive">{error}</div>;

    const columns = [
        { header: 'ID', className: 'w-[80px]' },
        { header: 'Customer' },
        { header: 'Total', className: 'text-right' },
        { header: 'Status' },
        { header: 'Date' },
        { header: 'Actions', className: 'text-right' },
    ];

    const renderRow = (order) => (
        <TableRow key={order.id}>
            <TableCell className="font-medium bg-muted/50 p-2 rounded-sm text-xs w-fit">
                {order.id}
            </TableCell>
            <TableCell>System User</TableCell>
            <TableCell className="font-bold text-right">
                ${parseFloat(order.total_price).toFixed(2)}
            </TableCell>
            <TableCell>
                <Badge variant={
                    order.status === 'confirmed' ? 'default' :
                        order.status === 'pending' ? 'secondary' : 'destructive'
                }>
                    {order.status}
                </Badge>
            </TableCell>
            <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
                <Button variant="ghost" size="icon" asChild>
                    <Link to={`/orders/${order.id}`}>
                        <Eye className="h-4 w-4" />
                    </Link>
                </Button>
            </TableCell>
        </TableRow>
    );

    const actions = (
        <Button asChild>
            <Link to="/orders/create">
                <Plus className="mr-2 h-4 w-4" /> Create Order
            </Link>
        </Button>
    );

    return (
        <PageLayout title="Orders" actions={actions}>
            <DataTable
                columns={columns}
                data={orders}
                loading={loading}
                emptyMessage="No orders found."
                renderRow={renderRow}
                pagination={{
                    currentPage,
                    totalPages,
                    onPageChange: setCurrentPage
                }}
            />
        </PageLayout>
    );
};

export default OrderList;
