import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/Layouts/MainLayout';
import ProductList from './pages/ProductList';
import ProductForm from './components/Products/ProductForm';
import OrderForm from './components/Orders/OrderForm';
import OrderDetails from './components/Orders/OrderDetails';
import OrderList from './pages/OrderList';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
    return (
        <AuthProvider>
            <Toaster richColors position="top-right" />
            <BrowserRouter>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected routes */}
                    <Route path="/" element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<OrderList />} />
                        <Route path="products" element={<ProductList />} />
                        <Route path="products/create" element={<ProductForm />} />
                        <Route path="products/:id/edit" element={<ProductForm />} />

                        {/* Orders */}
                        <Route path="orders" element={<OrderList />} />
                        <Route path="orders/create" element={<OrderForm />} />
                        <Route path="orders/:id" element={<OrderDetails />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}

