import { type Browser, expect, type Page, test } from '@playwright/test';
import { isOver, newBoard, sow } from '../app/mancala';
import { showDesktop } from './helpers';

test('mancala rules: extra turn, capture, end-of-game sweep', () => {
  // 4 stones from pit 2 end in the store: go again.
  const extra = sow(newBoard(), 0, 2);
  expect(extra.board).toEqual([4, 4, 0, 5, 5, 5, 1, 4, 4, 4, 4, 4, 4, 0]);
  expect(extra.turn).toBe(0);

  // Last stone in an own empty pit takes the opposite pit.
  const capture = sow([1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 5, 1, 0], 0, 0);
  expect(capture.board).toEqual([0, 0, 0, 0, 0, 2, 6, 0, 0, 0, 0, 0, 1, 0]);
  expect(capture.turn).toBe(1);

  // Seat 0 empties its side: seat 1 sweeps its pits into its store.
  const end = sow([0, 0, 0, 0, 0, 1, 10, 2, 0, 0, 0, 0, 3, 5], 0, 5);
  expect(end.over).toBe(true);
  expect(end.board).toEqual([0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 10]);
  expect(isOver(end.board)).toBe(true);
});

async function enterRoom(browser: Browser, name: string) {
  const page = await (await browser.newContext()).newPage();
  await page.goto('/');
  await page.locator('nav.fixed.bottom-0').waitFor({ timeout: 15000 });
  await showDesktop(page);
  await page
    .getByRole('button')
    .filter({ has: page.getByAltText('Book Room') })
    .press('Enter');
  await page.getByLabel('Your name').fill(name);
  await page.getByRole('button', { name: 'Enter', exact: true }).click();
  await expect(page.getByTestId(`blob-${name}`)).toBeVisible();
  return page;
}

const stones = (page: Page, pit: number) =>
  page.getByTestId(`pit-${pit}`).getAttribute('data-count');

test('two players sit at a table and play in sync', async ({
  browser,
  isMobile,
}) => {
  // Headless WebKit (the mobile project) starves a second page of animation
  // frames, so its desktop never settles for the locator checks.
  test.skip(isMobile, 'needs two foreground pages');
  const pedro = await enterRoom(browser, 'Pedro');
  const blu = await enterRoom(browser, 'Blu');

  for (const p of [pedro, blu])
    await expect(p.getByTestId('table-label-1')).toHaveText(
      /Free – sit to play|vs|Waiting/
    );

  await pedro.getByTestId('seat-0-0').click();
  await expect(pedro.getByTestId('table-label-0')).toHaveText(
    'Waiting for opponent…'
  );
  await blu.getByTestId('seat-0-1').click();

  for (const p of [pedro, blu]) {
    await expect(p.getByTestId('table-label-0')).toHaveText('Pedro vs Blu');
    await expect(p.getByTestId('mancala-board')).toBeVisible();
  }
  await expect(pedro.getByTestId('mancala-status')).toHaveText('Your turn');

  // Pedro sows pit 0: Blu's board (flipped, same pit ids) follows.
  await pedro.getByTestId('pit-0').click();
  await expect.poll(() => stones(blu, 0)).toBe('0');
  await expect.poll(() => stones(blu, 4)).toBe('5');
  await expect(blu.getByTestId('mancala-status')).toHaveText('Your turn');

  // Pedro walks away mid-game: Blu wins by forfeit.
  await pedro.getByRole('application').press('Escape');
  await expect(blu.getByTestId('table-label-0')).toHaveText(
    'Blu wins by forfeit'
  );
  await blu.getByRole('application').press('Escape');
  await pedro.context().close();
  await blu.context().close();
});
