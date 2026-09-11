# RAKSHA — Deployment

Target platform: **Vercel**, using its native Next.js support. No `vercel.json`,
no Docker, no Kubernetes, no custom Node server — none of these are needed and
each would add a failure mode.

---

## 1. Flow

```
GitHub push
   │
   ├── feature branch ──► Vercel Preview deployment (unique URL per push)
   │
   └── merge to main ───► Vercel Production deployment
```

---

## 2. Project settings

Because RAKSHA is a pnpm workspace with the application in a subdirectory, the
**Root Directory** setting is the one piece of configuration that matters.

| Setting | Value |
|---|---|
| Framework Preset | Next.js |
| **Root Directory** | `apps/web` |
| Include files outside root directory | **Enabled** (required — the lockfile and workspace config live at the repo root) |
| Install Command | default (Vercel detects pnpm from `pnpm-lock.yaml`) |
| Build Command | default (`next build`) |
| Output Directory | default |
| Node.js Version | 20.x or later (`engines.node` is `>=20.9.0`) |

The root `package.json` declares `packageManager: pnpm@10.18.2`, so Vercel uses
the same pnpm version the team uses locally.

### Why Root Directory matters

With Root Directory left at the repo root, Vercel finds the workspace root
`package.json`, which has no `build` script producing a Next.js app, and the
deployment fails or produces nothing useful. Setting it to `apps/web` while
enabling *Include files outside root directory* gives Vercel the app to build
plus the lockfile it needs to install from.

---

## 3. Environment variables

Set these in **Project → Settings → Environment Variables**, scoped per
environment. Never commit values; never paste them into documentation or a
pull request.

### Preview

| Variable | Scope | Required |
|---|---|---|
| `NEXT_PUBLIC_APP_ENV` | Public | Set to `preview` |
| `NEXT_PUBLIC_APP_URL` | Public | Preview URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | From Phase 1 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | From Phase 1 |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | From Phase 4 |
| `NEXT_PUBLIC_MAP_STYLE_URL` | Public | From Phase 3 |
| `OPEN_METEO_BASE_URL` | Server only | Optional; has a default |

Point Preview at a **separate Supabase project** from Production. Preview
deployments run unreviewed branch code against whatever database they are
given.

### Production

Same variable names, production values, `NEXT_PUBLIC_APP_ENV=production`.

### Phase 0 specifically

**None of these are required.** The application builds, deploys and serves `/`
and `/api/health` with no environment variables set at all. Unconfigured
integrations render an honest "not configured" state rather than failing the
build. Do not invent placeholder credentials to satisfy a validator.

---

## 4. Secret handling

- `NEXT_PUBLIC_*` values are **inlined into the browser bundle**. Anything
  prefixed this way is public forever, including in past deployments.
- `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security. It is read only in
  modules that import `server-only`, which makes a client import a build error.
- Rotate any key that has ever been committed, logged or pasted into a chat.
  Removing it from the current commit does not remove it from history.

---

## 5. Verifying a deployment

A URL returned by the CLI is not evidence of a working deployment. Check both:

```bash
curl -i https://<deployment-url>/
curl -s https://<deployment-url>/api/health
```

Expected from the health endpoint:

```json
{"success":true,"data":{"status":"ok","service":"raksha-web","environment":"preview","phase":"0","timestamp":"..."}}
```

Also confirm the page renders with styling applied, and check
**Deployment → Runtime Logs** for server exceptions. Never promote a Preview to
Production that has not passed this check.

---

## 6. First-time CLI setup

```bash
npx vercel login
npx vercel link          # choose the existing project; do not create a duplicate
npx vercel               # Preview deployment
npx vercel --prod        # Production deployment, after the Preview passes
```

`vercel link` writes `.vercel/`, which is git-ignored. If the project is
already linked in the Vercel dashboard to this GitHub repository, pushes deploy
automatically and the CLI is only needed for ad-hoc deployments.
