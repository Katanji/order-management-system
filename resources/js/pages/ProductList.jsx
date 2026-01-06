import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../lib/axios';
import PageLayout from '../components/PageLayout';
import DataTable from '../components/DataTable';
import { TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchProducts();
    }, [page, debouncedSearch]);

    const fetchProducts = () => {
        setLoading(true);
        apiClient.get('/products', {
            params: { page, search: debouncedSearch }
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
            alert('Failed to delete product.');
        }
    };

    const columns = [
        { header: 'ID', className: 'w-[80px]' },
        { header: 'Name' },
        { header: 'Price', className: 'text-right' },
        { header: 'Stock' },
        { header: 'Actions', className: 'text-right' },
    ];

    const renderRow = (product) => (
        <TableRow key={product.id}>
            <TableCell className="font-medium bg-muted/50 p-2 rounded-sm text-xs w-fit">
                {product.id}
            </TableCell>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell className="text-right">${parseFloat(product.price).toFixed(2)}</TableCell>
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
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(product.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </TableCell>
        </TableRow>
    );

    const actions = (
        <>
            <div className="relative w-72">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8"
                />
            </div>
            <Button asChild>
                <Link to="/products/create">
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                </Link>
            </Button>
        </>
    );

    return (
        <PageLayout title="Products" actions={actions}>
            <DataTable
                columns={columns}
                data={products}
                loading={loading}
                emptyMessage="No products found."
                renderRow={renderRow}
                pagination={{
                    currentPage: page,
                    totalPages: lastPage,
                    onPageChange: setPage
                }}
            />
        </PageLayout>
    );
}
