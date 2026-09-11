import Link from 'next/link';
import { Activity, Database, Layers3, ShieldAlert } from 'lucide-react';

import { StatusPill } from '@/components/common/StatusPill';
import {
  isBasemapConfigured,
  isSupabaseConfigured,
  publicEnv,
} from '@/lib/config/env';

/**
 * Phase 0 landing page.
 *
 * A deliberately small, honest status surface: it states what the platform is
 * for, what is actually wired up, and what is not. The operational dashboard
 * arrives in Phase 1 — this page must not imply it already exists.
 */

const CAPABILITIES = [
  {
    icon: ShieldAlert,
    title: 'Multi-Hazard Red Zones',
    body: 'Flood, landslide, cloudburst and coastal-erosion exposure combined into reviewable red zone geometry.',
  },
  {
    icon: Layers3,
    title: 'Carrying Capacity',
    body: 'Assessment of whether a candidate relocation site can actually support a displaced population.',
  },
  {
    icon: Activity,
    title: 'Relocation Prioritisation',
    body: 'Evidence-linked ranking across Immediate, Short-Term and Medium-Term horizons.',
  },
  {
    icon: Database,
    title: 'Data Provenance',
    body: 'Every figure traceable to its source, processing run and classification.',
  },
] as const;

const STACK = [
  'Next.js',
  'TypeScript',
  'Tailwind CSS',
  'Supabase',
  'PostgreSQL + PostGIS',
  'MapLibre GL JS',
  'Vercel',
] as const;

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-12 px-6 py-16 md:py-24">
      <header className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded border border-[var(--color-raksha-border)] bg-[var(--color-raksha-surface)] px-2.5 py-1 text-xs font-semibold tracking-widest text-[var(--color-raksha-accent)]">
            SIH26191
          </span>
          <span className="rounded border border-[var(--color-raksha-border)] px-2.5 py-1 text-xs font-medium text-[var(--color-raksha-muted)]">
            Prototype / {publicEnv.NEXT_PUBLIC_APP_ENV} environment
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl">
            RAKSHA
          </h1>
          <p className="max-w-3xl text-balance text-lg leading-relaxed text-[var(--color-raksha-muted)] md:text-xl">
            AI-Powered Hazard-Based Red Zone, Carrying Capacity and Relocation
            Decision Support System
          </p>
        </div>
      </header>

      <section
        aria-labelledby="status-heading"
        className="rounded-xl border border-[var(--color-raksha-border)] bg-[var(--color-raksha-surface)] p-6"
      >
        <h2
          id="status-heading"
          className="text-sm font-semibold uppercase tracking-widest text-[var(--color-raksha-muted)]"
        >
          System foundation initialised — Phase 0
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--color-raksha-muted)]">
          Architecture and deployment baseline. Integrations below report their
          real configuration state; nothing is simulated on this page.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <StatusPill label="Application shell" tone="ready" />
          <StatusPill label="Health endpoint" tone="ready" />
          <StatusPill
            label="Supabase"
            tone={isSupabaseConfigured ? 'ready' : 'pending'}
          />
          <StatusPill
            label="Basemap"
            tone={isBasemapConfigured ? 'ready' : 'pending'}
          />
          <StatusPill label="PostGIS schema" tone="pending" />
          <StatusPill label="Authority dashboard" tone="pending" />
        </div>

        <p className="mt-5 text-sm">
          <Link
            className="font-medium text-[var(--color-raksha-accent)] underline underline-offset-4"
            href="/api/health"
          >
            View the health endpoint response
          </Link>
        </p>
      </section>

      <section
        aria-labelledby="capabilities-heading"
        className="flex flex-col gap-5"
      >
        <h2
          id="capabilities-heading"
          className="text-sm font-semibold uppercase tracking-widest text-[var(--color-raksha-muted)]"
        >
          Planned capabilities
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {CAPABILITIES.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="rounded-xl border border-[var(--color-raksha-border)] bg-[var(--color-raksha-surface)] p-5"
            >
              <Icon
                aria-hidden="true"
                className="size-5 text-[var(--color-raksha-accent)]"
              />
              <h3 className="mt-3 text-base font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-raksha-muted)]">
                {body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="stack-heading" className="flex flex-col gap-4">
        <h2
          id="stack-heading"
          className="text-sm font-semibold uppercase tracking-widest text-[var(--color-raksha-muted)]"
        >
          Technology baseline
        </h2>
        <ul className="flex flex-wrap gap-2">
          {STACK.map((item) => (
            <li
              key={item}
              className="rounded-md border border-[var(--color-raksha-border)] bg-[var(--color-raksha-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-raksha-muted)]"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-auto border-t border-[var(--color-raksha-border)] pt-6">
        <p className="max-w-3xl text-xs leading-relaxed text-[var(--color-raksha-muted)]">
          <strong className="font-semibold text-[var(--color-raksha-text)]">
            Prototype disclaimer.
          </strong>{' '}
          RAKSHA is a prototype decision-support platform developed for Smart
          India Hackathon 2026. Hazard classifications, carrying-capacity
          estimates, relocation rankings and recommendations produced by the
          prototype must not be interpreted as official government evacuation or
          relocation orders unless independently validated and authorised by the
          competent authorities.
        </p>
      </footer>
    </main>
  );
}
