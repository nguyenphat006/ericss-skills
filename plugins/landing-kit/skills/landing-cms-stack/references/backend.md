# Backend: Django 5.2 LTS + Wagtail 8 (headless CMS with an admin)

Code examples use the reference project's "product catalog" content type. For other domains, keep the patterns (base models, drafts/revisions/translations, selectors with fallback, API, renditions, idempotent import, webhook) and swap the models according to `content-models.md`.

## Contents
1. Why Wagtail
2. Directory structure
3. Settings and environment
4. Base models and layering
5. Snippet pattern with drafts, revisions, translations
6. Taxonomy (categories, types, materials)
7. Selectors with language fallback
8. Public API
9. Images and renditions
10. Importing mock / ERP data
11. Webhook to refresh the frontend cache
12. Brand-themed Wagtail admin
13. Security
14. Tests, tooling, CI

---

## 1. Why Wagtail
- The team already knows Django/DRF/Postgres (the ERP uses the same stack), so skills and libraries carry over.
- Wagtail ships what you would otherwise build yourself on plain Django: drafts and publishing, revision history, compare, restore, an image library with renditions (WebP, multiple sizes), translations (wagtail-localize, with machine translation followed by review) and an admin UI.
- Use **snippets** (plain models registered in the admin) for structured data such as products and taxonomy. Use Wagtail **Pages** only when you need a free-form editorial page tree. A catalog-style landing page mostly uses snippets, while page layouts are coded in Next.
- **Open question to ask the user:** keep the Wagtail admin (restyle colors, fonts, corner radius to the brand, about half a day) or build a custom admin with Next + shadcn to match other internal apps (several weeks; Django becomes headless and needs write APIs and auth). That is why logic always lives in services/selectors/api, never in the admin, so neither direction requires a rewrite.

## 2. Directory structure
```
backend/
  pyproject.toml        # uv, poe tasks, ruff, mypy, pytest (template: assets/templates/backend)
  manage.py  conftest.py  Dockerfile  .dockerignore  .env.example  openapi.yaml
  config/
    settings/{__init__,base,dev,test,prod}.py
    urls.py  api.py (collects /api/v1 URLs)  logging.py  wsgi.py  asgi.py
  apps/
    core/        # base models, shared API (exceptions, pagination, schema), health, revalidate, admin theme
    accounts/    # custom User, roles, password brute-force protection
    catalog/     # first business domain
      models/{__init__,taxonomy,product}.py
      services.py  selectors.py  renditions.py  signals.py  wagtail_hooks.py
      api/{serializers,views,urls}.py
      management/commands/import_mock.py
      fixtures/  tests/
  docs/adr/0001-...md   # one file per decision
```
For a new business domain, add a new app (`inquiries`, `pages`, `materials`...); do not pile everything into one app. BFC's old ERP once put everything into a single `models.py` of about 45 thousand lines; that is the anti-example.

## 3. Settings and environment
- `base.py` reads every value through `django-environ`. The `.env` file is for dev only; production passes variables via Compose.
- `prod.py` is **fail-closed**: `env.str("DJANGO_SECRET_KEY")` has no default, so a missing variable prevents startup. Prod also enables:
  - HSTS, `SECURE_PROXY_SSL_HEADER` (Nginx terminates TLS), secure cookies;
  - WhiteNoise for admin static files;
  - CSP in report-only mode (the Wagtail admin uses a lot of inline scripts);
  - JSON logs.
- Dev uses SQLite. CI and prod use Postgres via `DATABASE_URL`. Enable `ATOMIC_REQUESTS = True`.
- `LANGUAGE_CODE="vi"`, `LANGUAGES=[vi,en]`, `WAGTAIL_I18N_ENABLED`; replace `wagtail.locales` with `wagtail_localize.locales`.
- Machine translation (Google Cloud Translation) is only enabled when `GOOGLE_CLOUD_PROJECT_ID` is set. Machine translations are drafts for a human to review; never translate at runtime.
- `STORAGES` adds a `private` storage (no `base_url`) for form attachments, which are not served publicly.
- Poe tasks:
  - `dev`: runserver 127.0.0.1:9000;
  - `bootstrap`: migrate + create locales + permission groups;
  - `test`, `lint`, `format`, `typecheck`, `migrations-check`;
  - `schema`: generate `openapi.yaml`, `--fail-on-warn`;
  - `check`: run everything like CI.

