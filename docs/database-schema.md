# RAKSHA — Database Schema Plan

**Status:** design document. **No tables are implemented in Phase 0.**
Implementation begins in Phase 2.

Target: Supabase-managed **PostgreSQL** with the **PostGIS** extension.

---

## 1. Conventions

- Primary keys: `uuid` with `gen_random_uuid()`.
- Timestamps: `timestamptz`, always UTC.
- Geometry columns: `geometry(<Type>, 4326)` — SRID is always declared.
- Every table carrying externally sourced or derived data references
  `data_sources` and, where applicable, `processing_runs`.
- Every table has RLS enabled. There are no exceptions; a table without a
  policy denies access rather than allowing it.
- Names are `snake_case`, plural for tables.

---

## 2. Table plan

### Identity and access

| Table | Purpose | Key columns |
|---|---|---|
| `profiles` | Application profile per Supabase auth user | `id` (= `auth.users.id`), `full_name`, `agency`, `designation` |
| `roles` | Role catalogue | `key`, `label`, `scope_level` |
| `user_roles` | Role assignment, scoped to a jurisdiction | `profile_id`, `role_key`, `boundary_id` |

Roles: `admin`, `national_authority`, `state_authority`, `district_authority`,
`analyst`, `viewer`. Scoping a role to a `boundary_id` is what lets a district
officer see their district and not the whole country.

### Administrative geography

| Table | Purpose | Geometry |
|---|---|---|
| `administrative_boundaries` | States, districts, sub-districts, villages in one self-referencing hierarchy | `MultiPolygon, 4326` |
| `habitations` | Settlements assessed for hazard exposure | `Point, 4326` |
| `population_observations` | Population per habitation per source-year — never a single mutable "population" column | — |

Population is modelled as time-stamped observations because datasets disagree
and are published for different years. Collapsing them into one number would
silently mix vintages.

### Hazard

| Table | Purpose | Geometry |
|---|---|---|
| `hazard_types` | Catalogue: flood, landslide, cloudburst, coastal erosion, earthquake | — |
| `hazard_events` | Things recorded to have **happened**, with a date | `Geometry, 4326` (varies by source) |
| `hazard_layers` | Modelled susceptibility / exposure / forecast surfaces | `MultiPolygon, 4326` |
| `red_zones` | Derived hazard-based restriction zones | `MultiPolygon, 4326` |

`hazard_events` and `hazard_layers` are separate tables on purpose. An event is
history; a layer is a model. Merging them would let a past flood be read as a
prediction.

### Infrastructure

| Table | Purpose | Geometry |
|---|---|---|
| `infrastructure` | Healthcare, schools, water, electricity, critical facilities | `Point, 4326` |
| `roads` | Road network for accessibility analysis | `MultiLineString, 4326` |

### Relocation

| Table | Purpose | Geometry |
|---|---|---|
| `candidate_relocation_sites` | Potential resettlement locations | `Geometry(Polygon\|Point), 4326` |
| `relocation_site_capacity` | Carrying-capacity assessment per site per run | — |
| `habitation_site_scores` | Suitability pairing of a habitation to a site | — |
| `relocation_assessments` | A completed, reviewable assessment with its recommendation | — |

Capacity and scores are keyed by `processing_run_id`, so a recomputation
produces a new row rather than overwriting the result an officer previously saw.

### Context and provenance

| Table | Purpose |
|---|---|
| `weather_observations` | Operational weather context (Open-Meteo and authorised sources) |
| `data_sources` | Provenance registry — one row per dataset version |
| `processing_runs` | One row per derivation: inputs, method, version, timing, outcome |
| `audit_logs` | Who viewed or changed what |

---

## 3. Provenance model

`data_sources` columns:

```
source_name        source_url         source_type      source_agency
license            dataset_version    published_at     retrieved_at
valid_from         valid_to           processing_method
processing_version is_demo            classification
```

`classification` is the enum that drives UI labelling:
`official` · `derived` · `demo` · `experimental`. See
[demo-data-policy.md](./demo-data-policy.md).

Not every external source publishes every field; unknown fields stay null
rather than being filled with a plausible guess.

---

## 4. Spatial indexing

```sql
CREATE INDEX idx_habitations_geom
  ON habitations USING GIST (geom);

CREATE INDEX idx_red_zones_geom
  ON red_zones USING GIST (geom);

CREATE INDEX idx_admin_boundaries_geom
  ON administrative_boundaries USING GIST (geom);
```

A GiST index on every geometry column that is queried spatially. Alongside
these, B-tree indexes on the foreign keys used for filtering
(`habitation_id`, `hazard_type_id`, `processing_run_id`) and on
`hazard_events(occurred_at)`.

### Measurement rule

Area and distance are computed with `geography` casts or by transforming to a
projected CRS:

```sql
-- Correct: metres, via the geography type
ST_Distance(a.geom::geography, b.geom::geography)

-- Correct: metres, via an explicit projected CRS
ST_Area(ST_Transform(geom, 32643))

-- WRONG: returns degrees, not metres
ST_Distance(a.geom, b.geom)
```

---

## 5. Row Level Security

RLS is the authorisation boundary. Frontend role checks are presentation only.

Intended policy shape:

- `profiles` — a user reads and updates only their own row.
- Reference tables (`hazard_types`, `roles`) — readable by any authenticated user.
- Jurisdiction-scoped tables — readable where the user holds a role whose
  `boundary_id` contains the row's boundary, walking the
  `administrative_boundaries` hierarchy.
- Writes to hazard, capacity and relocation tables — restricted to `analyst`
  and `admin`, and only within their jurisdiction.
- `audit_logs` — insert-only for users; readable by `admin`.

The service-role key bypasses all of the above, which is why it is confined to
ingestion jobs in server-only modules.
