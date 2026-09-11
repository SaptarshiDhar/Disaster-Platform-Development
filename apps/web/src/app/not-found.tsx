import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center gap-5 px-6">
      <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-raksha-accent)]">
        404
      </p>
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-sm leading-relaxed text-[var(--color-raksha-muted)]">
        The page you requested does not exist in this build of RAKSHA.
      </p>
      <p>
        <Link
          href="/"
          className="text-sm font-medium text-[var(--color-raksha-accent)] underline underline-offset-4"
        >
          Return to the overview
        </Link>
      </p>
    </main>
  );
}
