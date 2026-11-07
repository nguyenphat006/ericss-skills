# Deployment: Docker Compose on a VPS

Templates are in `assets/templates/deploy/`. They were written from BFC's ERP experience; they have not yet run on a real server, so test them on staging first.

## Architecture
```
Internet ─▶ nginx (TLS, :80/:443)
              ├─ www.example.com  ─▶ web  (Next standalone, :3000)  ─▶ cms (internal network)
              └─ cms.example.com  ─▶ cms  (gunicorn, :8000)  /admin
                                   /media, /static: served by nginx directly from volumes
cms ─▶ db (Postgres 17, no published port)
cms ─webhook─▶ http://web:3000/api/revalidate (internal)
```
- One service per role; give the Compose project its own `name:` so it does not clobber the dev stack or other projects on the same machine (lesson from the ERP).
- Pass secrets through `env_file`, never bake them into the image. Commit `.env.prod.example`, do not commit `.env.prod`.
- Run migrations as a separate command on every deploy:
  ```
  docker compose -f docker-compose.prod.yml run --rm cms python manage.py migrate
  ```
  then run `bootstrap` the first time.
- Volumes:
  - `pgdata`, `media`, `private` must be backed up;
  - `static` can be regenerated;
  - `next_cache` keeps optimized images across deploys (safe to delete).
- Healthchecks:
  - cms: `/healthz` (alive), `/readyz` (DB reachable);
  - web: GET `/`;
  - `depends_on: condition: service_healthy`.
- The frontend needs `output: "standalone"` in `next.config.ts` to keep the image small (about 150MB instead of over 1GB). Remember to also copy `messages/` if `request.ts` reads files.

## Must-dos before going to production (found during the BFC project)
1. **SSL redirect versus internal calls:**
   - Problem: Next calls `http://cms:8000/api/v1` without `X-Forwarded-Proto`, so `SECURE_SSL_REDIRECT=True` returns a 301 to https and the fetch breaks.
   - Fix: add `r"^api/"` to `SECURE_REDIRECT_EXEMPT`, since the API is only open on the internal network and Nginx blocks `/api/` from the Internet.
   - Also add `cms` to `DJANGO_ALLOWED_HOSTS`.
2. **Absolute image URLs:**
   - Problem: the serializer builds URLs with `request.build_absolute_uri()`, so internal calls produce `http://cms:8000/media/...`. Browsers cannot open that address, and gunicorn does not serve media.
   - Fix: add a `CMS_PUBLIC_MEDIA_URL=https://cms.example.com` setting and have the serializer build URLs from it. Allow that public hostname in `remotePatterns` in `next.config`.
   - Alternative: have Next rewrite `/media/*` to Nginx so images share the site's domain.
3. **No CMS at build time:**
   - Problem: `generateStaticParams` calls the CMS during `next build`. Inside `docker build` there is no network route to `cms`.
   - Fix: leave `CMS_API_URL` empty at build time (use mocks), or return `[]` during the build. Pages are then built when someone first opens them (`dynamicParams = true`).
   - Do not build the image while the stack is running just to get data.
4. Set `CMS_SHARED_SECRET` (cms) equal to `CMS_REVALIDATE_SECRET` (web), at least 32 random bytes long.
5. `DJANGO_CSRF_TRUSTED_ORIGINS=https://cms.example.com`, `WAGTAILADMIN_BASE_URL=https://cms.example.com`.
6. Email (SMTP) for forms; `DEFAULT_FROM_EMAIL` uses the real domain (SPF/DKIM).
7. Consider restricting `/admin` by IP or VPN. Enable 2FA once there are several admin users.
8. Daily backups: `pg_dump` plus a tar of the `media` + `private` volumes, keep at least 7 copies, and test a restore.
9. TLS: certbot or acme.sh with automatic renewal, mounted at `/etc/nginx/certs`.

## Scaling and CDN
- **One web container is enough** for a landing page. If you run several replicas, each container has its own Next cache: `revalidateTag` only refreshes the replica that received the webhook. In that case you need a shared cache handler (Redis) via `cacheHandler` in `next.config`, or send the webhook to every replica.
- Putting a CDN (Cloudflare) in front is good for static files and images. But if it also caches HTML, the CDN knows nothing about `revalidateTag`: either set a short HTML TTL (`s-maxage=60, stale-while-revalidate`), or have the webhook also call the CDN's purge API.

## Suggested CI/CD
- Existing CI: lint, types, tests, `--deploy` check, OpenAPI diff, pip-audit, image build with `push: false`.
- For real deploys:
  - build images tagged by commit and push them to a private registry (GHCR);
  - on the server run `pull`, then `run --rm cms migrate`, then `up -d`;
  - keep old image tags for rollback.
