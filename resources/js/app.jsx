import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './components/Layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import ProductForm from './components/Products/ProductForm';
import OrderForm from './components/Orders/OrderForm';
import OrderDetails from './components/Orders/OrderDetails';
import OrderList from './pages/OrderList';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Dashboard />} />
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
    );
}

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
