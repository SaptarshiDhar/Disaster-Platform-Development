import 'server-only';

import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

import { getSupabasePublicConfig } from '@/lib/config/env';

/**
 * Server Supabase client for Server Components, Route Handlers and Server
 * Actions.
 *
 * Still the anon key — this client acts *as the signed-in user*, so RLS
 * remains the authorisation boundary. It reads the session from cookies.
 *
 * Returns `null` when Supabase is not configured.
 */
export async function createClient(): Promise<SupabaseClient | null> {
  const config = getSupabasePublicConfig();

  if (config === null) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components cannot set cookies. Session refresh is handled
          // by middleware instead (added in Phase 1), so ignoring this here is
          // the documented Supabase SSR pattern.
        }
      },
    },
  });
}
