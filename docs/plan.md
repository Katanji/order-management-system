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
- [ ] Initialize Laravel Project.
- [ ] Setup Development Environment (DB, etc.).
- [ ] Install React, React Router, Axios, Tailwind CSS.
- [ ] Configure `vite.config.js` for React.

### Phase 2: Backend - Core Structure & Products
- [ ] Create Migrations: `products`, `orders`, `order_items`.
- [ ] Create Models: `Product` (with cast/fillable), `Order`, `OrderItem`.
- [ ] Define Relationships (`Order` hasMany `OrderItem`, `OrderItem` belongsTo `Product`).
- [ ] **API**: Product CRUD.
    - [ ] `ProductController` (index, store, show, update, destroy).
    - [ ] Form Requests (`StoreProductRequest`, `UpdateProductRequest`).
    - [ ] API Routes.

### Phase 3: Backend - Orders & Logic
- [ ] **API**: Order Placement.
    - [ ] `OrderController@store`.
    - [ ] Logic to validate stock, calculate totals, create `OrderItem`s.
    - [ ] DB Transaction for atomicity.
- [ ] **API**: Order Management.
    - [ ] `OrderController@index` (Filter by status, date).
    - [ ] `OrderController@confirm` (Status transition: Pending -> Confirmed).
        - [ ] Stock deduction logic.
        - [ ] Validation (ensure enough stock at confirmation time if not reserved earlier, or check SOW logic). *SOW says: "Confirm order (must decrease stock quantity)". Use DB transaction.*

### Phase 4: Frontend - Infrastructure
- [ ] Setup `App.jsx` and `MainLayout`.
- [ ] Configure `react-router-dom`.
- [ ] Create `ApiClient` (Axios instance with base URL).

### Phase 5: Frontend - Products
- [ ] Component: `ProductList` (Table, Search, Pagination).
- [ ] Component: `ProductForm` (Add/Edit Product).
- [ ] Integrate with Product API.

### Phase 6: Frontend - Orders
- [ ] Component: `OrderList` (Table, Filters).
- [ ] Component: `CreateOrder` (Complex form).
    - [ ] Dynamic product selection rows.
    - [ ] Live stock check (optional/nice to have) or just max quantity validation.
    - [ ] Auto-calculate total.
- [ ] Component: `OrderDetails` (optional, or modal).
- [ ] Implement "Confirm" action in `OrderList`.

### Phase 7: Bonus & Polish
- [ ] Implement Authentication (Laravel Sanctum + React Auth Context).
- [ ] Unit Tests (2-3 tests for Stock Logic).
- [ ] Validation feedback improvements (Toast notifications).
- [ ] Generate README.md.

## Tools to use
- `artisan`
- `npm`
- `cursor` / `antigravity` (me)
