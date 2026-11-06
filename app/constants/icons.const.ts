import { AppsNames } from './apps-names.const';

export type Icon = {
  label: string;
  app: AppsNames;
  icon: string;
  to?: string;
};

// The first icon per app is also its window's title-bar icon.
export const icons: Icon[] = [
  {
    label: AppsNames.PORTFOLIO,
    app: AppsNames.PORTFOLIO,
    icon: '/assets/html2-2.png',
    to: '/home',
  },
  {
    label: 'Projects',
    app: AppsNames.PORTFOLIO,
    icon: '/assets/directory_open_file_mydocs-4.png',
    to: '/projects',
  },
  {
    label: 'Mail',
    app: AppsNames.PORTFOLIO,
    // ponytail: placeholder until outlook_express-4.png (win98icons.alexmeub.com) is in public/assets.
    icon: '/assets/msn3-4.png',
    to: '/contact',
  },
  {
    label: AppsNames.CREDITS,
    app: AppsNames.CREDITS,
    icon: '/assets/help_book_cool-4.png',
  },
];
