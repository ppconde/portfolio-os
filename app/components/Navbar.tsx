import React, { useContext } from 'react';
import { WindowContext } from '~/contexts/WindowContext';
import NavBarButton from '~/components/NavBarButton';
import Start from '~/components/Start';

export default function Navbar() {
  const { windows } = useContext(WindowContext);
  return (
    <nav className="fixed bottom-0 left-0 flex h-8 w-full items-center justify-center border-t-2 border-windows-white bg-windows-gray-primary px-1">
      <div className="h-[80%]">
        <Start />
      </div>
      <div className="flex h-[80%] flex-1 items-center">
        {windows.map((window, index) => (
          <React.Fragment key={window.id + index}>
            {index > 0 && (
              <div key={index} className="mx-1 h-[90%] w-px bg-black"></div>
            )}
            <NavBarButton window={window} />
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}
