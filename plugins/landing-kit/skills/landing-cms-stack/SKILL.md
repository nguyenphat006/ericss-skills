---
name: landing-cms-stack
description: 'Build a CMS-backed landing page or company website for any industry (manufacturing, services, SaaS, restaurants, hotels, real estate, education, healthcare, nonprofits, events...) on a proven stack: Next.js 16 (App Router, next-intl, shadcn/Tailwind 4) rendering on the server with tag-based caching, reading a read-only DRF API from a Django 5.2 LTS + Wagtail 8 CMS (drafts, revisions, translations, HMAC revalidate webhook), deployed with Docker Compose (Nginx + web + cms + Postgres). Always starts with discovery (business, goals, audience, content structure and specs, brand, features, infrastructure) written to a brief. Covers repo layout, content models per industry, backend layering, caching, i18n, performance, security, CI and templates. Use whenever the user wants to create, scaffold, extend or deploy a website with a CMS, connect Next.js to Django/Wagtail, add a content type, or asks about fetching, caching or revalidation, even if the skill is not named. Pairs with landing-design-system for the UI.'
---

# Landing page + CMS (Next.js + Django/Wagtail), for any industry

This skill packages a way to build a CMS-backed website that is production-grade from the first commit. The technical skeleton stays the same for every project. What changes per industry is the **content model** (products, services, rooms, courses, projects...) and the **visual design**.

It was distilled from a reference project, **BFC** (a B2B product catalog). Mentions of BFC are examples, not requirements.

The UI side (tokens, components, section layouts, page presets per industry) lives in the companion skill **landing-design-system**. Both skills ship together in the `landing-kit` plugin, so use them together when building a new site. **Always talk to the user in their own language.**

## Architecture
```
Browser ──HTML/RSC──▶ Next.js (frontend/, Node server)
                          │  server-side fetch, cached by tag "cms" (+ 1 hour expiry)
                          ▼
                     Django + Wagtail CMS (backend/)  ── Postgres
                          │  /api/v1/... (DRF, read-only, published content only)
                          │  Wagtail admin at /admin (editors)
                          └─ publish ──HMAC webhook──▶ Next /api/revalidate ──▶ revalidateTag("cms", "max")
```

Good fit:
- marketing or catalog sites where every visitor sees the same content and content changes occasionally;
- SEO and speed matter;
- non-developers must edit content.

Poor fit:
- logged-in web apps with per-user data (use a normal SPA/API architecture);
- 1 to 3 static pages that never change (skip the CMS, use Next + message files).

Five core principles:
1. **The browser never calls the CMS.** All fetching happens in Server Components or route handlers. The CMS address lives in an env var without the `NEXT_PUBLIC_` prefix, which would freeze it into the client bundle.
2. **HTML is cached; the CMS is only hit when the cache is stale.** Publishing marks the cache stale via webhook. The 1 hour expiry is a safety net if the webhook fails.
3. **UI strings live in `messages/*.json`; editorial content lives in the CMS.** Do not mix the two.
4. **Layer the backend from day one:** models / services (writes) / selectors (reads) / api (thin) / wagtail_hooks (admin). Keep logic out of views and admin, so the admin UI or another channel can change later without rewriting business logic.
5. **Mock first, CMS second.** The frontend runs on mock data while `CMS_API_URL` is unset. The data access layer returns the same UI types from both sources.

## Workflow
End every stage with a clean commit (tests, lint and types green). Before each stage, tell the user briefly what you will do. Ask when a choice is genuinely theirs.

**G-1. Discovery (always; never skip).** Follow `references/discovery.md`:
1. Read what the user already has before asking: old website, company profile, catalogue, spreadsheets, logo.
2. Ask in 6 rounds, at most 4 questions per round, each with a recommended option:
   1. business and goals;
   2. site structure;
   3. **main content structure and specs**: dig deepest here, and ask for 2 or 3 real sample items;
   4. brand and colors;
   5. features;
   6. infrastructure.
3. Record everything in `docs/brief.md` (template: `assets/brief-template.md`), including the content model diagram.
4. Get the user's confirmation before scaffolding.

If the project already has `docs/brief.md`, read it before doing anything else.

**G0. Frontend skeleton** (`references/frontend.md`):
- Next + next-intl (`proxy.ts`) + shadcn/Tailwind 4;
- `features/` + `components/shared` + `config` + `data` + `lib/cms` structure;
- mock data, static pages;
- UI from landing-design-system.

**G1. Backend foundation** (`references/backend.md`):
- uv + pyproject with exact pins; settings split into base/dev/test/prod;
- custom User, base models, auditlog/axes/argon2, one Admin role;
- API v1 with a standard error format and pagination; health checks;
- branded admin;
- ruff/mypy/pytest, pre-commit, CI, Dockerfile, ADRs.

**G2. The main content type.** Pick the pattern from `references/content-models.md` for the industry, then build:
- the model (drafts, revisions, translations when needed), WebP image renditions;
- a selector with locale fallback, serializers, read-only views;
- an idempotent import command (from mock or a spreadsheet), and tests.

