import { getErrorDetails, type BlueScreenProps } from '~/utils/error-handler';

export default function BlueScreen({ error }: BlueScreenProps) {
  const { message, stack } = getErrorDetails(error);

  return (
    <div className="bg-windows-super-blue text-windows-white flex min-h-screen w-full flex-col p-6 font-mono">
      <div className="flex w-full max-w-screen-md flex-col justify-between gap-2">
        <h1 className="font-perfect-dos-vga mb-4 text-xl tracking-wide uppercase">
          <span className="bg-windows-gray-primary text-windows-super-blue p-2">
            Ppconde OS
          </span>
        </h1>
        <p>
          A problem has been detected and the application has been shut down to
          prevent damage to your system. 0x0000007b
        </p>

        <p>
          <strong>Error:</strong> {message}
        </p>
        {stack && (
          <div className="mt-2 border-t border-white pt-4 text-sm opacity-80">
            <pre className="break-all whitespace-pre-wrap">{stack}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
