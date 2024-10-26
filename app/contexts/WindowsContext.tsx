import React, { createContext, useState } from 'react';

export interface Window {
  id: string;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  position: { x: number; y: number };
  zIndex: number;
}

type WindowsContextType = {
  windows: Window[];
  addWindow: (title: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  toggleWindow: (id: string) => void;
  setWindowPosition: (id: string, position: { x: number; y: number }) => void;
};

const initialWindows = [
  {
    id: 'Browser 1',
    title: 'Portfolio Hub',
    isMinimized: false,
    isMaximized: false,
    isFocused: true,
    position: { x: 100, y: 100 },
    zIndex: 0,
  },
];

export const WindowsContext = createContext<WindowsContextType>({
  windows: [...initialWindows],
  addWindow: () => {},
  closeWindow: () => {},
  minimizeWindow: () => {},
  restoreWindow: () => {},
  maximizeWindow: () => {},
  toggleWindow: () => {},
  setWindowPosition: () => {},
});

export function WindowProvider({ children }: { children: React.ReactNode }) {
  const [windows, setWindows] = useState<Window[]>([...initialWindows]);

  const addWindow = (title: string) => {
    const id = title + Math.random().toString(36).substring(2, 15);
    const positions = windows.reduce(
      (max, window) => {
        return {
          x: Math.max(max.x, window.position.x),
          y: Math.max(max.y, window.position.y),
        };
      },
      { x: 0, y: 0 }
    );
    const position = { x: positions.x + 50, y: positions.y + 50 };
    setWindows((prev) => [
      ...prev,
      {
        id,
        title,
        isMinimized: false,
        isMaximized: false,
        isFocused: false,
        position,
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
    setWindows((prev) =>
      prev.map((window) =>
        window.id === id ? { ...window, position } : window
      )
    );
  };

  return (
    <WindowsContext.Provider
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
    </WindowsContext.Provider>
  );
}
