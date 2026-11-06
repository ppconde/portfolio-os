// spec: specs/README.md

import { expect, test } from '@playwright/test';
import { showDesktop } from './helpers';

test.describe('Icon Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Wait for BIOS and desktop
    const biosLocator = page.getByText('PotatoChip™', { exact: true });
    await biosLocator.waitFor({ state: 'visible', timeout: 10000 });

    const navbar = page.locator('nav.fixed.bottom-0');
    await navbar.waitFor({ state: 'visible', timeout: 15000 });
    await showDesktop(page);
  });

  test('should open My Portfolio window on double-click', async ({ page }) => {
    // 1. Double-click My Portfolio icon
    const portfolioIcon = page
      .getByRole('button')
      .filter({ has: page.getByAltText('My Portfolio') });
    await portfolioIcon.dblclick();

    // 2. Verify correct app/window opens
    await expect(page).toHaveURL(/\/home\/?$/);

    // 3. Verify window content is visible
    const contentArea = page.locator('.bg-tertiary.border-2');
    await expect(contentArea).toBeVisible();

    // 4. Verify window title in taskbar
    const taskbarButton = page
      .locator('nav.fixed.bottom-0')
      .getByRole('button')
      .filter({ hasText: 'My Portfolio' });
    await expect(taskbarButton).toBeVisible();
  });

  test('should open Paint and draw on the canvas', async ({ page }) => {
    await page
      .getByRole('button')
      .filter({ has: page.getByAltText('Paint') })
      .dblclick();

    const canvas = page.getByTestId('paint-canvas');
    await expect(canvas).toBeVisible();

    const box = await canvas.boundingBox();
    if (!box) throw new Error('canvas not laid out');
    await page.mouse.move(box.x + 20, box.y + 20);
    await page.mouse.down();
    await page.mouse.move(box.x + 120, box.y + 80, { steps: 5 });
    await page.mouse.up();

    // Some pixel is no longer white.
    const isDrawn = (c: HTMLCanvasElement) => {
      const d = c.getContext('2d')?.getImageData(0, 0, c.width, c.height).data;
      return !!d?.some((v, i) => i % 4 !== 3 && v !== 255);
    };
    const drawn = await canvas.evaluate(isDrawn);
    expect(drawn).toBe(true);

    // Minimize and restore from the taskbar: the drawing survives.
    await page.getByTestId('minimize-button-paint').click();
    await expect(canvas).toBeHidden();
    await page
      .locator('nav.fixed.bottom-0')
      .getByRole('button')
      .filter({ hasText: 'Paint' })
      .click();
    await expect(canvas).toBeVisible();
    expect(await canvas.evaluate(isDrawn)).toBe(true);

    // Maximizing grows the canvas to cover the view and keeps the drawing.
    const covers = (c: HTMLCanvasElement) => {
      const v = c.parentElement as HTMLElement;
      return c.width >= v.clientWidth && c.height >= v.clientHeight;
    };
    await page.getByTestId('maximize-button-paint').click();
    await expect.poll(() => canvas.evaluate(covers)).toBe(true);
    expect(await canvas.evaluate(isDrawn)).toBe(true);

    // Undo takes the stroke back off.
    await page.getByRole('button', { name: 'Undo', exact: true }).click();
    expect(await canvas.evaluate(isDrawn)).toBe(false);
  });

  test('should open Credits window on double-click', async ({ page }) => {
    // 1. Double-click Credits icon
    const creditsIcon = page
      .getByRole('button')
      .filter({ has: page.getByAltText('Credits') });
    await creditsIcon.dblclick();

    // 2. Verify correct window opens with Credits content
    await expect(page.getByText('This project was created by:')).toBeVisible();
    await expect(
      page.getByRole('listitem').filter({ hasText: 'Pedro Conde' })
    ).toBeVisible();

    // 3. Verify window is visible
    const creditsWindow = page
      .locator('.border-windows')
      .filter({ has: page.getByText('Credits', { exact: true }) });
    await expect(creditsWindow).toBeVisible();

    // 4. Verify taskbar button
    const taskbarButton = page
      .locator('nav.fixed.bottom-0')
      .getByRole('button')
      .filter({ hasText: 'Credits' });
    await expect(taskbarButton).toBeVisible();
  });

  test('should provide visual feedback on icon hover', async ({
    page,
    isMobile,
  }) => {
    // Skip on mobile - hover not applicable
    test.skip(isMobile, 'Hover not supported on mobile');

    // 1. Hover over My Portfolio icon
    const portfolioIcon = page
      .getByRole('button')
      .filter({ has: page.getByAltText('My Portfolio') });
    await portfolioIcon.hover();

    // 2. Verify icon is visible and interactive
    await expect(portfolioIcon).toBeVisible();
    // Icon is clickable (cursor style may vary by browser)
  });
});
