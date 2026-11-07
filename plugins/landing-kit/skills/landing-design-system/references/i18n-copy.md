# Internationalization and copy

## Messages structure (`messages/<locale>.json`)
- Every language file must have **the same set of keys**. A missing key makes next-intl report `MISSING_MESSAGE`.
- The default language has no URL prefix; other languages are prefixed (`/en`, `/ja`...).

General skeleton (example):
```jsonc
{
  "Metadata": { "title": "...", "description": "..." },
  "Common": {
    "tagline", "breadcrumbHome", "primaryCta", "languageLabel", "languages",
    "nav": { "<navKey>": "..." },
    "<taxonomy>": { "<slug>": "..." },   // taxonomy slugs from the CMS used as translation keys (e.g. productTypes, serviceTypes)
    "backToTop"
  },
  "Footer": { "blurb", "contactTitle", "address", "mapsLink", "privacy", "terms", "cross": {} },
  "HomePage": { "hero": {}, "intro": {}, "<section>": {} },
  "<Page>Page": { "metaTitle", "metaDescription", "hero": {}, "<section>": {} },
  "NotFound": {}, "ErrorPage": {}
}
```

Conventions:
- Namespace by page, then by section. A section's key matches its component name.
- Each section usually has `eyebrow`, `title`, `lede?`, `cta` and `items[]`. Put lists in `items` as `{title, body}` objects, so adding or removing items needs no code change.
- Library labels (lightbox, tooltip, pagination) also go into messages.
- Server components use `getTranslations`, client components use `useTranslations`. In `generateMetadata`, pass `locale`.
- Country names, dates, numbers: format with `Intl` on the server and pass them down to the client, so server and browser do not diverge during hydration.

## Copy in messages or in the CMS?
| In `messages/*.json` | In the CMS |
| --- | --- |
| Button labels, menus, form errors, fixed section headings, default meta | Products/services, long descriptions, articles, history milestones, FAQ (if edited often) |
| Changes on deploy | Changes with the Publish button |

## Copywriting rules (defaults; the project owner may adjust them, record changes in the brief)
- **Never invent figures, clients, certifications or testimonials.**
  - Use only information the business has provided.
  - If something is missing, use a deliberate `NULL` placeholder or hide the item; record it under "Open questions" in the brief.
  - If sample data is allowed, label it clearly as sample.
- **Do not copy** text, images, logos or color codes from competitor or reference sites. Learn only from their layout.
- **Do not publish internal data** (client names without permission, cost prices, internal notes) on the site.
- **Punctuation:** by default, avoid em dashes (—) and en dashes (–) in site copy. Use commas, periods, colons, or words like "to" instead (e.g. "8:00 to 17:00"). This is the reference project's house rule; ask the project owner whether to keep it.
- **Headings:** short and assertive. Uppercase is done with CSS (`uppercase`); in messages, write sentence case so every language is handled the same way and screen readers read naturally.
- **Tone of voice** follows the brief:
  - B2B: professional, specific (processes, standards, figures);
  - B2C: approachable;
  - healthcare, finance: cautious, no promised outcomes.
- **Translations** must be edited by a person. Machine translation is only a draft. Keep industry terminology consistent.
- **H1 is the page name.** Every section has one h2, even if it is hidden with `sr-only`.
- **Fonts** must cover every site language (e.g. Vietnamese diacritics need the `vietnamese` subset).

## Image and data placeholders
- `ImagePlaceholder label="file_name.jpg\nnote"`: while the file is missing, it shows a striped background with the name of the file to shoot.
- For stand-in images, write `stand-in - <required image> pending` in the label.
- Company info (phone, email, map, social links, opening hours) lives in `config/site.ts`. A `null` value hides that item in the UI.
