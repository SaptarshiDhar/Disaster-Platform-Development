import 'server-only';

import { z } from 'zod';

/**
 * Server-only environment access.
 *
 * The `server-only` import above makes it a *build error* to pull this module
 * into a client component, which is the enforcement mechanism that keeps the
 * service-role key out of the browser bundle.
 *
 * Never log, return or embed any value read here.
 */

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  OPEN_METEO_BASE_URL: z
    .string()
    .url()
    .default('https://api.open-meteo.com/v1'),
});

const parsed = serverSchema.safeParse({
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || undefined,
  OPEN_METEO_BASE_URL: process.env.OPEN_METEO_BASE_URL || undefined,
});

if (!parsed.success) {
  throw new Error(
    // Report which key is bad, never what it contains.
    `Invalid server environment configuration for: ${parsed.error.issues
      .map((issue) => issue.path.join('.'))
      .join(', ')}`,
  );
}

export const serverEnv = parsed.data;

/** Whether a service-role key is available, without revealing it. */
export const hasServiceRoleKey =
  serverEnv.SUPABASE_SERVICE_ROLE_KEY !== undefined;
