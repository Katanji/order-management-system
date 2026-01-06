import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../lib/axios';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2 } from "lucide-react"

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset to first page on search
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchProducts();
    }, [page, debouncedSearch]);

    const fetchProducts = () => {
        setLoading(true);
        apiClient.get('/products', {
            params: {
                page,
                search: debouncedSearch,
            }
        })
            .then(response => {
                setProducts(response.data.data);
                setLastPage(response.data.last_page);
            })
            .catch(error => console.error('Error fetching products:', error))
            .finally(() => setLoading(false));
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await apiClient.delete(`/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product. It might be attached to existing orders.');
        }
    };

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold tracking-tight">Products</h2>
                <Button asChild>
                    <Link to="/products/create">
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Product Inventory</CardTitle>
                        <div className="relative w-72">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : products.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            No products found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium bg-muted/50 p-2 rounded-sm w-fit text-xs text-center">{product.id}</TableCell>
                                            <TableCell className="font-medium">{product.name}</TableCell>
                                            <TableCell>${parseFloat(product.price).toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Badge variant={product.stock_quantity > 0 ? "secondary" : "destructive"}>
                                                    {product.stock_quantity} in stock
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" asChild className="mr-2">
                                                    <Link to={`/products/${product.id}/edit`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(product.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {lastPage > 1 && (
                        <div className="flex items-center justify-end space-x-2 py-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {page} of {lastPage}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(lastPage, p + 1))}
                                disabled={page === lastPage}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
