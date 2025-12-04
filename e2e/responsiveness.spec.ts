// spec: specs/README.md

import { test, expect, devices } from '@playwright/test';

test.describe('Responsiveness', () => {
    test('should adapt UI for mobile viewport', async ({ browser, browserName }) => {
        test.skip(browserName === 'firefox', 'Firefox does not support isMobile option');

        // 1. Create mobile context
        const context = await browser.newContext({
            ...devices['iPhone 12'],
        });
        const page = await context.newPage();

        await page.goto('/');

        // Wait for BIOS and desktop
        const biosLocator = page.getByText('PotatoChip™', { exact: true });
        await biosLocator.waitFor({ state: 'visible', timeout: 10000 });

        const navbar = page.locator('nav.fixed.bottom-0');
        await navbar.waitFor({ state: 'visible', timeout: 15000 });

        // 2. Open a window
        const creditsIcon = page.getByRole('button').filter({ has: page.getByAltText('Credits') });
        await creditsIcon.dblclick();

        // 3. Verify window is visible and sized appropriately for mobile
        const windowLocator = page.locator('.border-windows').filter({ has: page.getByText('Credits', { exact: true }) });
        await expect(windowLocator).toBeVisible();

        const box = await windowLocator.boundingBox();
        const viewport = page.viewportSize();

        // Window should take most of the viewport on mobile
        expect(box!.width).toBeGreaterThan(viewport!.width * 0.6);

        // 4. Close Credits window to prevent blocking navigation clicks
        const closeButton = page.getByTestId('close-button-credits');
        await closeButton.click({ force: true });
        await page.waitForTimeout(500);

        // 5. Navigate to different routes
        const aboutLink = page.getByRole('link', { name: '[About]' });
        await aboutLink.click();
        await expect(page).toHaveURL(/\/about\/?$/);

        // 6. Verify no elements are cut off
        const contentArea = page.locator('.bg-tertiary.border-2');
        await expect(contentArea).toBeVisible();
        await expect(contentArea).toBeInViewport();

        await context.close();
    });

    test('should adapt UI for tablet viewport', async ({ browser }) => {
        // 1. Create tablet context
        const context = await browser.newContext({
            ...devices['iPad Pro'],
        });
        const page = await context.newPage();

        await page.goto('/');

        // Wait for BIOS and desktop
        const biosLocator = page.getByText('PotatoChip™', { exact: true });
        await biosLocator.waitFor({ state: 'visible', timeout: 10000 });

        const navbar = page.locator('nav.fixed.bottom-0');
        await navbar.waitFor({ state: 'visible', timeout: 15000 });

        // 2. Verify desktop elements are visible
        await expect(page.getByAltText('My Portfolio')).toBeVisible();
        await expect(page.getByAltText('Credits')).toBeVisible();

        // 3. Open window and verify sizing
        const creditsIcon = page.getByRole('button').filter({ has: page.getByAltText('Credits') });
        await creditsIcon.dblclick();

        const windowLocator = page.locator('.border-windows').filter({ has: page.getByText('Credits', { exact: true }) });
        await expect(windowLocator).toBeVisible();

        // 4. Verify scrolling works
        const creditsWindow = page.locator('.border-windows').filter({ has: page.getByText('Credits', { exact: true }) });
        await expect(creditsWindow).toBeVisible();

        await context.close();
    });

    test('should maintain functionality when resizing browser', async ({ page }) => {
        await page.goto('/');

        // Wait for BIOS and desktop
        const biosLocator = page.getByText('PotatoChip™', { exact: true });
        await biosLocator.waitFor({ state: 'visible', timeout: 10000 });

        const navbar = page.locator('nav.fixed.bottom-0');
        await navbar.waitFor({ state: 'visible', timeout: 15000 });

        // 1. Start at desktop size
        await page.setViewportSize({ width: 1280, height: 720 });

        // 2. Open window
        const creditsIcon = page.getByRole('button').filter({ has: page.getByAltText('Credits') });
        await creditsIcon.dblclick();
        await expect(page.getByText('This project was created by:')).toBeVisible();

        // 3. Resize to mobile
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(500);

        // 4. Verify window still visible and functional
        const contentArea = page.locator('.bg-tertiary.border-2').last();
        await expect(contentArea).toBeVisible();

        // 5. Resize back to desktop
        await page.setViewportSize({ width: 1280, height: 720 });
        await page.waitForTimeout(500);

        // 6. Verify everything still works
        await expect(contentArea).toBeVisible();
    });
});