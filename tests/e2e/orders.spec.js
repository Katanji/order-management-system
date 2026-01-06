import { test, expect } from '@playwright/test';

test('Order Flow: Create and View Order', async ({ page }) => {
    // 1. Check initial stock of the first product
    await page.goto('/products');
    const firstProductRow = page.locator('tbody tr').first();
    const stockCell = firstProductRow.locator('td').nth(3); // 4th column is Stock
    const stockText = await stockCell.innerText();
    const initialStock = parseInt(stockText.replace(' in stock', ''));
    console.log(`Initial Stock: ${initialStock}`);

    // Get product name to select it later
    const productName = await firstProductRow.locator('td').nth(1).innerText();
    console.log(`Product Name: ${productName}`);

    // 2. Go to Create Order page
    await page.goto('/orders/create');

    // 2b. Select the product we just checked
    // Debug: Check if the page loaded
    await expect(page.locator('h2', { hasText: 'Create Order' })).toBeVisible();

    // shadcn Select trigger has the placeholder text initially
    // We click the text directly which bubbles up
    const selectTrigger = page.getByText('Select a product...');
    await expect(selectTrigger).toBeVisible();
    await selectTrigger.click();

    // Select the specific product from the dropdown
    // Note: The select options might just show the name. 
    // We'll hope the first option is the same product or try to find by text.
    // For robust test, we finding the option with the product name
    const option = page.locator('[role="option"]', { hasText: productName }).first();
    await expect(option).toBeVisible();
    await option.click();

    // 3. Add to cart
    // We updated the button text to "Add to Order"
    await page.click('button:has-text("Add to Order")');

    // 4. Verify item in cart
    await expect(page.locator('h3', { hasText: 'Your Cart' })).toBeVisible();
    // Updated button text to "Place Order" (checking visibility)
    await expect(page.locator('button:has-text("Place Order")')).toBeVisible();

    // 5. Submit Order (Create Pending)
    await page.click('button:has-text("Place Order")');

    // 6. Verify redirect to Order List
    await expect(page).toHaveURL(/\/orders$/);

    // 7. Verify new order in list
    // We assume it's the top one
    const firstOrderRow = page.locator('tbody tr').first();
    await expect(firstOrderRow).toBeVisible();

    // 8. Go to details of the first order
    const viewButton = firstOrderRow.locator('a[href*="/orders/"]');
    await viewButton.click();

    // 9. Verify Order Details
    await expect(page.locator('h2', { hasText: 'Order Details' })).toBeVisible();
    // We expect the table to be visible with headers
    await expect(page.locator('th', { hasText: 'Product' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Quantity' })).toBeVisible();

    // Verify Price Display (Regression Test for NaN issue)
    // Assuming the product price is $2000.00 or similar. We should check that it is NOT NaN.
    const priceCell = page.locator('td').nth(2); // 3rd column: Price
    const totalCell = page.locator('td').nth(3); // 4th column: Total
    await expect(priceCell).not.toContainText('NaN');
    await expect(totalCell).not.toContainText('NaN');
    await expect(priceCell).toContainText('$'); // Should contain currency symbol

    // 10. Confirm Order (Deduct Stock)
    // Handle the browser confirmation dialog
    page.on('dialog', dialog => dialog.accept());

    // Click the actual Confirm button
    await page.click('button:has-text("Confirm Order")');

    // Wait for the status to update to Confirmed (Badge check)
    // "Confirmed" badge might be default variant or have specific text
    // OrderDetails.jsx doesn't explicitly have 'confirmed' in getStatusBadge switch (default case), 
    // but the backend sets 'confirmed'. Let's check for the text "confirmed" (case insensitive usually in Badge?)
    // Actually getStatusBadge has default case returning the status text.
    await expect(page.locator('.badge', { hasText: 'confirmed' }).or(page.getByText('confirmed'))).toBeVisible({ timeout: 5000 });

    // 11. Verify Stock Deduction
    await page.goto('/products');

    // Find the row for the specific product we ordered
    const productRow = page.locator('tbody tr', { hasText: productName });
    await expect(productRow).toBeVisible();

    // Re-fetch stock
    const newStockText = await productRow.locator('td').nth(3).innerText();
    const newStock = parseInt(newStockText.replace(' in stock', ''));
    console.log(`New Stock for ${productName}: ${newStock}`);

    // Verify it decreased by 1 (default quantity added was 1)
    expect(newStock).toBe(initialStock - 1);
});
