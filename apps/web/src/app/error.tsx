'use client';

import { useEffect } from 'react';

/**
 * Route-level error boundary.
 *
 * Shows a generic message. The `error.digest` is a Next.js-generated
 * correlation id, safe to display — unlike the message or stack, which may
 * contain internal detail and are never rendered.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replaced by a real error-tracking sink in a later phase.
    console.error('Unhandled route error', error.digest);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center gap-5 px-6">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="text-sm leading-relaxed text-[var(--color-raksha-muted)]">
        RAKSHA could not complete this request. If the problem persists, report
        the reference below to the platform team.
      </p>
      {error.digest ? (
        <p className="font-mono text-xs text-[var(--color-raksha-muted)]">
          Reference: {error.digest}
        </p>
      ) : null}
      <div>
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-[var(--color-raksha-border)] bg-[var(--color-raksha-surface)] px-4 py-2 text-sm font-medium"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
