import './bootstrap';
import '../css/app.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded shadow-md">
                    <h1 className="text-2xl font-bold text-blue-600 mb-4">Hello React 19 + Laravel!</h1>
                    <p className="text-gray-700">Order Management System is initializing...</p>
                </div>
            </div>
        </BrowserRouter>
    );
}

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
