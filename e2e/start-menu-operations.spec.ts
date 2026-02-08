// spec: specs/README.md

import { test, expect } from '@playwright/test';

test.describe('Start Menu Operations', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');

        // Wait for BIOS and desktop
        const biosLocator = page.getByText('PotatoChip™', { exact: true });
        await biosLocator.waitFor({ state: 'visible', timeout: 10000 });

        const navbar = page.locator('nav.fixed.bottom-0');
        await navbar.waitFor({ state: 'visible', timeout: 15000 });
    });

    test('should open and close Start menu', async ({ page }) => {
        // 1. Click the Start button
        const startButton = page.getByRole('button', { name: /start/i });
        await startButton.click();

        // 2. Verify the Start menu opens
        const startMenu = page.locator('.absolute.bottom-8.left-0');
        await expect(startMenu).toBeVisible();
        await expect(page.getByText('PpcondeOS')).toBeVisible();

        // 3. Click Start button again to close
        await startButton.click();

        // Wait briefly for close animation
        await page.waitForTimeout(300);

        // Start menu should be hidden
        await expect(startMenu).toHaveCount(0);
    });

    test('should shut down when clicking Shut Down', async ({ page }) => {
        // 1. Click the Start button
        const startButton = page.getByRole('button', { name: /start/i });
        await startButton.click();

        // 2. Verify the Start menu opens
        const shutDownButton = page.getByRole('button', { name: /shut down/i });
        await expect(shutDownButton).toBeVisible();

        // 3. Click Shut Down
        await shutDownButton.click();

        // 4. Verify shutdown screen appears
        await expect(page.getByText('System Shutdown Sequence Initiated')).toBeVisible({ timeout: 3000 });

        // 5. Verify system eventually reboots to BIOS
        await expect(page.getByText('PotatoChip™', { exact: true })).toBeVisible({ timeout: 15000 });
    });
});