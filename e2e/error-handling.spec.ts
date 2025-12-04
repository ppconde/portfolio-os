// spec: specs/README.md

import { test, expect } from '@playwright/test';

test.describe('Error Handling', () => {
    test('should display error page for non-existent route', async ({ page }) => {
        // 1. Navigate to a non-existent route
        await page.goto('/this-route-does-not-exist');

        // 2. Verify error page is shown (BlueScreen)
        await expect(page.getByText('A problem has been detected')).toBeVisible({ timeout: 5000 });
        await expect(page.getByText('Ppconde OS')).toBeVisible();

        // 3. Verify error details are present
        await expect(page.getByText(/Error:/)).toBeVisible();

        // 4. Take screenshot of error page
        await expect(page).toHaveScreenshot('error-404.png', {
            fullPage: true,
            animations: 'disabled',
        });
    });

    test('should not crash the app on error', async ({ page }) => {
        // 1. Navigate to non-existent route
        await page.goto('/invalid-route-test');

        // 2. Verify BlueScreen appears
        await expect(page.getByText('A problem has been detected')).toBeVisible({ timeout: 5000 });

        // 3. Verify page is still responsive (not frozen)
        const errorHeader = page.getByText('Ppconde OS');
        await expect(errorHeader).toBeVisible();

        // 4. Verify we can navigate back
        await page.goto('/');

        // Should be able to boot normally
        const biosLocator = page.getByText('PotatoChip™', { exact: true });
        await biosLocator.waitFor({ state: 'visible', timeout: 10000 });

        const navbar = page.locator('nav.fixed.bottom-0');
        await navbar.waitFor({ state: 'visible', timeout: 15000 });

        await expect(navbar).toBeVisible();
    });
});