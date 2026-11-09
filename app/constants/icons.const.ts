import { AppsNames } from './apps-names.const';

// Lazy apps' chunks: DesktopContent lazy()-loads them, icons preload them on hover/focus.
export const loadPaint = () => import('~/components/Paint');
export const loadMancala = () => import('~/components/MancalaLounge');

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
    preload: loadPaint,
  },
  {
    app: AppsNames.MANCALA,
    icon: '/img/mancala-0.png',
    preload: loadMancala,
  },
  {
    app: AppsNames.CREDITS,
    icon: '/img/help_book_cool-4.png',
  },
];