## 4. Base models and layering
Template in `assets/templates/backend/apps/core/models/base.py`.

| Base model | Use when |
| --- | --- |
| `TimeStampedModel` | Every table: `created_at` (indexed), `updated_at` |
| `UserStampedModel` | Tables edited by people: `created_by`/`updated_by`, filled via `stamp(actor)` **in the service**, never implicitly from thread-locals |
| `PublicIdModel` | Tables exposed externally (URLs, email): UUID `public_id`; the bigint primary key never leaves the system |
| `ArchivableModel` | Archive instead of delete: `objects` returns only active records, `all_objects` returns everything, `base_manager_name="all_objects"` |

Layering:
- `services.py`: every **write**, takes an explicit `actor`, wrapped in `transaction.atomic`.
- `selectors.py`: every complex **read**, responsible for `select_related`/`prefetch_related` to avoid N+1.
- `api/`: thin DRF views: validate the query → call the selector → serializer.
- `wagtail_hooks.py`: only registers screens, menus, CSS.
- History: Wagtail revisions for drafted content; `django-auditlog` (registered in `apps.py`) for plain models.

## 5. Snippet pattern with drafts, revisions, translations
Product model skeleton (trimmed from `apps/catalog/models/product.py`):

```python
class Product(TranslatableMixin, DraftStateMixin, RevisionMixin, index.Indexed, ClusterableModel, TimeStampedModel):
    slug = models.SlugField(validators=[slug_validator])        # URL key, locked after the first publish
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=50, blank=True)
    product_type = models.ForeignKey("catalog.ProductType", on_delete=models.PROTECT, related_name="products")
    materials = ParentalManyToManyField("catalog.Material", blank=True)
    features = ParentalManyToManyField("catalog.Feature", blank=True)
    description = RichTextField(features=["bold", "italic", "ol", "ul", "link"], blank=True)
    sort_order = models.PositiveIntegerField(default=0)
    erp_variant_id = models.CharField(max_length=64, blank=True)  # reserved for a later ERP sync
    _revisions = GenericRelation("wagtailcore.Revision", related_query_name="product")

    base_form_class = ProductForm   # clean_slug: disallow slug changes after first_published_at
    translatable_fields = [
        TranslatableField("description"),                 # only text fields that need translating
        SynchronizedField("slug"), SynchronizedField("name"), SynchronizedField("product_type"),
        SynchronizedField("materials"), SynchronizedField("features"),   # M2M MUST be listed to be synced
        SynchronizedField("images"), SynchronizedField("set_items"),     # child relations are not translated: sync them
        ...
    ]
    edit_handler = TabbedInterface([ObjectList(general, heading="General"), ObjectList(specs, heading="Specifications"), ...])

    class Meta(TranslatableMixin.Meta):
        constraints = [models.UniqueConstraint(fields=["slug", "locale"], name="uniq_product_slug_locale")]

    def clean(self):  # slug unique site-wide across different translation_keys
        ...

class ProductImage(Orderable):
    product = ParentalKey(Product, related_name="images", on_delete=models.CASCADE)
    image = models.ForeignKey("wagtailimages.Image", on_delete=models.CASCADE, related_name="+")
```

Notes:
- Child components (images, items in a set) use `ParentalKey` + `Orderable` on `ClusterableModel`, so they travel with the parent's revision.
- Fields repeated between products and set items (dimensions, packaging) are grouped in an abstract `SpecFields` with `spec_panels()`.
- To show status and columns in the admin list, use `SnippetViewSet` with `list_display` (with `LiveStatusTagColumn`, `UpdatedAtColumn`) and `list_filter`. Group the viewsets into one `SnippetViewSetGroup` to form a single menu.
- Publishing from code: `obj.save_revision(user=actor).publish(user=actor)`.

