import { useState, useEffect } from 'react';
import { useBootContext } from '~/contexts/BootContext';
import BlinkCaret from './BlinkCaret';
import { Typewriter } from 'react-simple-typewriter';

export default function ShutdownScreen() {
  const [showFirstSection, setShowFirstSection] = useState(false);
  const [showSecondSection, setShowSecondSection] = useState(false);
  const [showThirdSection, setShowThirdSection] = useState(false);
  const [showFourthSection, setShowFourthSection] = useState(false);
  const [showFifthSection, setShowFifthSection] = useState(false);
  const [showSixthSection, setShowSixthSection] = useState(false);
  const { setBootState } = useBootContext();

  useEffect(() => {
    const timers = [
      { delay: 1000, action: () => setShowFirstSection(true) },
      {
        delay: 2100,
        action: () => {
          setShowFirstSection(false);
          setShowSecondSection(true);
        },
      },
      { delay: 3000, action: () => setShowThirdSection(true) },
      { delay: 5000, action: () => setShowFourthSection(true) },
      { delay: 7000, action: () => setShowFifthSection(true) },
      { delay: 9000, action: () => setShowSixthSection(true) },
      { delay: 10000, action: () => setBootState('booting') },
    ];
    const timeoutIds = timers.map(({ delay, action }) =>
      setTimeout(action, delay)
    );

    return () => timeoutIds.forEach(clearTimeout);
  }, [setBootState]);

  return (
    <div className="h-screen w-screen bg-black font-perfect-dos-vga-win text-windows-teal">
      <div className="flex h-full w-full flex-col p-4 sm:p-6 md:p-8">
        {showFirstSection && <BlinkCaret hide={!showFirstSection} />}
        {showSecondSection && (
          <div
            className={`space-y-1 text-left text-sm md:space-y-2 md:pl-2 ${showFourthSection ? 'hidden' : ''}`}
          >
            <p>System Shutdown Sequence Initiated...</p>
            <p>Saving settings to CMOS... Done.</p>
            <p>Disconnecting peripherals...</p>
          </div>
        )}

        {showThirdSection && (
          <div
            className={`mt-4 space-y-1 text-left text-sm md:space-y-2 md:pl-2 ${showFourthSection ? 'hidden' : ''}`}
          >
            <p>Shutting down services...</p>
            <p>
              SpudOS Kernel{' '}
              <Typewriter
                words={['.............. Terminated']}
                typeSpeed={10}
              />{' '}
            </p>
            <p>PotatoChip™ Cooling System . Offline</p>
            <p>
              RGB Lighting{' '}
              <Typewriter
                words={['............... Off (Mood ruined)']}
                typeSpeed={10}
              />
            </p>
          </div>
        )}

        {showFourthSection && (
          <div
            className={`mt-6 space-y-1 text-left text-sm md:space-y-2 md:pl-2 ${showSixthSection ? 'hidden' : ''}`}
          >
            <p>ERROR: Unexpected Shutdown Event Detected</p>
            <p>ERROR CODE: 0xDEAD-C0DE</p>
            <p>Details: PotatoChip™ encountered an overcooked kernel.</p>
          </div>
        )}

        {showFifthSection && (
          <div
            className={`text-md mt-6 space-y-1 text-left md:space-y-2 md:pl-2 ${showSixthSection ? 'hidden' : ''}`}
          >
            <p>
              Attempting Recovery{' '}
              <Typewriter words={['... Recovery Failed.']} typeSpeed={20} />{' '}
            </p>
          </div>
        )}

        {showSixthSection && <BlinkCaret />}

        <div className={`flex-grow`}></div>
      </div>
    </div>
  );
}
