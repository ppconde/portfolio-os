import { type Browser, expect, type Page, test } from '@playwright/test';
import { isOver, newBoard, sow } from '../app/mancala';
import { isBlocked, lineClear, SPAWN, TABLES } from '../app/room';
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

test('free movement: fractional spots, straight lines blocked by tables', () => {
  expect(isBlocked({ x: 16.3, y: 16.6 })).toBe(false);
  expect(isBlocked({ x: 16, y: 4.2 })).toBe(true); // the back wall
  const [left, right] = TABLES[3].seats; // either side of a table
  expect(lineClear(left, right)).toBe(false);
  expect(lineClear(SPAWN, { x: 16.4, y: 15.2 })).toBe(true);
});

async function enterRoom(browser: Browser, name: string) {
  const page = await (await browser.newContext()).newPage();
  await page.goto('/');
  await page.locator('nav.fixed.bottom-0').waitFor({ timeout: 15000 });
  await showDesktop(page);
  await page
    .getByRole('button')
    .filter({ has: page.getByAltText('Mancala', { exact: true }) })
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

test('plays the resident Computer and leaves mid-game', async ({
  browser,
  isMobile,
}) => {
  // One Computer table shared by both projects running in parallel.
  test.skip(isMobile, 'one shared Computer table');
  const solo = await enterRoom(browser, 'Solo');
  const label = solo.getByTestId('table-label-4');
  await expect(label).toHaveText('Play the computer – sit to play');
  await expect(solo.getByTestId('blob-Computer (AI)')).toBeVisible();

  await solo.getByTestId('seat-4-0').click();
  await expect(label).toHaveText('Solo vs Computer (AI)');
  await expect(solo.getByTestId('mancala-status')).toHaveText('Your turn');

  // Pit 0's last stone lands in pit 4, so the Computer moves, then it's us again
  // (pit testids only exist on our turn).
  await solo.getByTestId('pit-0').click();
  await expect
    .poll(async () => Number(await stones(solo, 1)), { timeout: 15000 })
    .toBeGreaterThanOrEqual(5);
  await expect(solo.getByTestId('mancala-status')).toHaveText('Your turn');

  await solo.getByRole('button', { name: 'Leave game' }).click();
  await expect(solo.getByTestId('mancala-board')).toBeHidden();
  await expect(label).toHaveText('Play the computer – sit to play');
  await solo.context().close();
});

test('the poster opens the rules', async ({ browser, isMobile }) => {
  const page = await enterRoom(browser, isMobile ? 'Mia' : 'Dee');
  await page.getByTestId('how-to-play').click();
  const panel = page.getByTestId('how-to-play-panel');
  await expect(panel).toContainText('How to play Mancala');
  await page.getByRole('button', { name: 'Got it' }).click();
  await expect(panel).toBeHidden();
  // Both projects share the room: one table each.
  const table = isMobile ? 3 : 1;
  await page.getByTestId(`seat-${table}-0`).click();
  await expect(page.getByTestId(`table-label-${table}`)).toHaveText(
    'Waiting for opponent…'
  );
  await page.context().close();
});

test('jazz plays in the room and the speaker mutes it', async ({
  browser,
  isMobile,
}) => {
  const page = await enterRoom(browser, isMobile ? 'Sax' : 'Bass');
  const jazz = page.getByTestId('jazz');
  const state = () =>
    jazz.evaluate((a: HTMLAudioElement) => ({
      playing: !a.paused,
      muted: a.muted,
    }));
  await expect.poll(state).toEqual({ playing: true, muted: false });
  // Keeps playing through the room's per-tick re-renders.
  await expect
    .poll(() => jazz.evaluate((a: HTMLAudioElement) => a.currentTime))
    .toBeGreaterThan(1);
  await page.getByRole('button', { name: 'Mute sound' }).click();
  await expect.poll(state).toEqual({ playing: true, muted: true });

  // Closing the window stops the jazz and drops its source.
  const audio = await jazz.elementHandle();
  await page.getByTestId('close-button-mancala').click();
  await expect
    .poll(() =>
      audio?.evaluate((a: HTMLAudioElement) => ({
        paused: a.paused,
        src: a.getAttribute('src'),
      }))
    )
    .toEqual({ paused: true, src: null });
  await page.context().close();
});
