# Server layer

Everything here runs on the server only and must never be imported from a
client component.

```
repositories/   Data access. The only place PostGIS queries are written.
services/       Business logic composed from repositories.
queries/        Read-side helpers for Server Components.
actions/        Server Actions for mutations.
```

## Rules

1. **SQL lives here and nowhere else.** A presentation component that contains
   a query is a bug.
2. Modules that read secrets or use the Supabase server/admin client import
   `server-only`, making an accidental client import a build error.
3. Repositories return domain types from `src/types`, not raw database rows.
4. Every returned dataset carries its `DataProvenance`.
5. Metric geometry operations happen in PostGIS against a projected CRS — see
   `src/lib/gis/crs.ts`.

Empty in Phase 0; populated from Phase 2 once the schema exists.
