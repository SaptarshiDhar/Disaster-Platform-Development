# RAKSHA

**AI-Powered Hazard-Based Red Zone, Carrying Capacity and Relocation Decision
Support System**

Smart India Hackathon 2026 · Problem Statement **SIH26191**

---

## Overview

India's disaster-prone regions face recurring floods, landslides, cloudbursts,
coastal erosion and compound multi-hazard exposure. Many habitations remain in
unsafe locations, producing repeated loss of life, infrastructure damage,
livelihood disruption and recurring response expenditure. Relocation efforts
today are largely reactive.

RAKSHA is a GIS-enabled **decision-support** platform that assembles hazard,
population, terrain and infrastructure data into reviewable evidence, so that
authorities can make relocation decisions with a traceable basis.

Intended users: NDRF, SDMA, DDMA, District Administration, GIS analysts and
authorised disaster-management planners.

## Capabilities

Planned across the phase roadmap — see
[docs/product-requirements.md](docs/product-requirements.md).

- Dynamic hazard-based red zone identification
- Multi-hazard spatial visualisation
- Vulnerable habitation identification and population exposure assessment
- Candidate relocation site identification
- Carrying-capacity assessment and suitability analysis
- Relocation prioritisation across Immediate / Short-Term / Medium-Term
- Evidence-supported recommendations with full data provenance

## Technology

| Layer | Technology |
|---|---|
| Application | Next.js (App Router), React, TypeScript (strict) |
| Styling | Tailwind CSS, shadcn/ui, Lucide React |
| Mapping | MapLibre GL JS |
| Charts | Recharts |
| Forms & validation | React Hook Form, Zod |
| Auth & data | Supabase Auth, PostgreSQL + PostGIS |
| Hosting | Vercel |
| Tooling | pnpm workspace, ESLint |

Future computational GIS/ML workloads (Python, FastAPI, GeoPandas, Rasterio,
GDAL) are planned as a separate service and are **not** part of the current
system — see [docs/architecture.md](docs/architecture.md).

## Architecture

```
Authority User
      │
      ▼
 Vercel Edge / CDN
      │
      ▼
 Next.js Application  (Server Components · Route Handlers)
      │
      ├────────► Supabase Auth
      ├────────► PostgreSQL + PostGIS
      ├────────► External APIs
      └────────► Future GIS / ML Service
```

Full detail, including the server/client boundary and CRS strategy, in
[docs/architecture.md](docs/architecture.md).

## Repository structure

This is a pnpm workspace. The RAKSHA application is `apps/web`; the packages
under `artifacts/` and `lib/` are the preserved earlier Replit prototype.

```
apps/
└── web/                    RAKSHA Next.js application  ← active development
    └── src/
        ├── app/            Routes, layouts, error states, API handlers
        ├── components/     UI, layout, GIS, analytics, forms
        ├── features/       Domain features (hazards, red zones, relocation…)
        ├── lib/            config · supabase · gis · validation · utils
        ├── server/         Repositories, services, queries, server actions
        └── types/          api · common · gis · hazards
artifacts/
├── blank-react-vite-app/   Earlier Vite prototype UI (preserved)
├── api-server/             Earlier Express API (preserved)
└── mockup-sandbox/         Earlier mockup sandbox (preserved)
lib/                        Earlier Drizzle / Orval packages (preserved)
docs/                       Architecture, PRD, schema, API, policy, workflow
supabase/                   Migrations and seed data (Phase 2+)
.github/workflows/          CI
```

## Installation

Requires **Node.js 20.9+**. pnpm comes from Corepack, which ships with Node —
no global install needed.

```bash
git clone https://github.com/SaptarshiDhar/Disaster-Platform-Development.git
cd Disaster-Platform-Development

corepack pnpm install --filter @workspace/web...
```

Use `corepack pnpm` in place of `pnpm` if pnpm is not on your PATH.

## Local development

```bash
cp apps/web/.env.example apps/web/.env.local   # optional — see below
corepack pnpm run web:dev
```

