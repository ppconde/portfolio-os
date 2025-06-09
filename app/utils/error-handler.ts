import { isRouteErrorResponse } from 'react-router';
import type { Route } from '../+types/root';

export type BlueScreenProps = {
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

export function getErrorDetails(error: Route.ErrorBoundaryProps) {
  const message = getErrorMessage(error);
  const stack = getStackTrace(error);

  return {
    message,
    stack,
  };
}