**G3. Connect the frontend to the CMS** (`references/data-flow.md`):
- CMS client (tag, revalidate, timeout, `CmsError`, `server-only`), types generated from OpenAPI;
- data access that picks CMS or mock;
- HMAC webhook, `images.remotePatterns`, an `error.tsx` page.

**G4+.** Repeat G2 and G3 for each remaining content type. Then: contact form stored in the CMS (Inquiry), draft preview (Draft Mode), SEO (sitemap, hreflang, JSON-LD).

**Deploy** with `references/deploy.md`. Before the first deploy, clear every item under "Must do before production".

## Templates (`assets/templates`)
These are snapshots of working code from the reference project. `deploy/` is a pre-written template that has not yet run on a real server. To use them:
- copy the files;
- **rename the brand, domains, ports and header prefix**;
- keep the structure;
- read the comments, which explain why each choice was made. Some comments are still in Vietnamese.

Where the code is catalog-specific (`catalog.ts`, `catalog_signals.py`), adapt it to the project's content model.

| Path | Use |
| --- | --- |
| `backend/pyproject.toml` | uv, poe tasks (dev, test, lint, typecheck, schema, check), ruff/mypy/pytest config |
| `backend/config/settings/*.py`, `config/logging.py` | Settings per environment, fail-closed prod, structlog |
| `backend/apps/core/models/base.py` | Base models: TimeStamped / UserStamped / PublicId / Archivable |
| `backend/apps/core/api/{exceptions,pagination,schema}.py` | One error format, one pagination format, OpenAPI with public API only |
| `backend/apps/core/revalidate.py`, `apps/catalog_signals.py` | HMAC webhook sent after commit; publish/unpublish/delete signals |
| `backend/Dockerfile`, `.dockerignore`, `.env.example` | Multi-stage uv image, non-root user, healthcheck |
| `repo/.pre-commit-config.yaml`, `repo/.github/workflows/backend.yml` | pre-commit (ruff, gitleaks, makemigrations --check), CI |
| `frontend/src/lib/cms/{client,catalog}.ts` | Server-only CMS client + API-to-UI type mapping |
| `frontend/src/app/api/revalidate/route.ts` | Webhook: HMAC check, replay protection, tag whitelist |
| `frontend/src/app/[locale]/error.tsx` | Error page when the CMS is unreachable |
| `frontend/src/i18n/*`, `src/proxy.ts`, `next.config.ts`, `.env.example` | next-intl, CMS images, security headers |
| `deploy/docker-compose.prod.yml`, `deploy/nginx/site.conf`, `deploy/frontend.Dockerfile` | Production templates |
| `assets/brief-template.md` (outside `templates/`) | Discovery brief template |

## Working rules
- **Pin exact versions.** Only add releases at least 2 weeks old. Pin Python with `==`; pin Docker images and GitHub Actions to specific tags. Record the policy in an ADR.
- **Next.js 16 differs from your training data.** Read `node_modules/next/dist/docs/` before using an unfamiliar API. Known differences:
  - `middleware.ts` became `proxy.ts`;
  - `params` is a Promise;
  - `revalidateTag(tag, "max")` needs a second argument;
  - `images.dangerouslyAllowLocalIP` exists;
  - typed helpers such as `PageProps<"/[locale]">`.
- **Secrets** live only in `backend/.env` and `frontend/.env.local` (both gitignored). Never put them in images, logs or commits. The shared secret `CMS_SHARED_SECRET` (backend) must equal `CMS_REVALIDATE_SECRET` (frontend).
- **Internal data** never reaches the public site: customer names, cost prices, internal notes. Any sync from an ERP or CRM must have a review step.
- **Dev environment:**
  - Ask whether the user wants Docker on their dev machine. The default is no: SQLite + a virtualenv, with Docker only on servers and CI.
  - Start and stop only the project's own processes. Never touch Docker, WSL or other background services, and never kill by port range.
- **Architecture decisions** go into short ADRs in `backend/docs/adr/`.
- **Code comments** record the **reason**, and the date when the user picked an option. Identifiers in English; comment language follows the team.

## References
- `references/discovery.md`: the 6-round question set, and how answers turn into decisions. **Read first.**
- `references/content-models.md`: content models per industry (catalog, services, rooms, menu, real estate, courses, healthcare, events) plus shared types (posts, team, FAQ, testimonials...). For each: snippet vs Page, translated fields, filters, API.
- `references/backend.md`: app layout, base models, content with drafts/revisions/translations, locale-fallback selectors, API, images, import, webhook, admin, security, tests, CI.
- `references/frontend.md`: Next structure, i18n, data layer, server-only, CMS errors, server-action forms, SEO, performance.
- `references/data-flow.md`: the life of a request and of a publish, cache layers, what you can and cannot see in the Network tab.
- `references/deploy.md`: Docker Compose, Nginx, env vars, migrations, backups, production traps, scaling.
- `references/gotchas.md`: issues already hit and their fixes (Windows, Next 16, Wagtail, mypy...).
