import 'server-only';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

import { getSupabasePublicConfig } from '@/lib/config/env';
import { serverEnv } from '@/lib/config/server-env';

/**
 * Service-role Supabase client. **Bypasses Row Level Security entirely.**
 *
 * Rules for this module, which the `server-only` import enforces at build time:
 *   1. Never import it from a client component.
 *   2. Never use it to serve a user request without an explicit, separate
 *      authorisation check first — RLS is not protecting you here.
 *   3. Never log or return the key, or any object that embeds it.
 *
 * Intended solely for trusted back-office work: data ingestion jobs,
 * migrations and processing runs (Phase 4 onwards).
 *
 * Returns `null` when either the Supabase URL or the service-role key is
 * absent, which is the Phase 0 default.
 */
export function createAdminClient(): SupabaseClient | null {
  const config = getSupabasePublicConfig();
  const serviceRoleKey = serverEnv.SUPABASE_SERVICE_ROLE_KEY;

  if (config === null || serviceRoleKey === undefined) {
    return null;
  }

  return createSupabaseClient(config.url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
