# Content models by domain

This is the part that changes most between projects. Settle the model **on paper** (in `docs/brief.md`) with the user before writing migrations, because changing models once data exists is expensive.

## Common decisions for each content type
| Question | Choice |
| --- | --- |
| Snippet or Page? | **Snippet** (a plain model registered in the admin) for structured data with filters and an API: products, rooms, courses, events. Use a Wagtail **Page** only when editors need to arrange the layout themselves with StreamField, or need a free-form page tree: campaign landing pages, long multi-block articles. Default to snippets; code page layouts in Next. |
| Drafts / publishing? | Yes for important public content: `DraftStateMixin` + `RevisionMixin` (+ `_revisions` GenericRelation). No for secondary lists (taxonomy). |
| How to translate? | Many long text fields: `TranslatableMixin` + wagtail-localize (`TranslatableField` / `SynchronizedField`). Short taxonomy with 2 languages: 2 columns `name`, `name_en`. 3 or more languages: use localize for taxonomy too. |
| Child components? | Ordered children that travel with the parent's revision (images, items in a set, itinerary entries): `ParentalKey` + `Orderable` on `ClusterableModel`. |
| Repeated fields? | Group them into an abstract model (e.g. `SpecFields` with `spec_panels()`). |
| Filter by what? | Filter attributes are FK or M2M to taxonomy tables with a slug. The slug is the translation key on the frontend and the API parameter. |
| URL identifier? | `slug` unique per locale; lock it after the first publish (changing a slug breaks links and SEO). |
| Ordering? | `sort_order` in place; lists sort by group, then `sort_order`, then `id`. |
| Hide without deleting? | Use unpublish for drafted content. Use `ArchivableModel` for plain records. |

## Patterns by domain
Legend: **T** = taxonomy (small table with a slug), **S** = snippet with drafts and translations, **C** = child component (Orderable).

### Product catalog (manufacturing, wholesale, furniture, equipment). Has reference code
- **Tables:**
  - T `Category` → T `ProductType`(category, is_set);
  - T `Material`, T `Feature`;
  - S `Product`(slug, name, code, type, materials M2M, features M2M, description RichText, specifications, `erp_id`);
  - C `ProductImage`, C `SetItem`(type, qty, own specifications).
- **Filters:** group / type (single-select), material / feature (multi-select).
- **API:** `catalog/taxonomy`, `catalog/products?category=&type=&material=&feature=&locale=`, `catalog/products/<slug>`.
- **Translation:** description only; name, code and measurements are synchronized unchanged across languages.

### Services (agency, consulting, law, spa, repair)
- **Tables:**
  - T `ServiceCategory`;
  - S `Service`(slug, name, summary, body RichText, cover, icon, sort_order);
  - C `ServiceStep`(title, body), C `ServiceFAQ`.
- **Related:** M2M to `CaseStudy`.
- **Optionally:** S `CaseStudy`(client if permitted, industry T, challenge, solution, result, gallery C, metrics C).

### Hotel / homestay
- **Tables:**
  - T `RoomType`, T `Amenity`;
  - S `Room`(slug, name, size_m2, max_guests, bed, view, amenities M2M, description, gallery C);
  - S `Offer`(valid_from, valid_to, conditions).
- **Booking:** keep it in an external booking system; the CMS only stores a link or code.

### Restaurant / F&B
- **Tables:**
  - T `MenuSection`;
  - S `Dish`(name, description, price, tags M2M e.g. vegetarian / spicy, image, is_signature);
  - S `Promotion`.
- **Price:** store as Decimal with a currency unit; hide prices if the owner wants.
- **Language:** translate dish names if visitors are foreigners.

### Real estate / construction projects
- **Tables:**
  - T `District` / `City`, T `PropertyType`, T `Status` (on sale, under construction, handed over);
  - S `Project`(slug, name, location, map lat/lng, area, units, handover, description, gallery C, `Milestone` C with date and progress photos);
  - S `Unit` (unit or house model: area, bedrooms, price_from), if needed.
- **Filters:** area, type, status, price range.

### Education / training
- **Tables:**
  - T `Program`, T `Level`;
  - S `Course`(slug, name, duration, format online/offline, fee, outcomes C, syllabus C);
  - S `Instructor`(name, title, bio, photo);
  - S `Intake`(course FK, start_date, schedule, seats).
- **Filters:** program, level, format.
- **Display:** upcoming intakes are generated from `Intake` with `start_date >= today`.

### Healthcare / clinic
- **Tables:**
  - T `Specialty`;
  - S `Service`(specialty, name, description, preparation, price_from);
  - S `Doctor`(name, title, specialties M2M, bio, schedule note).
- **Note:** never store patient data in the website CMS. The booking form only forwards the request to the clinic's own system.

### Organization / events
- **Tables:**
  - S `Programme`;
  - S `Event`(slug, title, start, end, timezone, venue, registration_url, capacity, agenda C, speakers M2M to `Person`);
  - S `Report` (PDF file via `wagtaildocs`).
- **Event list:** upcoming and past, split by `start`.

### Shared across all domains
| Content | Suggested model |
| --- | --- |
| Articles / news | S `Post`(slug, title, excerpt, cover, body StreamField or RichText, published_at, tags T, author FK `Person`). Paginate the list on the server, do not fetch everything |
| Team | S `Person`(name, role, photo, bio, sort_order) |
| FAQ | S `FAQ`(question, answer, group T, sort_order); or C attached to each content type |
| Testimonials | S `Testimonial`(quote, name, title, company, photo, consent bool; only shown when `consent=True`) |
| Partners / logos | S `Partner`(name, logo, url, consent) |
| History milestones | S `Milestone`(year or "now", title, body, icon, sort_order) |
| Certifications | S `Certification`(name, scope, issuer, valid_until, file, is_confirmed) |
| Downloadable documents | `wagtaildocs` + S `Download`(title, doc, gated bool) |
| Contact inquiries | Plain model `Inquiry`(purpose, name, email, company, country, phone, message, ref_code, attachment in private storage, status, handled_by), with **no** public API; Next writes to it through an HMAC-signed API |
| Company info | `wagtail.contrib.settings` (`BaseSiteSetting`): phone, email, address, social links, opening hours; or keep it in `config/site.ts` if it rarely changes |

## From model to frontend
- Each content type gets a set of files:
  - `data/<domain>/types.ts` (UI types) and `<domain>.mock.ts`;
  - `data/<domain>/<domain>.ts` (server-only, chooses CMS or mock);
  - `lib/cms/<domain>.ts` (maps API types to UI types; API types come from `schema.d.ts`).
- Taxonomy slugs are used as translation keys in messages. The frontend filters out unknown slugs it does not know yet.
- Small lists (under roughly 300 items, such as a catalog or rooms): fetch everything once and filter on the client. Large or constantly growing lists (articles, jobs): paginate on the server.
