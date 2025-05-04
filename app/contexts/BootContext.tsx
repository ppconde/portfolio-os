import { createContext, useContext, useState } from 'react';

type BootState = 'booting' | 'loaded' | 'shutting_down';

type BootContextType = {
  bootState: BootState;
  setBootState: (state: BootState) => void;
};

// Create the context with a default value
const BootContext = createContext<BootContextType | undefined>(undefined);

export const useBootContext = () => {
  const context = useContext(BootContext);
  if (!context) {
    throw new Error('useBootContext must be used within a BootProvider');
  }
  return context;
};

export default function BootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [bootState, setBootState] = useState<BootState>('booting');

  return (
    <BootContext.Provider value={{ bootState, setBootState }}>
      {children}
    </BootContext.Provider>
  );
}
