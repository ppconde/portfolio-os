import { type BlueScreenProps, getErrorDetails } from '~/utils/error-handler';

export default function BlueScreen({ error }: BlueScreenProps) {
  const { message, stack } = getErrorDetails(error);

  return (
    <div className="flex min-h-screen w-full flex-col bg-accent-light p-6 font-mono text-tertiary">
      <div className="flex w-full max-w-screen-md flex-col justify-between gap-2">
        <h1 className="mb-4 font-perfect-dos-vga text-xl uppercase tracking-wide">
          <span className="bg-secondary p-2 text-accent-light">Ppconde OS</span>
        </h1>
        <p>
          A problem has been detected and the application has been shut down to
          prevent damage to your system. 0x0000007b
        </p>

        <p>
          <strong>Error:</strong> {message}
        </p>
        {stack && (
          <div className="mt-2 border-white border-t pt-4 text-sm opacity-80">
            <pre className="whitespace-pre-wrap break-all">{stack}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
