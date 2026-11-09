import { AppsNames } from './apps-names.const';

export type Icon = {
  app: AppsNames;
  icon: string;
  to?: string;
  // Fetches a lazy app's chunk on hover/focus, so opening it doesn't wait.
  preload?: () => Promise<unknown>;
};

// Each icon is also its window's title-bar and taskbar icon.
export const icons: Icon[] = [
  {
    app: AppsNames.PORTFOLIO,
    icon: '/img/html2-2.png',
    to: '/home',
  },
  {
    app: AppsNames.PAINT,
    icon: '/img/paint_old-0.png',
    preload: () => import('~/components/Paint'),
  },
  {
    app: AppsNames.MANCALA,
    icon: '/img/mancala-0.png',
    preload: () => import('~/components/MancalaLounge'),
  },
  {
    app: AppsNames.CREDITS,
    icon: '/img/help_book_cool-4.png',
  },
];
