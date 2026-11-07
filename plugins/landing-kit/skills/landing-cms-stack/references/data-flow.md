# Data flow and caching

Use this file when connecting Next to the CMS, or when the user asks "where does the fetch run" or "where is the cache". Explain with concrete examples, not just definitions.

## 1. When someone opens a product page
```
Browser ── GET /products/living-sets/set-1552 ──▶ Nginx ──▶ Next (Node server, web container)
  Next: is there a rendered HTML/RSC copy in the cache that is still "fresh"?
    ├─ yes → return it immediately (no CMS call)                       ~ a few ms
    └─ no / stale → render again:
          getProduct(slug, locale)  ── fetch http://cms:8000/api/v1/catalog/products/<slug>?locale=vi
                                       (data cached under tag "cms", expires after 3600s)
          → HTML + RSC payload → store in cache → return
  Browser loads images via /_next/image?url=<CMS image> (Next fetches the original from the CMS, compresses it, caches it on disk)
```
Consequences users often ask about:
- **The Network tab shows no requests to the CMS**, because the fetch happens on the Next server, not in the browser. The browser only sees the HTML document request, the `_next/static` files, `/_next/image` images, and, when navigating with `Link`, RSC requests (`?_rsc=`).
- **"Cache" here means Next's server-side cache**: the rendered HTML/RSC and the `fetch` data cache. It is not the browser cache. The browser still asks the server every time; the server just answers fast.
- **"The Next server" is the Node process** running `next start`: the `web` container when deployed, `next dev` on the dev machine. It both serves HTML and is the only thing that talks to the CMS.

## 2. When an editor clicks Publish
```
Wagtail admin ── publish() ──▶ DB commit
   └─ transaction.on_commit → POST http://web:3000/api/revalidate
        headers: X-CMS-Timestamp, X-CMS-Signature = HMAC(secret, "<ts>.<body>")
        body: {"tags": ["cms"]}
Next /api/revalidate: verify signature (timingSafeEqual), clock skew ≤ 300s, tag is in the whitelist
   └─ revalidateTag("cms", "max")  → all data tagged "cms" is marked STALE
Next visitor: still gets the old copy immediately (stale-while-revalidate), Next re-renders in the background
The visitor after that: sees the new content
```
- `"max"` means stale-while-revalidate: nobody waits for a re-render, but the first visitor after publishing still sees the old copy one more time. To expire immediately (the first visitor waits for the render), use `revalidateTag(tag, { expire: 0 })`. This is the user's call: ask them if they complain "I clicked publish but F5 doesn't show it yet".
- If the webhook fails (Next down, network error), the cache expires on its own after 3600s. The CMS only logs it and does not block publishing.
- Do not let browsers or anyone outside the internal network call `/api/revalidate`. The signature already protects the endpoint, but Nginx should still return 404 for this path from the Internet.

## 3. Cache layers summary
| Layer | Lives in | Refreshed when | Notes |
| --- | --- | --- | --- |
| Full route cache (HTML/RSC) | Next server | revalidateTag, expiry | Pages in `generateStaticParams` are built at build time |
| Data cache (`fetch`) | Next server | tag `cms`, 3600s | Shared across pages |
| React `cache()` | Memory, one render pass | Every request | Deduplicates repeated calls |
| `/_next/image` images | Disk `.next/cache/images` | Per image TTL | Mount a volume so it survives deploys |
| `_next/static` | Browser / CDN | Every build (hashed file names) | `immutable` |
| Wagtail renditions | CMS media | When the original image changes | Pre-generated at import time |

## 4. Compared with a typical web app (e.g. ERP)
- An ERP calls the API from the browser (client fetch, React Query...) because data is per user and changes constantly, so HTML cannot be cached.
- A CMS-backed landing page shows everyone the same content, which rarely changes, so render on the server and cache. The result is faster, SEO-friendly, keeps the CMS off the Internet and puts very little load on it.
- Parts that need personal or real-time data (forms, filters) are handled on the client or in a server action, without breaking the whole page's cache.

## 5. Draft preview (later step)
Use Next Draft Mode:
- the Wagtail admin opens `/api/draft?secret=…&path=…`, and that route enables `draftMode()`;
- when Draft Mode is on, the data layer calls the CMS preview API (authenticated, returns drafts) and bypasses the cache;
- disable it with `/api/draft/disable`.

Never let the public API return drafts.
