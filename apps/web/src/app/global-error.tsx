'use client';

/**
 * Last-resort boundary for errors thrown in the root layout itself.
 *
 * It replaces the whole document, so it must render its own <html>/<body> and
 * cannot rely on globals.css having been applied.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          background: '#020b14',
          color: '#e6f1fb',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }}
      >
        <div style={{ maxWidth: '36rem' }}>
          <h1 style={{ fontSize: '1.75rem', margin: '0 0 0.75rem' }}>
            RAKSHA is temporarily unavailable
          </h1>
          <p style={{ color: '#8aa8c4', lineHeight: 1.6, margin: '0 0 1rem' }}>
            A critical error prevented the application from rendering.
          </p>
          {error.digest ? (
            <p style={{ color: '#8aa8c4', fontSize: '0.75rem' }}>
              Reference: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={reset}
            style={{
              background: '#071626',
              border: '1px solid #12324d',
              borderRadius: '0.375rem',
              color: '#e6f1fb',
              cursor: 'pointer',
              fontSize: '0.875rem',
              padding: '0.5rem 1rem',
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
