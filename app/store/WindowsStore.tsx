import { create } from 'zustand';
import { AppsNames } from '~/constants/apps-names.const';

export type DesktopWindow = {
  id: AppsNames;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  position: { x: number; y: number };
  zIndex: number;
};

type WindowsStore = {
  windows: DesktopWindow[];
  currentZIndex: number;
  addWindow: (id: AppsNames) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  toggleWindow: (id: string) => void;
  setWindowPosition: (id: string, position?: { x: number; y: number }) => void;
};

export const useWindowsStore = create<WindowsStore>((set, get) => {
  // Bring `id` to front and focus it (applying `patch`), unfocus the rest.
  const focus = (
    id: string,
    patch: (w: DesktopWindow) => Partial<DesktopWindow>
  ) =>
    set((state) => {
      const target = state.windows.find((w) => w.id === id);
      const p = target && patch(target);
      // Already focused on top with nothing to change: keep state so nobody re-renders.
      if (
        target?.isFocused &&
        target.zIndex === state.currentZIndex &&
        p &&
        Object.keys(p).length === 0
      )
        return state;
      const zIndex = state.currentZIndex + 1;
      return {
        currentZIndex: zIndex,
        windows: state.windows.map((w) =>
          w.id === id
            ? { ...w, isFocused: true, zIndex, ...patch(w) }
            : { ...w, isFocused: false }
        ),
      };
    });

  return {
    windows: [
      {
        id: AppsNames.PORTFOLIO,
        isMinimized: false,
        isMaximized: false,
        isFocused: true,
        position: { x: 65, y: 40 },
        zIndex: 1,
      },
    ],
    currentZIndex: 1,

    addWindow: (id) => {
      const { windows } = get();
      if (windows.some((w) => w.id === id)) return;

      const x = Math.max(0, ...windows.map((w) => w.position.x));
      const y = Math.max(0, ...windows.map((w) => w.position.y));

      set((state) => ({
        currentZIndex: state.currentZIndex + 1,
        windows: [
          ...state.windows.map((w) => ({ ...w, isFocused: false })),
          {
            id,
            isMinimized: false,
            isMaximized: false,
            isFocused: true,
            position: { x: x - 20, y: y + 20 },
            zIndex: state.currentZIndex + 1,
          },
        ],
      }));
    },

    closeWindow: (id) =>
      set((state) => ({ windows: state.windows.filter((w) => w.id !== id) })),

    minimizeWindow: (id) =>
      set((state) => ({
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, isMinimized: true, isFocused: false } : w
        ),
      })),

    maximizeWindow: (id) => focus(id, () => ({ isMaximized: true })),
    restoreWindow: (id) =>
      focus(id, () => ({ isMinimized: false, isMaximized: false })),
    toggleWindow: (id) =>
      focus(id, (w) => ({
        isMinimized: !w.isMinimized,
        isFocused: !w.isFocused,
      })),
    setWindowPosition: (id, position) =>
      focus(id, () => (position ? { position } : {})),
  };
});
