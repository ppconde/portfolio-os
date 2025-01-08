import { useState, useEffect } from 'react';

interface BiosScreenProps {
  onFinish: () => void;
}

export default function BiosScreen({ onFinish }: BiosScreenProps) {
  const [showFirstSection, setShowFirstSection] = useState(false);
  const [showSecondSection, setShowSecondSection] = useState(false);
  const [showThirdSection, setShowThirdSection] = useState(false);
  const [showFourthSection, setShowFourthSection] = useState(false);

  useEffect(() => {
    const firstTimer = setTimeout(() => setShowFirstSection(true), 1500);
    const secondTimer = setTimeout(() => setShowSecondSection(true), 1700);
    const thirdTimer = setTimeout(() => setShowThirdSection(true), 2000);
    const fourthTimer = setTimeout(() => setShowFourthSection(true), 2500);
    const finalTimer = setTimeout(() => onFinish(), 3500);

    return () => {
      clearTimeout(firstTimer);
      clearTimeout(secondTimer);
      clearTimeout(thirdTimer);
      clearTimeout(fourthTimer);
      clearTimeout(finalTimer);
    };
  }, [onFinish]);

  return (
    <div className="h-screen w-screen bg-black font-perfect-dos-vga-win text-windows-teal">
      <div className="flex h-full w-full flex-col p-4 sm:p-6 md:p-8">
        <div
          className={`space-y-1 text-center md:mt-6 md:space-y-2 md:pl-2 md:text-left ${showFourthSection ? 'hidden' : ''}`}
        >
          <p>PhoenixBIOS 1.0 Beta</p>
          <p>Copyright 1985-2025 Totally Legit Technologies Inc.</p>
          <p>All Rights Preserved (in a jar)</p>
          <p>3R7H3R1UM.42A.1337.P07</p>
        </div>

        <div
          className={`mt-6 space-y-1 text-center md:space-y-2 md:pl-2 md:text-left ${showFourthSection ? 'hidden' : ''}`}
        >
          <p className="text-windows-super-blue text-lg font-bold md:text-xl">
            Overclocked Potato X3000
          </p>
          <p>BIOS Version 1.23.456</p>
          <p>SpudChip™ 9001 MHz (Caution: May Overheat)</p>
        </div>

        <div
          className={`mt-6 flex flex-col items-center text-center md:items-start md:pl-2 md:text-left ${showFourthSection ? 'hidden' : ''}`}
        >
          <div className="text-windows-super-blue font-micro text-5xl font-bold md:text-3xl">
            PotatoChip™
          </div>
        </div>

        {showFirstSection && (
          <div
            className={`mt-6 space-y-1 text-center md:space-y-2 md:pl-2 md:text-left ${showFourthSection ? 'hidden' : ''}`}
          >
            <p>256MB System RAM Passed</p>
          </div>
        )}

        {showSecondSection && (
          <div
            className={`mt-6 space-y-1 text-center md:space-y-2 md:pl-2 md:text-left ${showFourthSection ? 'hidden' : ''}`}
          >
            <p>Keyboard ................ Detected</p>
            <p>Mouse ................... Detected</p>
          </div>
        )}

        {showThirdSection && (
          <div
            className={`mt-6 space-y-1 text-center md:space-y-2 md:pl-2 md:text-left ${showFourthSection ? 'hidden' : ''}`}
          >
            <p>Fixed Disk 0: WDC: WD200EB-00CPF0-(PM)</p>
            <p>ATAPI CD-ROM: CRD-8400B-(SM)</p>
            <p>ATAPI CD-ROM: CD-RW CRX100E-(SS)</p>
          </div>
        )}

        {showFourthSection && (
          <div className="absolute left-0 top-0 p-4">
            {/* Horizontal caret */}
            <p className="animate-blink text-lg font-bold text-windows-teal">
              _
            </p>
          </div>
        )}

        <div className={`flex-grow ${showFourthSection ? 'hidden' : ''}`}></div>

        <div
          className={`text-windows-super-blue mb-4 text-center md:mb-0 md:pl-2 md:text-left ${showFourthSection ? 'hidden' : ''}`}
        >
          <p>
            Press &lt;Del&gt; to enter SETUP or &lt;F1&gt; to question your life
            choices
          </p>
        </div>
      </div>
    </div>
  );
}