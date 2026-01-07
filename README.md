# Order Management System

A full-stack Order Management System built with **Laravel 12** (Backend) and **React 19** (Frontend).

## 🚀 Features

- **Product Management**: Create, read, update, and delete products. **Case-insensitive search supported.**
- **Order Management**: Create orders, view details, **filter by status/date**, and confirm orders with stock deduction.
- **Cancel Orders**: Users can cancel pending orders before they are processed.
- **Stock Control**: Atomic stock updates using database transactions.
- **SPA Frontend**: Fast and responsive UI built with React, Vite, and Tailwind CSS.
- **Dockerized Environment**: Easy setup using Laravel Sail (Docker).

## 🛠 Tech Stack

- **Backend**: Laravel 11, PostgreSQL
- **Frontend**: React 19, Tailwind CSS, Vite
- **Testing**: PHPUnit (Backend), Playwright (E2E)
- **Containerization**: Docker, Laravel Sail

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd order-management-system
   ```

2. **Install PHP dependencies**
   ```bash
   docker run --rm \
       -u "$(id -u):$(id -g)" \
       -v "$(pwd):/var/www/html" \
       -w /var/www/html \
       laravelsail/php84-composer:latest \
       composer install --ignore-platform-reqs
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   ./vendor/bin/sail up -d
   ./vendor/bin/sail artisan key:generate
   ```

4. **Install Node dependencies & Build assets**
   ```bash
   npm install
   npm run build
   ```

5. **Run Migrations & Seed Database**
   ```bash
   ./vendor/bin/sail artisan migrate --seed
   ```

The application will be available at: [http://localhost:8085](http://localhost:8085)

**Test credentials:** `test@example.com` / `password`

## 🧪 Running Tests

### Backend Tests (PHPUnit)
Run unit and feature tests for the API:
```bash
./vendor/bin/sail test
```

### E2E Tests (Playwright)
Run end-to-end browser tests to verify the frontend integration.

**Option 1: Run Headless (Fast)**
```bash
npx playwright test
```

**Option 2: Run Headed (Visual)**
To see the browser and watch tests execute (useful for debugging):
```bash
npx playwright test --headed
```
*Note: Configured with `slowMo: 1000` for better visibility.*

## 🔧 Useful Commands

### Laravel Sail
- **Start containers**: `./vendor/bin/sail up -d`
- **Stop containers**: `./vendor/bin/sail down`
- **Rebuild containers**: `./vendor/bin/sail build --no-cache`

### Artisan (Laravel)
- **Create Controller**: `./vendor/bin/sail artisan make:controller Api/NewController`
- **Create Model + Migration**: `./vendor/bin/sail artisan make:model NewModel -m`
- **Clear Cache**: `./vendor/bin/sail artisan optimize:clear`
- **Run Migrations**: `./vendor/bin/sail artisan migrate`

### Frontend (Vite/NPM)
- **Install packages**: `./vendor/bin/sail npm install <package>` or `npm install <package>` (if Node is local)
- **Build for production**: `./vendor/bin/sail npm run build`
- **Watch for changes**: `./vendor/bin/sail npm run dev`

### Database
- The PostgreSQL database runs on port **5433** (to avoid conflicts).
- Connection details are in `.env`.

## 📂 Project Structure

- `app/Models`: Eloquent models (Product, Order, OrderItem).
- `app/Http/Controllers/Api`: API Controllers.
- `resources/js`: React application source code.
  - `pages`: Page components (Dashboard, ProductList, etc.).
  - `components`: Reusable UI components.
  - `layouts`: App layouts.
- `routes/api.php`: API routes definition.
- `tests/e2e`: Playwright E2E tests.
