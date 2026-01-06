import React, { useState, useEffect } from 'react';
import axios from '../../lib/axios';
import { Link } from 'react-router-dom';
import PageLayout from '../PageLayout';
import DataTable from '../DataTable';
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, X } from "lucide-react"

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [status, setStatus] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const fetchOrders = async (page = 1) => {
        setLoading(true);
        try {
            const params = { page };
            if (status && status !== 'all') params.status = status;
            if (dateFrom) params.date_from = dateFrom;
            if (dateTo) params.date_to = dateTo;

            const response = await axios.get('/orders', { params });
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

    const resetFilters = () => {
        setStatus('all');
        setDateFrom('');
        setDateTo('');
        setCurrentPage(1);
    };

    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage, status, dateFrom, dateTo]);

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
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="w-full md:w-[200px]">
                    <Select value={status} onValueChange={(val) => { setStatus(val); setCurrentPage(1); }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full md:w-[200px]">
                    <Input
                        type="date"
                        placeholder="From Date"
                        value={dateFrom}
                        onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
                        className="block"
                    />
                </div>
                <div className="w-full md:w-[200px]">
                    <Input
                        type="date"
                        placeholder="To Date"
                        value={dateTo}
                        onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
                        className="block"
                    />
                </div>
                {(status !== 'all' || dateFrom || dateTo) && (
                    <Button variant="ghost" onClick={resetFilters} className="px-2">
                        <X className="mr-2 h-4 w-4" /> Reset
                    </Button>
                )}
            </div>
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
