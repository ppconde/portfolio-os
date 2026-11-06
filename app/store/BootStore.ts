import { create } from 'zustand';

type BootState = 'booting' | 'starting' | 'loaded' | 'shutting_down';

export const useBootStore = create<{
  bootState: BootState;
  setBootState: (bootState: BootState) => void;
}>((set) => ({
  bootState: 'booting',
  setBootState: (bootState) => set({ bootState }),
}));
