/**
 * Route-level loading state. A server component — no client boundary needed.
 */
export default function Loading() {
  return (
    <main
      className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center gap-3 px-6"
      aria-busy="true"
    >
      <p
        role="status"
        className="text-sm font-medium text-[var(--color-raksha-muted)]"
      >
        Loading RAKSHA…
      </p>
      <div
        aria-hidden="true"
        className="h-1 w-40 overflow-hidden rounded-full bg-[var(--color-raksha-surface)]"
      >
        <div className="h-full w-1/2 animate-pulse rounded-full bg-[var(--color-raksha-accent)]" />
      </div>
    </main>
  );
}
