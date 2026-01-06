# Test Task: Mini Order Management System (API)

## Task Description
Develop a full-stack Laravel application for a simple order management system (typical functionality for CRM/e-commerce projects).
**Using AI tools for code generation (Cursor, Claude Code, etc.) is one of the conditions for completing the test task.**

## Technical Requirements

### Backend

**Models and Relationships:**
*   **Product**: `name`, `price`, `stock_quantity`
*   **Order**: `status` (pending/confirmed/cancelled), `total_price`
*   **OrderItem**: `product_id`, `order_id`, `quantity`, `price_at_purchase`

**API Endpoints:**
1.  CRUD for Products.
2.  Create Order (with multiple items).
3.  Confirm Order (must decrease stock quantity).
4.  Order List with filtering by status and date range.

**Business Logic:**
*   Cannot order more than available in stock.
*   `price_at_purchase`: price at the moment of order creation (fixed when adding product).
*   `total_price`: calculated automatically based on order items.

### Frontend
**Screens to implement:**
1.  **Product List**: Table with pagination and search by name.
2.  **Product Form**: Create/Edit with validation error display.
3.  **Create Order**: Select products, enter quantity, automatic calculation of total amount.
4.  **Order List**: Table with filtering by status and date.

**Variant B - SPA (Vue/React):**
*   React 19+ (Chosen by User)
*   Integration with API via Axios or fetch
*   Basic routing (React Router)
*   Tailwind CSS

### Deliverables
*   GitHub link with code.
*   README with launch instructions.
*   Postman collection or API documentation (plus).

### Bonus (Optional for higher level)
*   Add Authentication.
*   Write 2-3 unit tests for logic.

## Evaluation Criteria

**Backend:**
*   **DB Design**: Correct migrations, relationships, indexes.
*   **Eloquent**: Relationships, eager loading, scopes.
*   **Business Logic**: Stock management, status transitions.
*   **API Design**: REST conventions, correct HTTP codes.
*   **Validation**: Form Requests, error handling.
*   **Code Quality**: Structure, naming, no anti-patterns.

**Frontend:**
*   **Component Structure**: Logical distribution, reuse.
*   **Forms**: Validation, error handling.
*   **UX**: States, messages, action confirmation.
*   **API Integration**: Correct request/error handling.
*   **Code Cleanliness**: Readability, consistency.