## 6. Taxonomy
Use simple tables instead of Wagtail translation: an abstract `TaxonomyBase(TimeStampedModel)` with `slug` (unique, regex `^[a-z0-9]+(-[a-z0-9]+)*$`), `name`, `name_en`, `sort_order` and `label(language)`. Why (ADR 0007): taxonomy rarely changes, has only two languages, and two columns are far cheaper to query than a translation table.

Example hierarchy: `Category → ProductType (is_set) ← Product`, plus `Material`, `Feature`. Taxonomy slugs are also translation keys on the frontend (`messages.Common.productTypes.<slug>`). The frontend filters out unknown slugs it does not know yet.

## 7. Selectors with language fallback
```python
def live_products(locale):
    default = Locale.get_default()
    qs = Product.objects.filter(live=True)
    if locale.pk == default.pk:
        return qs.filter(locale=locale).annotate(is_fallback=Value(False, output_field=BooleanField()))
    translated = Product.objects.filter(live=True, locale=locale).values("translation_key")
    return qs.filter(Q(locale=locale) | Q(locale=default) & ~Q(translation_key__in=translated)).annotate(
        is_fallback=Case(When(locale=locale, then=Value(False)), default=Value(True), output_field=BooleanField()))
```
Untranslated products still appear, taken from the original, with `is_fallback=True`. The frontend sets `noindex` on that page if it has an untranslated description. Filter multiple materials with AND by chaining one filter per slug.

## 8. Public API
- Everything under `/api/v1/`, read-only, `AllowAny`, no auth, throttled at 600/minute.
- Return only `live=True` content. With `SPECTACULAR_SETTINGS.PREPROCESSING_HOOKS = only_public_api`, OpenAPI contains only the public API.
- Errors always have the shape `{"error": {"code", "message", "details"}}`. The frontend branches on `code`, not on `message`.
- Lists are paginated as `{count, page, page_size, total_pages, results}`, `page_size` at most 100.
- `?locale=vi|en`. An invalid query (e.g. `page_size=abc`) returns 400 with `code="invalid"`.
- Example endpoints: `catalog/taxonomy` (one call, all categories, types, materials, features), `catalog/products` (filters `category`, `type`, `material`, `feature`), `catalog/products/<slug>`.
- RichText must go through `expand_db_html()` before being returned, so internal links and images become real HTML.
- Commit `openapi.yaml` to the repo. CI diffs it against a regenerated copy to catch unintended API changes. The frontend can generate types from this file (`openapi-typescript`).

## 9. Images and renditions
- Put the constants in a separate `renditions.py` so both services and serializers can import them, without the service importing the api layer:
  ```python
  RENDITION_LARGE = "max-1600x1600|format-webp|webpquality-82"
  RENDITION_THUMB = "max-800x800|format-webp|webpquality-80"
  ```
- The image serializer returns `url`, `thumb`, `width`, `height`, `alt`. URLs are absolute (see the production pitfall in deploy.md).
- Generating a rendition the first time is very slow. So after importing, call `warm_renditions()` to pre-generate them, and set a 30s timeout on the frontend.
- Images are deduplicated by sha1 (`file_hash`) on import, so re-running does not create duplicates.
- Always store images on your own server. Never hotlink images from other sites, never use competitors' images or logos.

## 10. Importing mock / ERP data
- `services.import_catalog(data, assets_dir, actor) -> ImportResult`: runs in `transaction.atomic`, is **idempotent** (re-running updates instead of duplicating), and publishes via revisions.
- `manage.py import_mock --file fixtures/mock_catalog.json --assets ../frontend/public`.
- The frontend mock is exported to JSON by a Node script (`node --experimental-strip-types scripts/export_frontend_mock.mjs`; on Windows import via `pathToFileURL`), so both sides share one mock source.
- Later ERP sync: one-way ERP → CMS, with a review step, keeping `erp_variant_id`. Never pull client names, client codes or internal notes.

