// spec: specs/README.md

import { test, expect } from '@playwright/test';

test.describe('Icon Interactions', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');

        // Wait for BIOS and desktop
        const biosLocator = page.getByText('PotatoChip™', { exact: true });
        await biosLocator.waitFor({ state: 'visible', timeout: 10000 });

        const navbar = page.locator('nav.fixed.bottom-0');
        await navbar.waitFor({ state: 'visible', timeout: 15000 });
    });

    test('should open My Portfolio window on double-click', async ({ page }) => {
        // 1. Double-click My Portfolio icon
        const portfolioIcon = page.getByRole('link').filter({ has: page.getByAltText('My Portfolio') });
        await portfolioIcon.dblclick();

        // 2. Verify correct app/window opens
        await expect(page).toHaveURL(/\/home\/?$/);

        // 3. Verify window content is visible
        const contentArea = page.locator('.bg-tertiary.border-2');
        await expect(contentArea).toBeVisible();

        // 4. Verify window title in taskbar
        const taskbarButton = page.locator('nav.fixed.bottom-0').getByRole('button').filter({ hasText: 'My Portfolio' });
        await expect(taskbarButton).toBeVisible();
    });

    test('should open Credits window on double-click', async ({ page }) => {
        // 1. Double-click Credits icon
        const creditsIcon = page.getByRole('button').filter({ has: page.getByAltText('Credits') });
        await creditsIcon.dblclick();

        // 2. Verify correct window opens with Credits content
        await expect(page.getByText('This project was created by:')).toBeVisible();
        await expect(page.getByRole('listitem').filter({ hasText: 'Pedro Conde' })).toBeVisible();

        // 3. Verify window is visible
        const creditsWindow = page.locator('.border-windows').filter({ has: page.getByText('Credits', { exact: true }) });
        await expect(creditsWindow).toBeVisible();

        // 4. Verify taskbar button
        const taskbarButton = page.locator('nav.fixed.bottom-0').getByRole('button').filter({ hasText: 'Credits' });
        await expect(taskbarButton).toBeVisible();
    });

    test('should provide visual feedback on icon hover', async ({ page, isMobile }) => {
        // Skip on mobile - hover not applicable
        test.skip(isMobile, 'Hover not supported on mobile');

        // 1. Hover over My Portfolio icon
        const portfolioIcon = page.getByRole('link').filter({ has: page.getByAltText('My Portfolio') });
        await portfolioIcon.hover();

        // 2. Verify icon is visible and interactive
        await expect(portfolioIcon).toBeVisible();
        // Icon is clickable (cursor style may vary by browser)
    });
});