# Implementation Plan: Order Management System

## Goal
Develop a full-stack Order Management System using Laravel (API) and React (SPA) based on the provided SOW.

## Architecture
*   **Backend**: Laravel 11.x (API Mode)
*   **Frontend**: React 19+ (SPA with React Router)
*   **Database**: PostgreSQL (User requested)
*   **Styling**: Tailwind CSS

## Steps

### Phase 1: Setup & Configuration
- [x] Initialize Laravel Project.
- [x] Setup Development Environment (DB, etc.).
- [x] Install React, React Router, Axios, Tailwind CSS.
- [x] Configure `vite.config.js` for React.

### Phase 2: Backend - Core Structure & Products
- [x] Create Migrations: `products`, `orders`, `order_items`.
- [x] Create Models: `Product` (with cast/fillable), `Order`, `OrderItem`.
- [x] Define Relationships (`Order` hasMany `OrderItem`, `OrderItem` belongsTo `Product`).
- [x] **API**: Product CRUD.
    - [x] `ProductController` (index, store, show, update, destroy).
    - [x] Form Requests (`StoreProductRequest`, `UpdateProductRequest`).
    - [x] API Routes.

### Phase 3: Backend - Orders & Logic
- [x] **API**: Order Placement.
    - [x] `OrderController@store`.
    - [x] Logic to validate stock, calculate totals, create `OrderItem`s.
    - [x] DB Transaction for atomicity.
- [x] **API**: Order Management.
    - [x] `OrderController@index` (Filter by status, date).
    - [x] `OrderController@confirm` (Status transition: Pending -> Confirmed).
        - [x] Stock deduction logic.
        - [x] Validation (ensure enough stock at confirmation time if not reserved earlier, or check SOW logic). *SOW says: "Confirm order (must decrease stock quantity)". Use DB transaction.*

### Phase 4: Frontend - Infrastructure
- [x] Setup `App.jsx` and `MainLayout`.
- [x] Configure `react-router-dom`.
- [x] Create `ApiClient` (Axios instance with base URL).

### Phase 5: Frontend - Products
- [x] Component: `ProductList` (Table, Search, Pagination).
- [x] Component: `ProductForm` (Add/Edit Product).
- [x] Integrate with Product API.

### Phase 6: Frontend - Orders
- [x] Component: `OrderList` (Table, Filters).
- [x] Component: `CreateOrder` (Complex form).
    - [x] Dynamic product selection rows.
    - [x] Max quantity validation.
    - [x] Auto-calculate total.
- [x] Component: `OrderDetails` with Confirm action.
- [x] E2E tests for order flow.

### Phase 7: Bonus & Polish
- [x] Implement Authentication (Laravel Sanctum + React Auth Context).
- [x] Unit Tests (2-3 tests for Stock Logic).
- [x] Validation feedback improvements (Toast notifications).
- [x] Generate README.md.

