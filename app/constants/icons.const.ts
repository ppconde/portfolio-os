import { AppsNames } from './apps-names.const';

export type Icon = {
  app: AppsNames;
  icon: string;
  to?: string;
};

// Each icon is also its window's title-bar and taskbar icon.
export const icons: Icon[] = [
  {
    app: AppsNames.PORTFOLIO,
    icon: '/assets/html2-2.png',
    to: '/home',
  },
  {
    app: AppsNames.PAINT,
    icon: '/assets/paint_old-0.png',
  },
  {
    app: AppsNames.MANCALA,
    icon: '/assets/mancala-0.png',
  },
  {
    app: AppsNames.CREDITS,
    icon: '/assets/help_book_cool-4.png',
  },
];
