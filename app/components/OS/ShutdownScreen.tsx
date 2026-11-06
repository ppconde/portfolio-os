import { useEffect, useState } from 'react';
import { useAnyKey } from '~/hooks/use-any-key';
import { useBootStore } from '~/store/BootStore';
import BlinkCaret from './BlinkCaret';

const STEP_DELAYS = [600, 1200, 2000, 3400, 4800, 5600];
const REBOOT_DELAY = 6000;

// CSS typewriter: reveals `text` one character per 35ms (monospace font).
function Typed({ text }: { text: string }) {
  return (
    <span
      className="animate-typing inline-block overflow-hidden align-bottom whitespace-nowrap"
      style={{
        width: `${text.length}ch`,
        animationDuration: `${text.length * 35}ms`,
        animationTimingFunction: `steps(${text.length})`,
      }}
    >
      {text}
    </span>
  );
}

// Skipping the shutdown still reboots: it only fast-forwards to the BIOS.
const reboot = () => useBootStore.getState().setBootState('booting');

export default function ShutdownScreen() {
  const [step, setStep] = useState(0);
  const setBootState = useBootStore((s) => s.setBootState);

  useEffect(() => {
    const ids = STEP_DELAYS.map((delay, i) =>
      setTimeout(() => setStep(i + 1), delay)
    );
    ids.push(setTimeout(() => setBootState('booting'), REBOOT_DELAY));
    return () => ids.forEach(clearTimeout);
  }, [setBootState]);
  useAnyKey(reboot);

  return (
    <div
      className="font-perfect-dos-vga-win text-primary h-screen w-screen bg-black select-none"
      onPointerDown={reboot}
    >
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
              SpudOS Kernel <Typed text=".............. Terminated" />
            </p>
            <p>PotatoChip™ Cooling System . Offline</p>
            <p>
              RGB Lighting <Typed text="............... Off (Mood ruined)" />
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
              Attempting Recovery <Typed text="... Recovery Failed." />
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
