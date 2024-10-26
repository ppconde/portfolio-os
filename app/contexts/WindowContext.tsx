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

type WindowContextType = {
  windows: Window[];
  addWindow: (id: string, title: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  setFocusedWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  toggleWindow: (id: string) => void;
  setWindowPosition: (id: string, position: { x: number; y: number }) => void;
};

const initialWindows = [
  {
    id: 'BrowserIndex',
    title: 'Portfolio Hub',
    isMinimized: false,
    isMaximized: false,
    isFocused: true,
    position: { x: 100, y: 100 },
    zIndex: 0,
  },
];

export const WindowContext = createContext<WindowContextType>({
  windows: [...initialWindows],
  addWindow: () => {},
  closeWindow: () => {},
  minimizeWindow: () => {},
  restoreWindow: () => {},
  setFocusedWindow: () => {},
  maximizeWindow: () => {},
  toggleWindow: () => {},
  setWindowPosition: () => {},
});

export function WindowProvider({ children }: { children: React.ReactNode }) {
  const [windows, setWindows] = useState<Window[]>([...initialWindows]);

  const addWindow = (id: string, title: string) => {
    setWindows((prev) => [
      ...prev,
      {
        id,
        title,
        isMinimized: false,
        isMaximized: false,
        isFocused: false,
        position: { x: 100, y: 100 },
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

  const setFocusedWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === id
          ? {
              ...window,
              isFocused: true,
              zIndex: Math.max(...prev.map((w) => w.zIndex)) + 1,
            }
          : { ...window, isFocused: false }
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
    <WindowContext.Provider
      value={{
        windows,
        addWindow,
        closeWindow,
        maximizeWindow,
        minimizeWindow,
        restoreWindow,
        setFocusedWindow,
        toggleWindow,
        setWindowPosition,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
}
