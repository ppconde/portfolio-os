import React, { createContext, useState } from 'react';
import type { AppsNames } from '~/constants/apps-names.const';
import { initialWindows } from '~/constants/initial-windows.const';

export type DesktopIcon = {
  id: AppsNames;
  name: AppsNames;
  icon: string;
  to: string;
};

export type DesktopWindow = {
  id: AppsNames;
  name: AppsNames;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  position: { x: number; y: number };
  zIndex: number;
};

type AppsContextType = {
  windows: DesktopWindow[];
  addWindow: (id: AppsNames, name: AppsNames) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  toggleWindow: (id: string) => void;
  setWindowPosition: (id: string, position: { x: number; y: number }) => void;
};

export const AppsContext = createContext<AppsContextType>({
  windows: initialWindows,
  addWindow: () => {},
  closeWindow: () => {},
  minimizeWindow: () => {},
  restoreWindow: () => {},
  maximizeWindow: () => {},
  toggleWindow: () => {},
  setWindowPosition: () => {},
});

export function AppsProvider({ children }: { children: React.ReactNode }) {
  const [windows, setWindows] = useState<DesktopWindow[]>(initialWindows);

  const addWindow = (id: AppsNames, name: AppsNames) => {
    if (windows.find((window) => window.id === id)) {
      return;
    }
    const positions = windows.reduce(
      (max, window) => {
        return {
          x: Math.max(max.x, window.position.x),
          y: Math.max(max.y, window.position.y),
        };
      },
      { x: 0, y: 0 }
    );

    setWindows((prev) => [
      ...prev,
      {
        id,
        name,
        isMinimized: false,
        isMaximized: false,
        isFocused: true,
        position: { x: positions.x + 50, y: positions.y + 50 },
        zIndex: prev.length,
      },
    ]);
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((window) => window.id !== id));
  };

  const maximizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === id
          ? {
              ...window,
              isMaximized: true,
              isFocused: true,
            }
          : window
      )
    );
  };

  const minimizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === id
          ? { ...window, isMinimized: true, isFocused: false }
          : window
      )
    );
  };

  const restoreWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === id
          ? { ...window, isMinimized: false, isMaximized: false }
          : window
      )
    );
  };

  const toggleWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === id
          ? { ...window, isMinimized: !window.isMinimized }
          : window
      )
    );
  };

  const setWindowPosition = (
    id: string,
    position: { x: number; y: number }
  ) => {
    setWindows((prevWindows) =>
      prevWindows.map((window) =>
        window.id === id ? { ...window, position } : window
      )
    );
  };

  return (
    <AppsContext.Provider
      value={{
        windows,
        addWindow,
        closeWindow,
        maximizeWindow,
        minimizeWindow,
        restoreWindow,
        toggleWindow,
        setWindowPosition,
      }}
    >
      {children}
    </AppsContext.Provider>
  );
}
