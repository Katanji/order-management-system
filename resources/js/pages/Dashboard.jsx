import React, { useState, useEffect } from 'react';
import axios from '../lib/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import {
    DollarSign,
    ShoppingBag,
    Package,
    ArrowUpRight,
    ArrowRight
} from "lucide-react";

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);

    // Mock data for chart - in a real app this would come from API
    const chartData = [
        { name: 'Mon', total: 1200 },
        { name: 'Tue', total: 2100 },
        { name: 'Wed', total: 800 },
        { name: 'Thu', total: 1600 },
        { name: 'Fri', total: 2400 },
        { name: 'Sat', total: 3200 },
        { name: 'Sun', total: 2800 },
    ];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // In a real app, I'd have a specific dashboard endpoint.
                // For now, I'll fetch lists and aggregate manually to simulate it.
                const [productsRes, ordersRes] = await Promise.all([
                    axios.get('/products?per_page=1'), // Just need count
                    axios.get('/orders?per_page=5')
                ]);

                // Calculate mock totals if API doesn't return them directly
                // (Assuming the API follows Laravel pagination structure)
                const totalProducts = productsRes.data.meta ? productsRes.data.meta.total : productsRes.data.length;
                const totalOrders = ordersRes.data.meta ? ordersRes.data.meta.total : ordersRes.data.length;
                const recentOrders = ordersRes.data.data;

                // Mock revenue as I don't have a sum endpoint yet
                const totalRevenue = 15430.50;

                setStats({
                    totalRevenue,
                    totalOrders,
                    totalProducts,
                    recentOrders
                });
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Overview of your store's performance.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button asChild>
                        <Link to="/orders/create">
                            <ArrowUpRight className="mr-2 h-4 w-4" />
                            New Order
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Orders
                        </CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{stats.totalOrders}</div>
                        <p className="text-xs text-muted-foreground">
                            +180.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Products in Stock
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{stats.totalProducts}</div>
                        <p className="text-xs text-muted-foreground">
                            12 items low on stock
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>
                            You made {stats.recentOrders.length} sales this month.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {stats.recentOrders.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No recent orders.</p>
                            ) : (
                                stats.recentOrders.map(order => (
                                    <div key={order.id} className="flex items-center">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                Order #{order.id}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {order.customer_name || 'System User'}
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium">
                                            +${parseFloat(order.total_price).toFixed(2)}
                                        </div>
                                    </div>
                                ))
                            )}
                            <Button variant="outline" className="w-full" asChild>
                                <Link to="/orders">
                                    View All Orders <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
