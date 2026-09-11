# RAKSHA — API Contract

**Status:** plan. Only `GET /api/health` is implemented in Phase 0.

All endpoints live under `/api` as Next.js Route Handlers in
`apps/web/src/app/api/`.

---

## 1. Response envelope

Every endpoint returns the same discriminated union, so clients narrow on
`success` without casts.

```ts
type ApiSuccess<T> = { success: true; data: T };

type ApiError = {
  success: false;
  error: { code: ApiErrorCode; message: string; details?: unknown };
};
```

Helpers: `apiSuccess(data)` and `apiError(code, message, details)` in
`src/lib/api/response.ts`.

### Error codes

| Code | HTTP | Meaning |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Request failed Zod validation; `details` carries the issues |
| `UNAUTHENTICATED` | 401 | No valid session |
| `FORBIDDEN` | 403 | Authenticated but not permitted for this jurisdiction |
| `NOT_FOUND` | 404 | Resource absent, or hidden by RLS |
| `CONFLICT` | 409 | State conflict |
| `DATABASE_ERROR` | 500 | Query failed |
| `UPSTREAM_ERROR` | 502 | External provider failed |
| `INTERNAL_ERROR` | 500 | Unclassified failure |

`message` is written for a human operator. **Stack traces, SQL text and
internal identifiers never cross the network boundary** — they go to server
logs, correlated by the Next.js `error.digest`.

---

## 2. Endpoints

### Implemented

#### `GET /api/health`

Unauthenticated liveness probe. Touches no external service, so it stays
meaningful when Supabase is down or unconfigured.

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "raksha-web",
    "environment": "development",
    "phase": "0",
    "timestamp": "2026-09-11T09:00:00.000Z"
  }
}
```

### Planned

| Endpoint | Phase | Notes |
|---|---|---|
| `GET /api/habitations` | 2 | Filter by boundary, hazard, risk band |
| `GET /api/habitations/[id]` | 2 | Detail with population observations |
| `GET /api/hazards` | 5 | Hazard type catalogue |
| `GET /api/hazards/events` | 5 | **Historical events.** Never a forecast |
| `GET /api/red-zones` | 5 | Derived zones as GeoJSON, with provenance |
| `GET /api/relocation/sites` | 7 | Candidate sites |
| `GET /api/relocation/sites/[id]` | 7 | Site detail with capacity assessment |
| `POST /api/relocation/assessments` | 7 | Create an assessment (auth + validation) |
| `GET /api/carrying-capacity` | 6 | Capacity results per site |
| `GET /api/weather` | 4 | Operational context, proxied server-side |
| `GET /api/analytics/overview` | 8 | Dashboard aggregates |

---

## 3. Rules for every handler

1. **Validate at the boundary.** Parse query parameters and bodies with Zod
   before use. Never trust an inbound shape.
2. **Authorise server-side.** Read the session via
   `lib/supabase/server.ts`; RLS is the real boundary, but the handler still
   returns a correct 401/403 rather than an empty list.
3. **Never use the admin client to serve a user request** without an explicit
   separate authorisation check — it bypasses RLS.
4. **Attach provenance.** Any response carrying data returns its
   `DataProvenance` alongside it.
5. **Geometry is GeoJSON in EPSG:4326**, `[lng, lat]` axis order.
6. **Proxy external APIs server-side** so provider keys stay off the client.
