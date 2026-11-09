import type { ReactNode } from 'react';
import WindowButton from './OS/WindowButton';

// A Win98 dialog floating over the lounge: navy title bar, gray body.
export default function RoomDialog({
  title,
  onClose,
  children,
  'data-testid': testId,
}: {
  title: string;
  onClose?: () => void;
  children: ReactNode;
  'data-testid'?: string;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-2">
      <div
        aria-label={title}
        aria-modal="true"
        className="border-windows bg-secondary flex max-h-full w-full max-w-xl flex-col p-1 font-mono text-sm shadow-[2px_2px_6px_rgb(0_0_0/0.45)]"
        data-testid={testId}
        role="dialog"
      >
        <div className="bg-accent text-tertiary flex h-6 shrink-0 items-center justify-between px-1">
          <span className="font-micro truncate text-xl">{title}</span>
          {onClose && (
            <WindowButton
              imageAlt="Close"
              imageName="/assets/close.png"
              onClick={onClose}
            />
          )}
        </div>
        <div className="flex min-h-0 flex-col gap-3 overflow-y-auto p-3">
          {children}
        </div>
      </div>
    </div>
  );
}
