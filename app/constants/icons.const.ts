import { AppsNames } from './apps-names.const';

export type Icon = {
  label: string;
  app: AppsNames;
  icon: string;
  to?: string;
};

// Each icon is also its window's title-bar and taskbar icon.
export const icons: Icon[] = [
  {
    label: AppsNames.PORTFOLIO,
    app: AppsNames.PORTFOLIO,
    icon: '/assets/html2-2.png',
    to: '/home',
  },
  {
    label: AppsNames.PAINT,
    app: AppsNames.PAINT,
    icon: '/assets/paint_old-0.png',
  },
  {
    label: AppsNames.BOOK_ROOM,
    app: AppsNames.BOOK_ROOM,
    icon: '/assets/msn3-4.png',
  },
  {
    label: AppsNames.CREDITS,
    app: AppsNames.CREDITS,
    icon: '/assets/help_book_cool-4.png',
  },
];

// Windows that open from inside an app, not from the desktop or Start menu.
export const windowIcons: Icon[] = [
  ...icons,
  {
    label: AppsNames.MANCALA,
    app: AppsNames.MANCALA,
    icon: '/assets/mancala.svg',
  },
];
