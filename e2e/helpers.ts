import type { Page } from '@playwright/test';

// Phones open the portfolio maximized over the desktop icons; minimize it to
// reach them, as a phone user would.
export async function showDesktop(page: Page) {
  if ((page.viewportSize()?.width ?? 1280) >= 640) return;
  await page.getByTestId('minimize-button-my portfolio').click();
}
