// spec: specs/README.md

import { test, expect } from '@playwright/test';

test.describe('Window Management', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');

        // Wait for BIOS and desktop
        const biosLocator = page.getByText('PotatoChip™', { exact: true });
        await biosLocator.waitFor({ state: 'visible', timeout: 10000 });

        const navbar = page.locator('nav.fixed.bottom-0');
        await navbar.waitFor({ state: 'visible', timeout: 15000 });
    });

    test('should minimize, restore, and close window', async ({ page }) => {
        // 1. Open Credits window via icon double-click
        const creditsIcon = page.getByRole('button').filter({ has: page.getByAltText('Credits') });
        await creditsIcon.dblclick();

        // 2. Verify window opens
        const windowLocator = page.locator('.border-windows').filter({ has: page.getByText('Credits', { exact: true }) });
        await expect(windowLocator).toBeVisible();

        // 3. Click Minimize button
        const minimizeButton = page.getByTestId('minimize-button-credits');
        await minimizeButton.click();

        // 4. Verify window is minimized (not visible on screen)
        await page.waitForTimeout(300);
        await expect(windowLocator).toBeHidden();

        // 5. Click taskbar button to restore
        const taskbarButton = page.locator('nav.fixed.bottom-0').getByRole('button').filter({ hasText: 'Credits' });
        await taskbarButton.click();

        // 6. Verify window is restored
        await expect(windowLocator).toBeVisible();

        // 7. Click Close button
        const closeButton = page.getByTestId('close-button-credits');
        await closeButton.click();

        // 8. Verify window is closed
        await expect(windowLocator).toHaveCount(0);
    });

    test('should maximize and restore window', async ({ page }) => {
        // 1. Open Credits window
        const creditsIcon = page.getByRole('button').filter({ has: page.getByAltText('Credits') });
        await creditsIcon.dblclick();

        // 2. Verify window opens
        const windowLocator = page.locator('.border-windows').filter({ has: page.getByText('Credits', { exact: true }) });
        await expect(windowLocator).toBeVisible();

        // Get initial bounding box
        const initialBox = await windowLocator.boundingBox();

        // 3. Click Maximize button
        const maximizeButton = page.getByTestId('maximize-button-credits');
        await maximizeButton.click();

        // 4. Verify window is maximized (should be larger)
        await page.waitForTimeout(300);
        const maximizedBox = await windowLocator.boundingBox();
        expect(maximizedBox!.width).toBeGreaterThan(initialBox!.width);
        expect(maximizedBox!.height).toBeGreaterThan(initialBox!.height);

        // 5. Click Maximize again to restore
        await maximizeButton.click();

        // 6. Verify window is restored to original size
        await page.waitForTimeout(300);
        const restoredBox = await windowLocator.boundingBox();
        expect(restoredBox!.width).toBeLessThan(maximizedBox!.width);
    });

    test('should drag window to new position', async ({ page }) => {

        // 1. Open Credits window
        const creditsIcon = page.getByRole('button').filter({ has: page.getByAltText('Credits') });
        await creditsIcon.dblclick();

        // 2. Get window title bar
        const titleBar = page.locator('.bg-accent').filter({ has: page.getByText('Credits', { exact: true }) }).first();
        await expect(titleBar).toBeVisible();

        // 3. Get initial position
        const windowLocator = page.locator('.border-windows').filter({ has: page.getByText('Credits', { exact: true }) });
        const initialBox = await windowLocator.boundingBox();

        // 4. Drag the window
        await titleBar.dragTo(page.locator('.bg-primary'), {
            targetPosition: { x: 200, y: 150 },
        });

        // 5. Verify position changed
        await page.waitForTimeout(300);
        const newBox = await windowLocator.boundingBox();
        expect(newBox!.x).not.toEqual(initialBox!.x);
        expect(newBox!.y).not.toEqual(initialBox!.y);
    });
});