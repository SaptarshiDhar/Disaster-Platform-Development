// Server-only helper for the Python FastAPI cloudburst engine.
// Never imported from a "use client" component — routes under
// src/app/api/cloudburst/* and src/lib/hazards/aggregate.ts are the only
// callers, so CLOUDBURST_ENGINE_API_URL (no NEXT_PUBLIC_ prefix) never reaches
// the browser bundle. Mirrors flood-engine.ts / landslide-engine.ts exactly.

const BASE_URL = process.env.CLOUDBURST_ENGINE_API_URL ?? "http://127.0.0.1:8030";

export class CloudburstEngineRequestError extends Error {
  constructor(public status: number, public body: unknown) {
    super(`Cloudburst engine request failed with status ${status}`);
  }
}

export async function cloudburstEngineFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new CloudburstEngineRequestError(res.status, body);
  }
  return body;
}
