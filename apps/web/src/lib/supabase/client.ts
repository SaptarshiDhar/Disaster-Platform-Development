'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

import { getSupabasePublicConfig } from '@/lib/config/env';

/**
 * Browser Supabase client.
 *
 * Uses the anon key only. Every table it can reach must be protected by Row
 * Level Security — the anon key is public by design.
 *
 * Returns `null` when Supabase is not configured (the Phase 0 default) so
 * callers render a "not configured" state instead of throwing on import.
 */
export function createClient(): SupabaseClient | null {
  const config = getSupabasePublicConfig();

  if (config === null) {
    return null;
  }

  return createBrowserClient(config.url, config.anonKey);
}
