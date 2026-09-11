# Features

Domain-driven grouping. Each feature owns the components, hooks and types that
only it uses; anything shared moves up into `src/components`, `src/lib` or
`src/types`.

Planned, matching the roadmap in `docs/development-plan.md`:

```
auth/                hazards/            habitations/
red-zones/           carrying-capacity/  relocation/
weather/             infrastructure/     analytics/
```

A feature may depend on `src/lib`, `src/types` and `src/server`. It must not
import from another feature — if two need the same thing, it belongs in shared
code.

Created as features are built, rather than pre-generated as empty folders.
