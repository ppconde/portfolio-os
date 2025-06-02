import { isRouteErrorResponse } from 'react-router';
import type { Route } from '../+types/root';

type BlueScreenProps = {
  error: Route.ErrorBoundaryProps;
};

function getErrorMessage(error: Route.ErrorBoundaryProps): string {
  if (isRouteErrorResponse(error)) return `${error.status} ${error.statusText}`;
  if (error instanceof Error) return error.message;
  return 'An unknown error occurred.';
}

function getStackTrace(error: Route.ErrorBoundaryProps): string | null {
  return error instanceof Error && error.stack ? error.stack : null;
}

export default function BlueScreen({ error }: BlueScreenProps) {
  const message = getErrorMessage(error);
  const stack = getStackTrace(error);

  return (
    <div className="bg-windows-super-blue text-windows-white flex min-h-screen w-full flex-col p-6 font-mono">
      <div className="flex w-full max-w-screen-md flex-col">
        <h1 className="font-perfect-dos-vga mb-4 text-xl tracking-wide uppercase">
          STOP: A fatal exception has occurred
        </h1>
        <p>
          A problem has been detected and the application has been shut down to
          prevent damage to your system.
        </p>

        <p>
          <strong>Error:</strong> {message}
        </p>
        {stack && (
          <div className="mt-4 border-t border-white pt-4 text-sm opacity-80">
            <pre className="break-all whitespace-pre-wrap">{stack}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
