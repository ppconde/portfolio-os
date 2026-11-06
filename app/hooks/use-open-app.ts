import { useNavigate } from 'react-router';
import type { Icon } from '~/constants/icons.const';
import { useWindowsStore } from '~/store/WindowsStore';

// Opens (or brings back) an app's window, navigating the portfolio when needed.
export function useOpenApp() {
  const navigate = useNavigate();
  const addWindow = useWindowsStore((s) => s.addWindow);
  return ({ app, to }: Pick<Icon, 'app' | 'to'>) => {
    if (to) navigate(to);
    addWindow(app);
  };
}
