# RAKSHA — Development Plan

Phases are sequential in dependency, not necessarily in calendar time. Each
phase states its exit criteria — the phase is not done until those are true.

---

## Phase 0 — Foundation, Architecture & Deployment ✅

Next.js App Router application at `apps/web` inside the existing pnpm
workspace. Strict TypeScript, Tailwind, Supabase client separation, GIS CRS
utilities, typed API envelope, health endpoint, documentation set, CI, Vercel
readiness. Existing Replit work preserved untouched.

**Exit:** typecheck, lint and production build pass; `/` and `/api/health`
respond locally; repository is Vercel-deployable.

## Phase 1 — Authentication & Authority Dashboard Shell

Supabase Auth, login, session handling via middleware, protected routes, the
role model, and the dashboard shell (sidebar, top navigation, route structure).
The existing `CommanderLogin` and `CommanderDashboard` screens from the Vite
prototype are ported here.

**Exit:** a user can sign in, reach a protected dashboard route, and sign out;
unauthenticated access redirects.

## Phase 2 — PostgreSQL / PostGIS Schema & RLS

Enable PostGIS. Implement the core tables from `database-schema.md`, GiST
indexes, and an RLS policy on every table. Jurisdiction scoping via
`user_roles.boundary_id`.

**Exit:** every table has RLS enabled with a tested policy; a district-scoped
user cannot read another district's rows.

## Phase 3 — GIS Map & Layers

MapLibre canvas, layer registry, legend with classification labels,
feature selection, dynamic import so map code stays out of non-map bundles.

**Exit:** layers render from the database; every layer's legend states its
classification and vintage.

## Phase 4 — Data Ingestion Pipelines

Loaders for administrative boundaries, population, hazard inventories and
infrastructure. `data_sources` and `processing_runs` populated on every run.
Weather proxied server-side.

**Exit:** a dataset can be ingested reproducibly and traced back to its source
and run.

## Phase 5 — Hazard / Red Zone Engine

Hazard events and layers separated in both storage and UI. Red zone derivation
with recorded method and version. All metric geometry via projected CRS.

**Exit:** a red zone can be opened and its inputs and method inspected.

## Phase 6 — Carrying Capacity Engine

Site capacity assessment. Factors configurable; any weight shown in the UI as
a prototype assumption until it is evidence-based or stakeholder-agreed.

**Exit:** capacity results are reproducible from a `processing_run_id`.

## Phase 7 — Relocation Priority Engine

Habitation-to-site suitability, prioritisation across Immediate / Short-Term /
Medium-Term, with per-recommendation evidence and officer override.

**Exit:** a recommendation shows its evidence and can be overridden with a
recorded reason.

## Phase 8 — Analytics & Reports

Aggregate views and exportable assessment documents carrying provenance and
the prototype disclaimer.

## Phase 9 — Testing & Validation

Unit tests for GIS maths and scoring, integration tests for route handlers and
RLS policies, fixtures under `tests/fixtures`.

**Exit:** RLS policies and CRS maths are covered by tests, not by assumption.

## Phase 10 — SIH Demo Hardening

Demo dataset clearly classified as `demo`, rehearsed narrative, performance
pass, accessibility pass, failure-mode handling.

---

## Introducing the Python GIS/ML service

`services/geospatial-engine/` is created only when a workload genuinely cannot
run in a Vercel function — raster processing via Rasterio/GDAL, long-running
geoprocessing, ML inference, or bulk GeoPandas pipelines. Expected around
Phase 4–6. Until then, keeping all data access behind
`src/server/repositories/` means the move changes one layer, not the app.
