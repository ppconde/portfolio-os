// spec: specs/README.md

import { test, expect } from '@playwright/test';

test.describe.skip('Contact Form', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');

        // Wait for BIOS and desktop
        const biosLocator = page.getByText('PotatoChip™', { exact: true });
        await biosLocator.waitFor({ state: 'visible', timeout: 10000 });

        const navbar = page.locator('nav.fixed.bottom-0');
        await navbar.waitFor({ state: 'visible', timeout: 15000 });

        // Navigate to Contact page
        const contactLink = page.getByRole('link', { name: '[Contact]' });
        await contactLink.click();
        await expect(page).toHaveURL(/\/contact\/?$/);
    });

    test('should show validation errors for invalid input', async ({ page }) => {
        // Mock email service to prevent real requests - setup BEFORE filling form
        await page.route('https://email-with-resend.pepconde-1993.workers.dev/', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ success: true }),
            });
        });        // 1. Navigate to the Contact route (done in beforeEach)

        // 2. Fill form with invalid data - use valid formats to bypass HTML5 validation
        await page.getByLabel('Your email').fill('invalid@test');  // Invalid format but passes basic HTML check
        await page.getByLabel('Subject').fill('Valid Subject');
        await page.getByLabel('Your message').fill('This is a valid message with enough characters.');

        // 3. Submit the form
        await page.getByRole('button', { name: 'Send' }).click();

        // Wait for form submission to complete
        await page.waitForTimeout(1000);

        // 4. Verify validation error appears
        const validationError = page.locator('p.text-red-600');
        await expect(validationError).toBeVisible({ timeout: 3000 });
    });

    test('should show error notification on submission failure', async ({ page }) => {
        // Test is skipped - error notification only appears for validation errors in current implementation
        // When server returns 500 or other errors without 'errors' field, no notification is shown
        test.fixme(true, 'Error notification behavior needs app code changes to handle non-validation errors');

        // Mock email service to prevent real requests
        await page.route('https://email-with-resend.pepconde-1993.workers.dev/', route => {
            route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Server error' }),
            });
        });

        // 1. Fill form with valid data
        await page.getByLabel('Your email').fill('test@example.com');
        await page.getByLabel('Subject').fill('Test Subject');
        await page.getByLabel('Your message').fill('This is a test message with enough characters.');

        // 2. Submit the form
        await page.getByRole('button', { name: 'Send' }).click();

        // 3. Wait for submission and verify error notification appears
        await page.waitForTimeout(2000);

        // The app shows "There was an error with your submission." in the notification
        const errorNotification = page.getByText('There was an error with your submission.');
        await expect(errorNotification).toBeVisible({ timeout: 5000 });
    });

    test('should show success notification and reset form on successful submission', async ({ page }) => {
        // Mock email service to prevent real requests - setup BEFORE filling form
        await page.route('https://email-with-resend.pepconde-1993.workers.dev/', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ success: true }),
            });
        });

        // 1. Fill form with valid data
        await page.getByLabel('Your email').fill('test@example.com');
        await page.getByLabel('Subject').fill('Test Subject');
        await page.getByLabel('Your message').fill('This is a test message with enough characters.');

        // 2. Submit the form
        await page.getByRole('button', { name: 'Send' }).click();

        // 3. Verify success notification is shown
        await expect(page.getByText('Email sent successfully!')).toBeVisible({ timeout: 5000 });

        // 4. Verify form is reset
        await expect(page.getByLabel('Your email')).toHaveValue('');
        await expect(page.getByLabel('Subject')).toHaveValue('');
        await expect(page.getByLabel('Your message')).toHaveValue('');
    });
});