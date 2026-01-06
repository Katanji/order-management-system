# Test Task: Mini Order Management System (API)

## Task Description
[cite_start]Develop a full-stack Laravel application for a simple order management system (typical functionality for CRM/e-commerce projects)[cite: 3].

[cite_start]**Important Condition:** The use of AI tools for code generation (Cursor, Claude Code, etc.) is one of the conditions for completing this test task[cite: 4].

---

## Technical Requirements

### [cite_start]Backend [cite: 6]

#### [cite_start]Models and Relationships [cite: 7]
* [cite_start]**Product:** `name`, `price`, `stock_quantity`[cite: 8].
* [cite_start]**Order:** `status` (pending/confirmed/cancelled), `total_price`[cite: 9].
* [cite_start]**Order Item:** `product_id`, `order_id`, `quantity`, `price_at_purchase`[cite: 10].

#### [cite_start]API Endpoints [cite: 11]
1.  [cite_start]**CRUD for Products** (Product)[cite: 12].
2.  [cite_start]**Create Order** (with multiple products)[cite: 13].
3.  [cite_start]**Confirm Order** (must reduce stock quantity)[cite: 14].
4.  [cite_start]**Order List** with filtering by status and date range[cite: 15].

#### [cite_start]Business Logic [cite: 16]
* [cite_start]It is not possible to order more items than are currently in stock[cite: 17].
* [cite_start]`price_at_purchase`: The price at the moment of order creation (fixed when the product is added)[cite: 19].
* [cite_start]`total_price`: Calculated automatically based on the order items[cite: 20].

---

### [cite_start]Frontend [cite: 21]

#### [cite_start]Screens for Implementation [cite: 22]
1.  [cite_start]**Product List:** Table with pagination and search by name[cite: 23].
2.  [cite_start]**Product Form:** Creation/editing with validation error display[cite: 24].
3.  [cite_start]**Create Order:** Select products, enter quantity, automatic total sum calculation[cite: 25].
4.  [cite_start]**Order List:** Table with filtering by status and date[cite: 26].

#### Technology Stack Options

[cite_start]**Option A - Server-side (Blade + Livewire)[cite: 27]:**
* Use of layouts and blade-components.
* Livewire for reactive forms and search.
* Tailwind CSS or another CSS framework.

[cite_start]**Option B - SPA (Vue/React)[cite: 29]:**
* [cite_start]Vue 3 (Composition API) or React 19+[cite: 30].
* Integration with API via Axios or fetch.
* [cite_start]Basic routing (Vue Router / React Router)[cite: 31].
* Tailwind CSS or another CSS framework.

---

## [cite_start]Deliverables [cite: 32]
* [cite_start]Link to GitHub with the code[cite: 33].
* [cite_start]README with launch instructions[cite: 34].
* [cite_start]Postman collection or API documentation (considered a plus)[cite: 35].

### [cite_start]Additional Tasks (Optional) [cite: 36]
*For candidates who want to demonstrate a higher level:*
* [cite_start]Add Authentication[cite: 38].
* [cite_start]Write 2-3 unit tests for logic of your choice[cite: 39].

---

## [cite_start]Evaluation Criteria [cite: 40]

### [cite_start]Backend [cite: 41]

| What is Evaluated | Focus Areas |
| :--- | :--- |
| **DB Design** | [cite_start]Correct migrations, relationships, indexes [cite: 42] |
| **Work with Eloquent** | [cite_start]Relationships, eager loading, scopes [cite: 42] |
| **Business Logic** | [cite_start]Inventory management, status transitions [cite: 42] |
| **API Design** | [cite_start]REST conventions, correct HTTP codes [cite: 42] |
| **Validation** | [cite_start]Form Requests, error handling [cite: 42] |
| **Code Quality** | [cite_start]Structure, naming, absence of anti-patterns [cite: 43] |

### [cite_start]Frontend [cite: 44]

| What is Evaluated | Focus Areas |
| :--- | :--- |
| **Component Structure** | [cite_start]Logical distribution, reusability [cite: 45] |
| **Work with Forms** | [cite_start]Validation, error handling [cite: 45] |
| **UX** | [cite_start]States, messages, action confirmations [cite: 45] |
| **API Integration** | [cite_start]Correct handling of requests and errors [cite: 45] |
| **Code Cleanliness** | [cite_start]Readability, consistency [cite: 45] |