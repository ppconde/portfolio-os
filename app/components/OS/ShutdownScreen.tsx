import { useEffect, useState } from 'react';
import { useBootStore } from '~/store/BootStore';
import BlinkCaret from './BlinkCaret';

const STEP_DELAYS = [1000, 2100, 3000, 5000, 7000, 9000];

// CSS typewriter: reveals `text` one character per `msPerChar` (monospace font).
function Typed({ text, msPerChar }: { text: string; msPerChar: number }) {
  return (
    <span
      className="inline-block overflow-hidden align-bottom whitespace-nowrap"
      style={{
        width: `${text.length}ch`,
        animation: `typing ${text.length * msPerChar}ms steps(${text.length})`,
      }}
    >
      {text}
    </span>
  );
}

export default function ShutdownScreen() {
  const [step, setStep] = useState(0);
  const setBootState = useBootStore((s) => s.setBootState);

  useEffect(() => {
    const ids = STEP_DELAYS.map((delay, i) =>
      setTimeout(() => setStep(i + 1), delay)
    );
    ids.push(setTimeout(() => setBootState('booting'), 10000));
    return () => ids.forEach(clearTimeout);
  }, [setBootState]);

  return (
    <div className="font-perfect-dos-vga-win text-primary h-screen w-screen bg-black">
      <div className="flex h-full w-full flex-col p-4 sm:p-6 md:p-8">
        {(step === 1 || step >= 6) && <BlinkCaret />}

        {step >= 2 && step < 4 && (
          <div className="space-y-1 text-left text-sm md:space-y-2 md:pl-2">
            <p>System Shutdown Sequence Initiated...</p>
            <p>Saving settings to CMOS... Done.</p>
            <p>Disconnecting peripherals...</p>
          </div>
        )}

        {step === 3 && (
          <div className="mt-4 space-y-1 text-left text-sm md:space-y-2 md:pl-2">
            <p>Shutting down services...</p>
            <p>
              SpudOS Kernel{' '}
              <Typed msPerChar={10} text=".............. Terminated" />
            </p>
            <p>PotatoChip™ Cooling System . Offline</p>
            <p>
              RGB Lighting{' '}
              <Typed msPerChar={10} text="............... Off (Mood ruined)" />
            </p>
          </div>
        )}

        {step >= 4 && step < 6 && (
          <div className="mt-6 space-y-1 text-left text-sm md:space-y-2 md:pl-2">
            <p>ERROR: Unexpected Shutdown Event Detected</p>
            <p>ERROR CODE: 0xDEAD-C0DE</p>
            <p>Details: PotatoChip™ encountered an overcooked kernel.</p>
          </div>
        )}

        {step === 5 && (
          <div className="text-md mt-6 space-y-1 text-left md:space-y-2 md:pl-2">
            <p>
              Attempting Recovery{' '}
              <Typed msPerChar={20} text="... Recovery Failed." />
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
