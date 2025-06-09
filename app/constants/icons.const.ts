import { AppsNames } from './apps-names.const';

export type Icon = {
  id: AppsNames;
  name: AppsNames;
  icon: string;
  to?: string;
};

export const icons: Icon[] = [
  {
    id: AppsNames.PORTFOLIO,
    name: AppsNames.PORTFOLIO,
    icon: '/assets/html2-2.png',
    to: '/home',
  },
  {
    id: AppsNames.CREDITS,
    name: AppsNames.CREDITS,
    icon: '/assets/help_book_cool-4.png',
  },
];
