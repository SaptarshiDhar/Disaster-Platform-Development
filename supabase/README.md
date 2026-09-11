# Supabase

Database migrations and seed data for RAKSHA.

**Nothing is implemented yet.** Schema work begins in Phase 2 — see
[../docs/database-schema.md](../docs/database-schema.md) for the plan.

## Layout

```
supabase/
├── migrations/   Ordered SQL migrations (Phase 2+)
└── seed/         Reference and demo seed data (Phase 2+)
```

## Rules

1. **PostGIS first.** The initial migration enables the extension:
   `CREATE EXTENSION IF NOT EXISTS postgis;`
2. **Every table gets RLS.** `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` in
   the same migration that creates the table, with at least one policy. A
   table with RLS enabled and no policy denies everything — that is the safe
   default, not a bug.
3. **SRID is always explicit.** `geometry(Point, 4326)`, never bare `geometry`.
4. **GiST index every geometry column** that is queried spatially.
5. **Metres need a projected CRS.** Use `::geography` or
   `ST_Transform(geom, <utm>)`. `ST_Distance` on raw 4326 returns degrees.
6. **Seed data is classified.** Anything in `seed/` that is not from a real
   external source is marked `classification = 'demo'` so the UI labels it.

## Local workflow

Apply migrations through the Supabase dashboard SQL editor or the Supabase CLI.
The service-role key is required for migrations and must never leave a
server-side context.