Then open <http://localhost:3000> and <http://localhost:3000/api/health>.

Other commands:

```bash
corepack pnpm run web:typecheck   # tsc --noEmit
corepack pnpm run web:lint        # eslint
corepack pnpm run web:build       # next build
```

## Environment variables

Template: [`apps/web/.env.example`](apps/web/.env.example). Copy it to
`apps/web/.env.local`, which is git-ignored.

| Variable | Exposure | Needed from |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Public | Optional (defaults to localhost) |
| `NEXT_PUBLIC_APP_ENV` | Public | Optional (defaults to `development`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Phase 1 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Phase 1 |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | Phase 4 |
| `NEXT_PUBLIC_MAP_STYLE_URL` | Public | Phase 3 |
| `OPEN_METEO_BASE_URL` | Server only | Optional (has a default) |

**The current phase requires none of them.** The app builds and runs with no
environment file; unconfigured integrations report themselves as not
configured rather than failing.

## Supabase configuration

Not yet provisioned. When it is (Phase 1–2):

1. Create a Supabase project and enable PostGIS
   (`CREATE EXTENSION IF NOT EXISTS postgis;`).
2. Put the project URL and anon key in `apps/web/.env.local`.
3. Keep the service-role key out of the browser — it is read only by modules
   importing `server-only`.
4. Enable Row Level Security on every table.

See [supabase/README.md](supabase/README.md) and
[docs/database-schema.md](docs/database-schema.md).

## GIS architecture

MapLibre GL JS renders; **PostGIS is the source of truth**. Geometry is stored
and exchanged in EPSG:4326 and reprojected to an appropriate UTM zone for any
metric analysis — distances and areas are never computed from raw degrees. See
`apps/web/src/lib/gis/crs.ts` and
[docs/architecture.md](docs/architecture.md).

## Git workflow

`main` is production and is never committed to directly. Work on
`feature/*`, `fix/*` or `chore/*` branches and open a pull request; CI and a
Vercel Preview run on every one. Full conventions in
[docs/team-workflow.md](docs/team-workflow.md).

## Testing

Not yet established — Phase 9. Unit tests will cover GIS maths and scoring;
integration tests will cover route handlers and RLS policies.

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs typecheck, lint and
build for `apps/web` on every push to `main` and every pull request. It runs
with **no secrets**, which is the check that the build never depends on a
credential.

## Deployment

Vercel, using native Next.js support. The one setting that matters is **Root
Directory = `apps/web`** with *Include files outside root directory* enabled.
Full instructions in [docs/deployment.md](docs/deployment.md).

## Data source policy

Every dataset is classified as **Official / External Source Data**,
**Processed / Derived Data**, **Demo / Simulated Data** or **Experimental Model
Output**, and the UI must show that classification. Fabricating government
statistics or attributing prototype data to a real agency is prohibited. See
[docs/demo-data-policy.md](docs/demo-data-policy.md).

## Security

- Never commit `.env` or `.env.local`.
- Never place a secret behind `NEXT_PUBLIC_*` — those values are inlined into
  the browser bundle permanently.
- The service-role key bypasses RLS; it is confined to `server-only` modules.
- Authorisation is enforced by RLS in the database. Frontend role checks affect
  presentation only.
- Validate all input with Zod at the boundary. Never return stack traces.

## Roadmap

Phase 0 foundation ✅ · Phase 1 auth & dashboard shell · Phase 2 PostGIS schema
& RLS · Phase 3 GIS map · Phase 4 ingestion · Phase 5 hazard engine · Phase 6
carrying capacity · Phase 7 relocation priority · Phase 8 analytics & reports ·
Phase 9 testing · Phase 10 demo hardening.

Detail in [docs/development-plan.md](docs/development-plan.md).

---

## Prototype disclaimer

> RAKSHA is a prototype decision-support platform developed for Smart India
> Hackathon 2026. Hazard classifications, carrying-capacity estimates,
> relocation rankings and recommendations produced by the prototype must not be
> interpreted as official government evacuation or relocation orders unless
> independently validated and authorised by the competent authorities.
