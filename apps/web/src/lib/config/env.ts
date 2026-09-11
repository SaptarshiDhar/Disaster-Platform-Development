import { z } from 'zod';

/**
 * Environment configuration for RAKSHA.
 *
 * Design rule (Phase 0): a missing *integration* credential must never break
 * the build or crash a module import. Supabase and the basemap provider are
 * optional until Phase 1/Phase 3, so they resolve to a `configured: false`
 * state that the UI can render honestly instead of throwing.
 *
 * Only genuinely build-essential values may ever be made strictly required.
 */

const appEnvSchema = z.enum(['development', 'preview', 'production']);

export type AppEnv = z.infer<typeof appEnvSchema>;

/**
 * Values inlined into the client bundle. Every one of these is public by
 * definition — never read a secret through this object.
 */
const publicSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_ENV: appEnvSchema.default('development'),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_MAP_STYLE_URL: z.string().url().optional(),
});

/**
 * Next.js only inlines `process.env.X` when X is written out literally, so
 * these cannot be read dynamically.
 */
const publicResult = publicSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || undefined,
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || undefined,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || undefined,
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || undefined,
  NEXT_PUBLIC_MAP_STYLE_URL: process.env.NEXT_PUBLIC_MAP_STYLE_URL || undefined,
});

if (!publicResult.success) {
  // A malformed public value (e.g. a non-URL app URL) is a real configuration
  // bug rather than a missing optional integration, so surface it loudly.
  throw new Error(
    `Invalid public environment configuration: ${publicResult.error.issues
      .map((issue) => `${issue.path.join('.')} — ${issue.message}`)
      .join('; ')}`,
  );
}

export const publicEnv = publicResult.data;

/** True only when both public Supabase values are present and well-formed. */
export const isSupabaseConfigured =
  publicEnv.NEXT_PUBLIC_SUPABASE_URL !== undefined &&
  publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY !== undefined;

/** True only when a MapLibre style URL has been supplied. */
export const isBasemapConfigured =
  publicEnv.NEXT_PUBLIC_MAP_STYLE_URL !== undefined;

/**
 * Public Supabase credentials, or `null` when the integration is not yet
 * configured. Callers must handle `null` — that is the Phase 0 contract.
 */
export function getSupabasePublicConfig(): {
  url: string;
  anonKey: string;
} | null {
  const url = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url === undefined || anonKey === undefined) {
    return null;
  }

  return { url, anonKey };
}

export const appVersion = process.env.npm_package_version ?? '0.0.0';
