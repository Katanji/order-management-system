import { test, expect } from '@playwright/test';

test('Product List loads and displays products', async ({ page }) => {
    // 0. Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/$/); // Expect redirect to home/dashboard

    // 1. Go to the products page
    await page.goto('/products');

    // 2. Wait for the products table
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('table')).toBeVisible({ timeout: 10000 });

    // 3. Check for the "Add Product" link
    await expect(page.locator('a', { hasText: 'Add Product' })).toBeVisible();

    // 4. Check for at least one product row (we added MacBook earlier)
    await expect(page.locator('td', { hasText: 'MacBook' }).first()).toBeVisible();
    await expect(page.locator('td', { hasText: '$2000' }).first()).toBeVisible();

    // 5. Take a screenshot for validaton
    await page.screenshot({ path: 'storage/e2e-product-list.png' });
});

test('Create Product flow', async ({ page }) => {
    // 0. Login first (if not shared context, which it isn't by default mostly)
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/$/);

    const productName = `Test Product ${Date.now()}`;

    await page.goto('/products/create');
    await expect(page.locator('h2')).toContainText('Create Product');

    await page.fill('input[name="name"]', productName);
    await page.fill('input[name="price"]', '150');
    await page.fill('input[name="stock_quantity"]', '50');

    await page.click('button[type="submit"]');

    // Should redirect to product list
    await expect(page).toHaveURL(/\/products$/);

    // Should see the new product
    await expect(page.locator('td', { hasText: productName })).toBeVisible();
});
