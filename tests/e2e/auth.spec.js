import { test, expect } from '@playwright/test';

test('Logout flow', async ({ page }) => {
    page.on('console', msg => {
        const text = msg.text();
        if (!text.includes('401 (Unauthorized)')) {
            console.log(`BROWSER LOG: ${text}`);
        }
    });
    // 0. Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/$/);

    // 1. Click Logout
    await page.click('button:has-text("Logout")');

    // 2. Expect redirect to login
    await expect(page).toHaveURL(/\/login$/);
});
