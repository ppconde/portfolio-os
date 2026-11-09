import { useNavigate } from 'react-router';
import type { Icon } from '~/constants/icons.const';
import { useWindowsStore } from '~/store/WindowsStore';

// Opens (or brings back) an app's window. Only a fresh window navigates, so
// bringing back the portfolio keeps the page you were reading.
export function useOpenApp() {
  const navigate = useNavigate();
  const addWindow = useWindowsStore((s) => s.addWindow);
  return ({ app, to }: Pick<Icon, 'app' | 'to'>) => {
    const isOpen = useWindowsStore.getState().windows.some((w) => w.id === app);
    if (to && !isOpen) navigate(to);
    addWindow(app);
  };
}
