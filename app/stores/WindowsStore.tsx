import { create } from 'zustand';
import type { AppsNames } from '~/constants/apps-names.const';
import { initialWindows } from '~/constants/initial-windows.const';

export type DesktopWindow = {
  id: AppsNames;
  name: AppsNames;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  position: { x: number; y: number };
  zIndex: number;
};

type WindowsStore = {
  windows: DesktopWindow[];
  currentZIndex: number;
  addWindow: (id: AppsNames, name: AppsNames) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  toggleWindow: (id: string) => void;
  setWindowPosition: (id: string, position?: { x: number; y: number }) => void;
  onMouseDown: (id: string) => void;
};

export const useWindowsStore = create<WindowsStore>((set, get) => ({
  windows: initialWindows,
  currentZIndex: 1,

  addWindow: (id, name) => {
    const { windows } = get();
    if (windows.find((w) => w.id === id)) return;

    const positions = windows.reduce(
      (max, win) => ({
        x: Math.max(max.x, win.position.x),
        y: Math.max(max.y, win.position.y),
      }),
      { x: 0, y: 0 }
    );

    set((state) => ({
      currentZIndex: ++state.currentZIndex,
      windows: [
        ...state.windows.map((w) => ({ ...w, isFocused: false })),
        {
          id,
          name,
          isMinimized: false,
          isMaximized: false,
          isFocused: true,
          position: { x: positions.x + 40, y: positions.y + 40 },
          zIndex: ++state.currentZIndex,
        },
      ],
    }));
  },

  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
    })),

  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true, isFocused: false } : w
      ),
    })),

  maximizeWindow: (id) =>
    set((state) => ({
      currentZIndex: ++state.currentZIndex,
      windows: state.windows.map((w) =>
        w.id === id
          ? {
              ...w,
              isMaximized: true,
              isFocused: true,
              zIndex: ++state.currentZIndex,
            }
          : { ...w, isFocused: false }
      ),
    })),

  restoreWindow: (id) =>
    set((state) => ({
      currentZIndex: ++state.currentZIndex,
      windows: state.windows.map((w) =>
        w.id === id
          ? {
              ...w,
              isMinimized: false,
              isMaximized: false,
              isFocused: true,
              zIndex: ++state.currentZIndex,
            }
          : { ...w, isFocused: false }
      ),
    })),

  toggleWindow: (id) =>
    set((state) => ({
      currentZIndex: ++state.currentZIndex,
      windows: state.windows.map((w) =>
        w.id === id
          ? {
              ...w,
              isMinimized: !w.isMinimized,
              isFocused: !w.isFocused,
              zIndex: ++state.currentZIndex,
            }
          : { ...w, isFocused: false }
      ),
    })),

  setWindowPosition: (id, position) =>
    set((state) => ({
      currentZIndex: ++state.currentZIndex,
      windows: state.windows.map((w) =>
        w.id === id
          ? {
              ...w,
              ...(position?.x != null ? { position } : {}),
              isFocused: true,
              zIndex: ++state.currentZIndex,
            }
          : { ...w, isFocused: false }
      ),
    })),

  onMouseDown: (id) => get().setWindowPosition(id),
}));
