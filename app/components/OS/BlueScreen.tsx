import { isRouteErrorResponse } from 'react-router';
import { useAnyKey } from '~/hooks/use-any-key';

// Hard navigation: the root error boundary may hold broken state, so reboot cleanly.
const restart = () => window.location.assign('/home');

export default function BlueScreen({ error }: { error: unknown }) {
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'An unknown error occurred.';
  // Stack traces are for development only.
  const stack =
    import.meta.env.DEV && error instanceof Error ? error.stack : undefined;

  useAnyKey(restart);

  return (
    <div className="bg-accent-light text-tertiary flex min-h-screen w-full flex-col p-6 font-mono">
      <div className="flex w-full max-w-screen-md flex-col justify-between gap-2">
        <h1 className="font-perfect-dos-vga mb-4 text-xl tracking-wide uppercase">
          <span className="bg-secondary text-accent-light p-2">Ppconde OS</span>
        </h1>
        <p>
          A problem has been detected and the application has been shut down to
          prevent damage to your system. 0x0000007b
        </p>

        <p>
          <strong>Error:</strong> {message}
        </p>
        <button
          className="mt-6 self-start text-left focus-visible:outline-2 focus-visible:outline-white"
          onClick={restart}
          type="button"
        >
          Press any key to continue <span className="animate-blink">_</span>
        </button>
        {stack && (
          <div className="mt-2 border-t border-white pt-4 text-sm opacity-80">
            <pre className="break-all whitespace-pre-wrap">{stack}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
