---
name: landing-design-system
description: 'Shared UI/UX design system for landing pages and company websites in any industry (manufacturing, services, SaaS, food and beverage, hotels, real estate, education, healthcare, nonprofits...). Includes role-based tokens (ink, brand, highlight, surface) and how to derive a palette from brand colors, a fluid type scale, containers, shared components (Section, SectionHeading, ButtonLink, PageHeader, ImagePlaceholder, header, footer), a catalog of section layouts with the industries each suits (hero, bento, carousel, map, media offset, stats, timeline, process, FAQ, CTA, filters, detail pages, forms), page presets per website type, background rhythm, motion, i18n and copy rules. Always asks about brand, main colors and desired feel before designing. Use when building or changing a landing page UI, choosing section layouts, setting brand colors or writing multilingual copy, even if the skill is not named. Pairs with landing-cms-stack.'
---

# Design system for landing pages (any industry)

This skill is a **proven design system** for company websites. It works for any industry: change the colors, type, images and pick the right sections; the underlying framework stays the same.

It was distilled from a reference project, **BFC** (a B2B furniture manufacturer). Every "BFC" example in these docs is an illustration, not a rule for new projects.

Default design spirit: **solid, clear, generous white space, real content (photos, numbers) in the lead**, one consistent grid, restrained motion. If a brand needs a different spirit (playful, techy, dark luxury), keep the component structure and only adjust tokens and motion level following `references/tokens.md`.

Pairs with **landing-cms-stack** (Next.js 16 + Tailwind 4 + shadcn + next-intl, Django/Wagtail CMS). This skill also works on its own in any Next.js + Tailwind project; a CMS is not required. Code paths in these docs are relative to `frontend/src`. **Always talk to the user in their own language.**

## Step 0: understand the project before designing
If the project has no `docs/brief.md` yet: when **landing-cms-stack** is installed, run the full discovery in that skill's `references/discovery.md` (business, goals, audience, page and content structure, brand). If it is not installed, or the project has no CMS, ask at least the points below. Ask with AskUserQuestion, at most 4 questions per round, each with a recommended option; for anything the user's documents already answer, just confirm.

- **Industry and audience:** which website type (see the presets in `references/pages.md`), who the visitors are, and the main action you want them to take.
- **Feel:**
  - 3 adjectives (e.g. trustworthy, warm, modern);
  - for abstract words, ask for specifics, e.g. does "luxurious" mean minimal white or dark with metallic accents;
  - if available, ask for 2 or 3 reference sites and what they like about each. Learn the layout only; never copy.
- **Main and accent colors:**
  - do they already have hex codes (logo, brand guideline)?
  - if they only describe a color ("blue", "burgundy"), propose 2 or 3 concrete hex values with their contrast against white text, and build a small comparison page if it helps them choose;
  - note: "brighter" usually means more vivid and saturated, not mixed with white.
- **Logo:** is there a vector file or a transparent PNG? A version for dark backgrounds?
- **Font:** keep Inter or use a brand font? The font must cover the character set of every site language (e.g. Vietnamese diacritics).
- **Shape:** square and solid corners (default 2px) or soft rounding; uppercase headings (default) or sentence case; light or dark backgrounds.
- **Photos and video:** do they have real photos yet? Should the hero be a slider, a video or a single still?
- **Motion:** restrained (default), rich scroll effects, or nearly static? Is 3D needed (heavy)?
- **What they dislike** (e.g. transparent headers, pill buttons, italics, too many colors).
- **Sections:** for each page, let them pick from `references/sections.md` instead of asking a vague "what should the homepage look like".

Write the answers into `docs/brief.md` (Brand and UI section) before changing any tokens.

## Five foundation rules
These five rules keep the site consistent however many pages it grows to. They come from repeated feedback on the reference project. A new project owner may relax rule 2 or 3, but record that in the brief.

1. **One set of shared components for every section.** Each section is `<Section tone>` + `<Container>` + `<SectionHeading>` + content. Never hand-write an `<h2>`, never set your own `px-*` or `max-w-*`, never hard-code a color. Changing rhythm or width in the component changes the whole site.
2. **One section heading pattern:**
   - **subtitle** (eyebrow): uppercase, brand color, a short rule in front;
   - **title**: `text-section` size, uppercase by default;
   - **desc** (lede): sentence case, only when the section needs explaining.
3. **One CTA button style:** `ButtonLink`: outlined frame, uppercase label and an arrow; fills on hover. Secondary spots inside cards use `ArrowLink` or `CardAction`. A `<button>` uses `buttonLinkClass()` to match. The only prominent button is the contact or quote button in the header (brand background).
4. **Header, footer and PageHeader are identical on every page.** No per-page props to hide or trim parts. The only exception is the footer cross-link strip (`crossKeys`).
5. **Changing a color means changing the shared token** in `globals.css`, never a per-section variant. Each time a color changes, keep the old value in a comment so it can be reverted.

## UI workflow
1. **Copy the foundation** from `assets/`:
   - `globals.css` → `app/globals.css`;
   - `utils.ts` → `lib/utils.ts`;
   - `components/` → `components/shared` and `components/layout`;
   - `archive-README.md` → `components/archive/README.md`.

   Then set token values from the brief (palette derivation in `references/tokens.md`). The header and footer in `assets/components/layout` are reference versions: change the menu, info blocks and certification strip for the project.
2. **Information architecture:**
   - the homepage is a table of contents: each section summarizes one deeper page and has exactly one link out;
   - at most 2 page levels;
   - pick the preset for the website type in `references/pages.md`.
3. **Pick sections** from `references/sections.md`. Each layout states which industries it suits, the data it needs, and the alternatives already rejected. Propose these to the user before inventing a new layout; a new layout must still follow the five rules.
4. **Background rhythm:** alternate `light`, `soft`, `tint`, `brand` and `dark` so the page never feels flat. Never put two sections with the same colored background next to each other. A brand-colored CTA block usually sits right above the dark footer.
5. **Copy and i18n** per `references/i18n-copy.md`: multilingual from the start, never invent numbers.
6. **Images:**
   - use `ImagePlaceholder label="<file name>"` from day one: without a photo it shows a striped background with the file name to shoot; once the photo exists it shows the real image;
   - real photos of the business, hosted on your own server;
   - no hotlinking, no images or logos from other sites.
7. **Visual check:** screenshot desktop (1440) and mobile (390) for every new section, in every language.

## When the user changes their mind
A replaced section is **never deleted**:
- move it to `components/archive/<page>/`;
- remove it from the barrel export;
- leave a one-line note in the page;
- update the table in `components/archive/README.md`.

When a new section is needed, check the archive first. The comment at the top of each component records the layout, plus the date and reason of every change.

## References
- `references/tokens.md`: tokens, deriving a palette from brand colors, type, spacing, radius, motion, spirit variants (light/dark, soft/hard).
- `references/components.md`: API and rules of each shared component, header, footer.
- `references/sections.md`: **the section layout catalog** (purpose, desktop/mobile layout, background, motion, data, which industries it suits, rejected alternatives).
- `references/pages.md`: presets per website type (B2B manufacturing, services, SaaS, restaurants/hotels, real estate, education, healthcare, nonprofits/events) and the skeleton of each page type.
- `references/i18n-copy.md`: message structure, copywriting rules, placeholders.
- `assets/`: source code to copy (tokens named by role).
