import type { DesktopWindow } from '~/contexts/AppsContext';
import { AppsNames } from './apps-names.const';

export const initialWindows: DesktopWindow[] = [
  {
    id: AppsNames.PORTFOLIO,
    name: AppsNames.PORTFOLIO,
    isMinimized: false,
    isMaximized: false,
    isFocused: true,
    position: { x: 100, y: 40 },
    zIndex: 0,
  },
];
