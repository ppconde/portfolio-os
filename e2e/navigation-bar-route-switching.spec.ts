// spec: specs/README.md

import { test, expect } from '@playwright/test';

test.describe('Navigation Bar and Route Switching', () => {
    test('Route switching via NavList', async ({ page }) => {
        // 1. Navigate to the root URL.
        await page.goto('/');

        // 2. Wait for the BIOS/boot screen (if present).
        const biosLocator = page.getByText('PotatoChip™', { exact: true });
        await biosLocator.waitFor({ state: 'visible', timeout: 10000 });

        // Take an initial BIOS snapshot (stabilized)
        await expect(page).toHaveScreenshot('navigation-bios.png', {
            mask: [
                // Mask dynamic clock in taskbar
                page.locator('nav.fixed.bottom-0'),
            ],
            animations: 'disabled',
            fullPage: true,
            maxDiffPixelRatio: 0.05,
        });

        // 3. Wait for the desktop to appear.
        const navbar = page.locator('nav.fixed.bottom-0');
        await navbar.waitFor({ state: 'visible', timeout: 15000 });
        await expect(navbar).toBeVisible();

        // Helper: stable screenshot per route
        const screenshot = async (name: string) =>
            expect(page).toHaveScreenshot(name, {
                mask: [page.locator('nav.fixed.bottom-0')],
                animations: 'disabled',
                fullPage: true,
                maxDiffPixelRatio: 0.05,
            });

        // Helper: verify content area visible
        const contentArea = page.locator('.bg-tertiary.border-2');

        // 1. From the desktop, locate the navigation bar/menu.
        // Already located `navbar`, ensure visible
        await expect(navbar).toBeVisible();

        // 2. Click each main route: Home, About, Projects, Experience, Contact.
        // Home: only present in NavList outside /home, but we can navigate explicitly first.
        // Click `[About]`
        // Wait for each page to load.
        // Expected: Each route loads the correct content; URL updates; no errors.

        // Ensure we are at Home first
        // 2(a). Click [Home] if available in current page NavList (About/others layouts include Home link)
        const homeLink = page.getByRole('link', { name: '[Home]' });
        // It may not exist on /home page; guard
        if (await homeLink.count()) {
            // 2(a) Click [Home]
            await homeLink.click();
        } else {
            // If not present, go direct
            await page.goto('/home');
        }
        await expect(page).toHaveURL(/\/home\/?$/);
        await expect(contentArea).toBeVisible();
        await screenshot('navigation-home.png');

        // 2(b). Click [About]
        const aboutLink = page.getByRole('link', { name: '[About]' });
        await aboutLink.click();
        await expect(page).toHaveURL(/\/about\/?$/);
        await expect(contentArea).toBeVisible();
        await screenshot('navigation-about.png');

        // 2(c). Click [Experience]
        const experienceLink = page.getByRole('link', { name: '[Experience]' });
        await experienceLink.click();
        await expect(page).toHaveURL(/\/experience\/?$/);
        await expect(contentArea).toBeVisible();
        await screenshot('navigation-experience.png');

        // 2(d). Click [Projects]
        const projectsLink = page.getByRole('link', { name: '[Projects]' });
        await projectsLink.click();
        await expect(page).toHaveURL(/\/projects\/?$/);
        await expect(contentArea).toBeVisible();
        await screenshot('navigation-projects.png');

        // 2(e). Click [Contact]
        const contactLink = page.getByRole('link', { name: '[Contact]' });
        await contactLink.click();
        await expect(page).toHaveURL(/\/contact\/?$/);
        await expect(contentArea).toBeVisible();
        await screenshot('navigation-contact.png');

        // 3. Waits were embedded above; final sanity: no BlueScreen present
        await expect(page.getByText('A problem has been detected')).toHaveCount(0);
    });
});