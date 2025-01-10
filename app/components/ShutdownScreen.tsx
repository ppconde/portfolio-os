import { useEffect } from 'react';
import { redirect } from 'react-router';
import { useBootContext } from '~/contexts/BootContext';

export default function ShutdownScreen() {
  const asciiArt = `
 ██████╗  ██████╗ ██████╗ ██████╗ ██╗   ██╗███╗   ██╗
██╔════╝ ██╔═══██╗██╔══██╗██╔══██╗██║   ██║████╗  ██║
██║  ███╗██║   ██║██████╔╝██████╔╝██║   ██║██╔██╗ ██║
██║   ██║██║   ██║██╔═══╝ ██╔═══╝ ██║   ██║██║╚██╗██║
╚██████╔╝╚██████╔╝██║     ██║     ╚██████╔╝██║ ╚████║
 ╚═════╝  ╚═════╝ ╚═╝     ╚═╝      ╚═════╝ ╚═╝  ╚═══╝
-----------------------------------------------------
 SYSTEM HALTING...                                  
 REASONS:
 - Too many open tabs                              
 - Cat videos overloaded the buffer               
 - Keyboard ran out of clicks                     
 - User tried turning it off and on again         
-----------------------------------------------------
                 [ Goodbye, Human! ]
`;

  const { setBootState } = useBootContext();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBootState('booting');
      redirect('/website');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [setBootState]);

  return (
    <div
      style={{
        backgroundColor: '#000',
        color: '#0f0',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        padding: '20px',
      }}
    >
      {asciiArt}
    </div>
  );
}
