# Known issues and fixes (BFC project, 11/2026)

## Windows machines (seen in the reference project; check whether the current machine is similar)
| Symptom | Cause / fix |
| --- | --- |
| Cannot run python.exe inside the repo's `.venv` | Group policy blocks .exe files under `Documents`. Put the venv outside the repo: `UV_PROJECT_ENVIRONMENT="$LOCALAPPDATA/<name>/venv"`, and call `python -m uv run ...` |
| `print` of Vietnamese (non-ASCII) text fails with `cp1252` | `PYTHONIOENCODING=utf-8` |
| Node ESM errors on `c:\...` paths | `import(pathToFileURL(path).href)` |
| Port 8000 taken by the ERP | The CMS uses 9000, the web app uses 4000. Ask the user which ports are free |
| "Another next dev server is already running" | The user already has `next dev` running. Use that server (read its logs in `.next/dev/logs`), **do not kill** their process |
| Taking screenshots to check the UI | Headless Chrome with `--remote-debugging-port` + a CDP script. Only stop the exact process you started |

General rule: only start or stop the project's own processes, after checking the exact port and process name. Never touch Docker Desktop, WSL or background services. Last time, killing by port range took down the user's `wslrelay` and `com.docker.backend`.

## Next.js 16
| Symptom | Fix |
| --- | --- |
| `revalidateTag(tag)` reports deprecated | Use `revalidateTag(tag, "max")` or `{ expire: 0 }` |
| `hostname "127.0.0.1" is not configured` even after adding the env var | `next.config.ts` is read before `.env.local` is loaded. Edit or touch `next.config.ts` so the dev server reloads |
| Images from the local CMS are blocked | `images.dangerouslyAllowLocalIP` (dev only) |
| `/vi/...` returns 307 | `localePrefix: "as-needed"`: the default locale has no prefix |
| `/api/...` webhook gets redirected by next-intl | The `proxy.ts` matcher must exclude `api` |
| First CMS call times out at 10s | Wagtail is generating renditions. Use a 30s timeout + pre-generate renditions on import |
| `useSearchParams` on a static page fails the build | Wrap the component in `<Suspense>` with a sensible fallback |
| Turbopack keeps stale JSON messages | `request.ts` reads the files with `fs` in dev |
| `cn()` strips the `text-section` class | Declare custom tokens in `extendTailwindMerge` (`lib/utils.ts`) |
| A scripted string replace hit 2 places | After bulk edits, grep again to make sure only the intended spots changed |

## Django / Wagtail
| Symptom | Fix |
| --- | --- |
| `no such column: name` when searching in a snippet admin (SQLite) | Wagtail's database search backend on SQLite does not support field-restricted `search_fields`. Remove `search_fields` from the viewset, or use Postgres |
| M2M not carried over to translations | wagtail-localize only syncs M2M when listed as `SynchronizedField("materials")` |
| A migration generated just from a `help_text` edit | If not committed yet, delete and regenerate `0001`. If already committed, keep that migration |
| Service imports a serializer (layering inversion) | Move shared constants (renditions) into their own module |
| mypy: subclassing Any, `_StrPromise`, `django-manager-missing` | Overrides for models/hooks; use `StrOrPromise` from `django_stubs_ext` (imported under `TYPE_CHECKING`) |
| urllib changes header case in tests | Read headers through the `Message` object (case-insensitive) |
| `pytest_django.fixtures.SettingsWrapper` cannot be imported | Type it as `Any` |
| Admin sidebar breaks because the logo is too big | CSS: sidebar logo 72px wide, login screen logo 88px wide |
