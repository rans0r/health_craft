'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-lg">
          <h1 className="text-2xl font-semibold text-gray-900">Something went wrong</h1>
          <p className="mt-4 text-sm text-gray-600">
            We&apos;ve recorded the error and our team will look into it.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-6 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