## 11. Webhook to refresh the frontend cache
Templates: `apps/core/revalidate.py` and `apps/catalog_signals.py`.
- `sign(secret, ts, body) = hex(HMAC_SHA256(secret, f"{ts}.{body}"))`, sent with the `X-CMS-Timestamp` and `X-CMS-Signature` headers (change the prefix to match the brand).
- Send inside `transaction.on_commit`, so a rollback does not trigger a false notification. Timeout 5s. On failure, only log and return False, never break the publish action; the cache then expires on its own after 1 hour.
- Triggering signals:
  - after `published`, `unpublished` and `post_delete` of drafted content;
  - after `post_save` and `post_delete` of taxonomy.

  Connect them in `AppConfig.ready()`.
- Use a single `cms` tag for all content: it is simple, and for a small site refreshing everything is still cheap. Only split tags per content type once the site grows, and remember to add them to the frontend whitelist too.
- Tests: spin up a local `HTTPServer` to capture real requests; use `django_capture_on_commit_callbacks(execute=True)`.

## 12. Brand-themed Wagtail admin
- The `core` app goes **before** `wagtail.admin` in `INSTALLED_APPS` so it can override the `wagtailadmin/{admin_base,base,home,login}.html` templates.
- Add CSS via the `insert_global_admin_css` hook: Wagtail color variables taken from the brand tokens, plus the logo in the sidebar (72px wide) and on the login screen (88px wide).
- Hide unused menus. The admin home page is a compact panel linking to the content types.
- A single "Admin" role (publishes directly), created by `manage.py bootstrap`, idempotent. Add editor/reviewer roles only when truly needed (ADR 0004).

## 13. Security
- Passwords: argon2, minimum 12 characters.
- Brute-force protection: `django-axes` locks by username + IP pair after 5 failures, unlocks after 1 hour, and `AxesStandaloneBackend` must come first in `AUTHENTICATION_BACKENDS`. `AxesMiddleware` goes last in the middleware.
- `X_FRAME_OPTIONS="SAMEORIGIN"`, because Wagtail preview embeds a same-origin iframe.
- Form attachments live in private storage and can only be downloaded through the admin.
- Structured logs (structlog + django-structlog, with a request id). **Never log** form contents, emails, phone numbers or tokens.
- `manage.py check --deploy` with a fake prod env must be clean, and CI runs this step.
- 2FA (allauth MFA) is deferred to a later phase, documented in an ADR.

## 14. Tests, tooling, CI
- pytest + pytest-django + factory-boy + pytest-xdist; minimum 90% coverage (BFC reached 99%).
- Tests per layer:
  - model (`clean`, constraints);
  - service (idempotent import);
  - selector/API (language fallback, filters, 404, bad query returns 400);
  - admin (list/edit pages return 200);
  - signal (webhook fires at the right time).
- ruff with rule groups E, W, F, I, B, UP, S (bandit), DJ, C4, SIM, RET, PIE, PT, DTZ, T20, ERA, RUF; line length 100.
- mypy + django-stubs + drf-stubs. Overrides for `apps.*.models*` and `apps.*.wagtail_hooks`: `disallow_subclassing_any=false`, disable the `django-manager-missing` error (Wagtail classes are untyped).
- pre-commit: pre-commit-hooks, ruff-check, ruff-format (only applied to `^backend/`), gitleaks, a local `makemigrations --check` hook.
- CI (`.github/workflows/backend.yml`) has a postgres service and these steps:
  - ruff, mypy, migrations check;
  - pytest `-n auto`;
  - `check --deploy`;
  - OpenAPI diff;
  - `pip-audit` (run via uvx);
  - a Docker build job with `push: false`.
