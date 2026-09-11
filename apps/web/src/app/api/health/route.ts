import { publicEnv } from '@/lib/config/env';
import { apiSuccess } from '@/lib/api/response';

/**
 * GET /api/health
 *
 * Liveness probe. Deliberately requires no authentication and touches no
 * external service, so it stays meaningful even when Supabase is unconfigured
 * or unreachable. It reports only non-sensitive metadata.
 */

// Always evaluated per-request so the timestamp is real rather than baked in
// at build time.
export const dynamic = 'force-dynamic';

type HealthPayload = {
  status: 'ok';
  service: 'raksha-web';
  environment: string;
  phase: string;
  timestamp: string;
};

export function GET() {
  const payload: HealthPayload = {
    status: 'ok',
    service: 'raksha-web',
    environment: publicEnv.NEXT_PUBLIC_APP_ENV,
    phase: '0',
    timestamp: new Date().toISOString(),
  };

  return apiSuccess(payload);
}
