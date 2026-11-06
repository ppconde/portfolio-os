import { useEffect, useLayoutEffect, useState } from 'react';
import { useAnyKey } from '~/hooks/use-any-key';
import { useBootStore } from '~/store/BootStore';
import BlinkCaret from './BlinkCaret';

const STEP_DELAYS = [1500, 1700, 2000, 2500];
const BOOTED_KEY = 'booted';

// Only the first BIOS of a page load may be skipped; the reboot after Shut Down always plays.
let isPageLoad = true;

const session = {
  booted: () => {
    try {
      return sessionStorage.getItem(BOOTED_KEY) === '1';
    } catch {
      return false;
    }
  },
  markBooted: () => {
    try {
      sessionStorage.setItem(BOOTED_KEY, '1');
    } catch {}
  },
};

const skipToDesktop = () => {
  session.markBooted();
  useBootStore.getState().setBootState('loaded');
};

export default function BiosScreen() {
  const [step, setStep] = useState(0);
  const setBootState = useBootStore((s) => s.setBootState);

  // Already booted this session: straight to the desktop, before first paint.
  useLayoutEffect(() => {
    if (isPageLoad && session.booted()) setBootState('loaded');
    isPageLoad = false;
  }, [setBootState]);

  useEffect(() => {
    const ids = STEP_DELAYS.map((delay, i) =>
      setTimeout(() => setStep(i + 1), delay)
    );
    ids.push(
      setTimeout(() => {
        session.markBooted();
        setBootState('loaded');
      }, 3500)
    );
    return () => ids.forEach(clearTimeout);
  }, [setBootState]);

  useAnyKey(skipToDesktop);

  return (
    <div
      className="font-perfect-dos-vga-win text-primary h-screen w-screen bg-black select-none"
      onPointerDown={skipToDesktop}
    >
      {step >= 4 ? (
        <BlinkCaret />
      ) : (
        <div className="flex h-full w-full flex-col p-4 sm:p-6 md:p-8">
          <div className="space-y-1 text-center md:mt-6 md:space-y-2 md:pl-2 md:text-left">
            <p>PhoenixBIOS 1.0 Beta</p>
            <p>Copyright 1985-2025 Totally Legit Technologies Inc.</p>
            <p>All Rights Preserved (in a jar)</p>
            <p>3R7H3R1UM.42A.1337.P07</p>
          </div>

          <div className="mt-6 space-y-1 text-center md:space-y-2 md:pl-2 md:text-left">
            <p className="text-accent-light text-lg font-bold md:text-xl">
              Overclocked Potato X3000
            </p>
            <p>BIOS Version 1.23.456</p>
            <p>SpudChip™ 9001 MHz (Caution: May Overheat)</p>
          </div>

          <div className="mt-6 flex flex-col items-center text-center md:items-start md:pl-2 md:text-left">
            <div className="font-micro text-accent-light text-5xl font-bold md:text-3xl">
              PotatoChip
              <span className="font-perfect-dos-vga-win align-super text-base font-normal">
                ™
              </span>
            </div>
          </div>

          {step >= 1 && (
            <div className="space-y-1 text-center text-sm md:space-y-2 md:pl-2 md:text-left">
              <p>256MB System RAM Passed</p>
            </div>
          )}

          {step >= 2 && (
            <div className="space-y-1 text-center text-sm md:space-y-2 md:pl-2 md:text-left">
              <p>Keyboard ................ Detected</p>
              <p>Mouse ................... Detected</p>
            </div>
          )}

          {step >= 3 && (
            <div className="mt-6 space-y-1 text-center text-sm md:space-y-2 md:pl-2 md:text-left">
              <p>Fixed Disk 0: WDC: WD200EB-00CPF0-(PM)</p>
              <p>ATAPI CD-ROM: CRD-8400B-(SM)</p>
              <p>ATAPI CD-ROM: CD-RW CRX100E-(SS)</p>
            </div>
          )}

          <div className="grow" />

          <div className="text-accent-light mb-4 text-center md:mb-0 md:pl-2 md:text-left">
            <p>
              Press &lt;Del&gt; to enter SETUP or &lt;F1&gt; to question your
              life choices
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
