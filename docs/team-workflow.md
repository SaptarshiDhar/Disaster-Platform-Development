# RAKSHA — Team Workflow

One repository: `SaptarshiDhar/Disaster-Platform-Development`. Do not create
additional repositories for RAKSHA components.

---

## Branches

`main` is the production branch and is deployed by Vercel. It is never
committed to directly.

| Prefix | Use | Example |
|---|---|---|
| `feature/` | New capability | `feature/gis-map` |
| `fix/` | Bug fix | `fix/health-route-cache` |
| `chore/` | Tooling, config, docs | `chore/foundation-architecture` |

Planned feature branches: `feature/auth`, `feature/dashboard`,
`feature/gis-map`, `feature/database`, `feature/data-pipeline`,
`feature/hazard-engine`, `feature/carrying-capacity`,
`feature/relocation-engine`, `feature/analytics`.

---

## Flow

```
branch → commit → push → pull request → CI → Vercel Preview
       → review → merge to main → Production deployment
```

Every pull request gets a Vercel Preview URL. **Review the preview, not just
the diff** — especially for map and dashboard work.

---

## Before you push

```bash
corepack pnpm run web:typecheck
corepack pnpm run web:lint
corepack pnpm run web:build
```

CI runs the same three. Fix failures rather than disabling the check — the
rules exist because silent type and lint failures in a GIS application produce
wrong numbers, not just untidy code.

---

## Commits

Conventional-commit prefixes, matching the existing history:

```
feat: add red zone layer toggle
fix: correct UTM zone selection west of 72E
chore: document RLS policy shape
docs: expand carrying capacity factor list
```

---

## Review checklist

- [ ] Typecheck, lint and build pass locally
- [ ] No `any` — `unknown` plus explicit narrowing instead
- [ ] `"use client"` only where interactivity genuinely requires it
- [ ] No secret in a `NEXT_PUBLIC_*` variable
- [ ] No SQL in a presentation component
- [ ] Any rendered dataset surfaces its classification
- [ ] Distances and areas use a projected CRS, never raw degrees
- [ ] New environment variables added to `apps/web/.env.example`
- [ ] Vercel Preview checked

---

## Workspace layout

This is a pnpm workspace. Install from the repository root:

```bash
corepack pnpm install
```

`apps/web` is the RAKSHA application under active development. The packages
under `artifacts/` and `lib/` are the preserved Replit prototype — do not
delete them; screens are being ported out of them incrementally.

Use `corepack pnpm` if pnpm is not installed globally.

---

## Never

- `git push --force` to a shared branch
- `git reset --hard` or `git clean -fd` on someone else's work
- Rewriting `main` history
- Committing `.env` or `.env.local`
- Deleting the preserved Replit packages without team agreement
