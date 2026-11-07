# Section layout catalog

Each entry is a **layout pattern** that works across many industries. Each entry lists:
- **Purpose**: which customer question the section answers.
- **Fits**: industries and content that suit this layout.
- **Layout**: desktop, and mobile if different.
- **Background**, **motion**, **required data**.
- **Tried and dropped**: options that were rejected, so you do not propose them again.
- **Reference**: real code lives in `assets/reference/<path>` (read the README there first). Paths follow the reference project's features folder.

Every section follows the shared rules:
- the frame is `Section` + `Container` + `SectionHeading`;
- the CTA is `ButtonLink`;
- colors come from tokens.

Choose sections by **the business's story**, not by working down the list. For example, BFC does made-to-order OEM work and has no construction projects, so the "Projects" section was replaced by a materials carousel with the same layout.

The catalog is split into groups:
- **Opening** (H): hero, statement.
- **Catalog presentation** (L): bento, carousel, horizontal card grid, filterable browser.
- **Proof of capability** (P): stats, map, media offset, timeline, process, certifications.
- **Conversion** (C): FAQ, CTA, form, contact.
- **Detail pages** (D).
- **Patterns without a reference build yet** (N).

---

## H. Opening

### H1. Full-screen image hero slider
- **Purpose:** first impression, showing real scale and atmosphere.
- **Fits:** manufacturing, hotels, restaurants, real estate, travel, schools. In general, any industry with genuinely good photos.
- **Layout:**
  - height `calc(100dvh - 72px)`, full-bleed images;
  - text in the **bottom left** corner: eyebrow, `text-display` heading, one lede sentence, ButtonLink `tone="light"`;
  - bottom right corner: a bar indicator per slide, a highlight-colored progress bar, a pause button;
  - the scrim is a radial gradient in the 4 corners, **never a dark overlay across the whole image**.
- **Motion:**
  - 1.2s crossfade, 6.5s per slide, gentle Ken Burns drift;
  - manual slide changes reset the timer;
  - reduced motion: stays still on the first slide.
- **Required data:** 3 to 5 high-quality landscape photos of different scenes.
- **Variants:**
  - background video (muted, with poster, paused under reduced motion);
  - a single still image;
  - split hero (text left, image or product screenshot right), suited to SaaS or services.
- **Dropped:**
  - transparent header over the hero;
  - cramming figures into the hero;
  - scroll-hint arrow.
- **Reference:** `home/hero-section.tsx`.

### H2. Centered statement
- **Purpose:** one sentence saying who the business is, right under the hero.
- **Fits:** every industry.
- **Layout:** white background, Container `default` (1100px), centered. In order:
  - `sr-only` h2;
  - highlight-colored quotation mark;
  - statement line in `text-section`;
  - short story paragraph;
  - ButtonLink to the About page.
- **Reference:** `home/intro-section.tsx`.

## L. Catalog presentation

### L1. Catalog bento
- **Purpose:** show the breadth of the catalog (product groups, services, departments, room types), each cell leading to a group page.
- **Fits:** product catalogs, services, medical specialties, courses, room types, project lines. Best with 4 to 7 groups.
- **Layout:**
  - 3-column grid: first cell 2×2, two cells stacked on the right, bottom row of 3 equal cells;
  - each cell has a cover image + group name + `CardAction`; the whole cell is a link;
  - the heading's action is a "View all" ButtonLink;
  - no lede;
  - mobile: 1 or 2 columns.
- **Motion:** slight image zoom; CardAction turns highlight and the arrow slides.
- **Dropped:** staggered 3-column masonry.
- **Reference:** `home/products-section.tsx`.

### L2. Full-bleed large image card carousel
- **Purpose:** showcase each featured item with a large image, each card leading to a detail page.
- **Fits:** projects, case studies, materials, collections, rooms, signature dishes, past events, featured articles.
- **Layout:**
  - SectionHeading on the left + "View all" ButtonLink on the right;
  - cards about 60% of the container wide (about 1.6 cards visible per view), **starting at the container's left edge and bleeding off the right edge of the screen**;
  - horizontal `scroll-snap`, hidden scrollbar;
  - under the image: UPPERCASE NAME | vertical rule | "Explore →";
  - navigation: a `CircleNavButton` pair in the middle of the screen, with a static line running out to the right edge.
- **Required data:** at least 4 items, each with a good image in the same aspect ratio.
- **Reference:** `home/materials-showcase-section.tsx`, archive `projects-section.tsx` (16:10 image version, 2 cards per view).

### L3. Horizontal card grid (image left, name right)
- **Purpose:** list every item on a catalog page.
- **Fits:** materials, services, branches, leadership team, study programs.
- **Layout:**
  - soft background, 2 columns from lg;
  - white cards about 360px tall: image up to 360px on the left; on the right, uppercase name + "See more" ButtonLink;
  - mobile: 4:3 image on top, text below;
  - `id = slug` so the menu can jump to it.
- **Reference:** `materials/materials-grid.tsx`.

### L4. Filterable browser (grid or list)
- **Purpose:** let customers search a catalog of a few dozen to a few hundred items themselves.
- **Fits:** products, real estate (filter by area, type, price), courses, jobs, menus, downloadable documents.
- **Layout:**
  - **filters are rows of chips above the grid**, not a left column, so the grid stays wide; on mobile each row scrolls horizontally;
  - the main facet is single-select; secondary attributes are multi-select;
  - each chip shows its result count, computed against the other active filters; only chips with results are shown;
  - bar above the grid: total count + Grid / List toggle;
  - grid of 6/4/3/2 columns (xl/lg/sm/mobile), with pagination;
  - state is kept in the URL (`?category=&material=a,b&view=list&page=2`, written with `history.replaceState`), wrapped in `<Suspense>`.
- **Card:**
  - square image on a soft background, type (small uppercase text), name in sentence case, "See more →" at the bottom of the card;
  - list version: 4:3 image on the left, detailed info on the right.
- **Dropped:**
  - left filter column;
  - 4:5 images (too tall in a dense grid);
  - uppercase names on cards;
  - having to pick a group before seeing any products.
- **Reference:** `products/product-browser.tsx`, `product-card.tsx`.

## P. Proof of capability

### P1. Stats band
- **Purpose:** let numbers speak (years of experience, clients, floor area, capacity, satisfaction rate).
- **Fits:** any industry with **confirmed** figures.
- **Layout:**
  - 3 to 5 cells; each has a 48×2px highlight accent rule, a large number, an uppercase label, one descriptive sentence;
  - brand background right under the PageHeader so the page shows brand color on the first screen;
  - variant on white: a `.ui-stats` grid of 2/3/5 columns with hairline dividers.
- **Motion:** count-up when scrolled into view (CountUp).
- **Reference:** `capabilities/capacity-band.tsx`, archive `stats-section.tsx`.

### P2. Network map
- **Purpose:** show reach: export markets, branches, dealers, international clients, tour destinations.
- **Fits:** export, logistics, retail chains, travel, international organizations.
- **Layout:**
  - brand background; heading on top; a **dotted** world (or country) map spanning the full width;
  - destination points in the accent color; solid arcs from the origin to each point;
  - each point has a badge (flag or icon), its name in a tooltip, and a thin stem from the dot to the badge;
  - the origin point has a ripple;
  - below lg: badges become a row of chips under the map.
- **Motion:**
  - arcs draw themselves when scrolled into view, then a light sweep runs along each arc and fades, on a loop;
  - hovering a badge lights up that point and dims the rest.
- **Technique:** the dotted SVG is rendered on the server; only the interactive part runs on the client.
- **Dropped:**
  - dashed arcs;
  - detached moving streaks;
  - grouping badges by continent;
  - a country list column beside the map.
- **Reference:** `home/export-section.tsx`, `export-interactive.tsx`.

### P3. Media offset (large full-bleed image + small offset image + text)
- **Purpose:** introduce an in-depth page (factory, facilities, team, space) and lead to it.
- **Fits:** any industry with real photos of its spaces.
- **Layout:**
  - large image bleeding off the left edge of the screen, about 7/12 of the width;
  - a small detail image overlapping the bottom right corner of the large image;
  - text block on the right, set lower than the top edge of the image: heading, paragraph, 3 trust points as a thin list, ButtonLink;
  - mobile: image bleeds to both edges, text stacked below.
- **Simple variant (media-text):** image on one side, text on the other, alternating sides between blocks.
- **Alternative:** a bento of 3 trust points with icons + 1 large image with overlaid text + 2 small cells (archive `factory-bento-section.tsx`).
- **Reference:** `home/factory-section.tsx`.

### P4. History timeline (horizontal)
- **Purpose:** the growth journey through milestones.
- **Fits:** long-established businesses, schools, organizations. **Use real milestones only.**
- **Layout:**
  - brand background with a diagonal gradient leaning toward the highlight color, a corner glow, a faint dot grid;
  - founding year set very large as a watermark (thin outlined text);
  - each milestone: large highlight-colored year (soft shadow, no outline) → icon in an outlined circle sitting on the line → uppercase milestone name → description;
  - 4 milestones or fewer: static grid; more: horizontal slider with CircleNavButton.
- **Motion:** on scroll into view, the line draws from left to right and milestones appear one by one.
- **Reference:** `about/history-timeline.tsx`.

### P5. Process as a vertical sticky scroll timeline
- **Purpose:** explain a clearly ordered sequence of steps: production line, treatment path, construction stages, customer journey.
- **Fits:** manufacturing, construction, healthcare, education, multi-step services.
- **Layout:**
  - soft background;
  - **left:** vertical timeline whose highlight-colored part grows with scrolling; each step has a dot + a **large number**, sticky on screen while that step is being read;
  - **right:** pill "Received from · <previous step>" → uppercase step name in brand color → a one-sentence summary with an accent rule → a bottom row with a task card next to a labeled 4:3 image;
  - each step has an anchor `#step-N`; jumping to it flashes the background softly (`.ui-anchor:target`).
- **Reference:** `capabilities/workshops-scroll.tsx`.

### P6. Split with sticky column (steps or commitments)
- **Purpose:** one topic with heading and commitments on the left, per-step details on the right.
- **Fits:** quality control, security, policies, consulting process, pre-treatment steps.
- **Layout:**
  - left (sticky on scroll): heading + 2 to 3 commitments;
  - right: rows; each row is a highlight-colored number | name + description | small 4:3 image; hairlines between rows;
  - variant (catalog-style media-text): left is a 3×2 grid of steps with large numbers, right is an image that sticks while scrolling.
- **Dropped:**
  - 3 image cards on a dark background;
  - dark staircase layout;
  - full-screen cream background.
- **Reference:** `capabilities/quality-section.tsx`, `surface-finish-section.tsx`.

### P7. Certifications / awards as "paper sheets"
- **Purpose:** build trust with certifications, licenses, awards.
- **Fits:** manufacturing, healthcare, education, finance.
- **Layout:**
  - white background, card grid; each card is an illustrated sheet of paper with an inner border, logo + name; scope written underneath;
  - **never** put certificate numbers or issuer names on the illustration, so it cannot pass as a fake certificate;
  - unconfirmed items get a "Sample" label; when a real scan exists, the card becomes a download link.
- **Reference:** `capabilities/certifications-section.tsx`.

### P8. Partnership phase cards (You / Us)
- **Purpose:** help customers understand how working with the business unfolds and who does what.
- **Fits:** OEM/ODM, agencies, consulting, construction, custom software.
- **Layout:**
  - brand background; heading + "Get started" button on top;
  - 3 phase cards on white; each card has an image, phase name and 2 steps inside; each step is labeled with who does it (**You / Us**);
  - from xl: 3 columns; md to xl: horizontal cards, image on the left; mobile: stacked.
- **Dropped:** 6 steps in a single horizontal row.
- **Reference:** `capabilities/oem-process-section.tsx`.

## C. Conversion

### C1. Split FAQ
- **Fits:** every industry.
- **Layout:**
  - white background;
  - left (sticky on scroll): heading + contact link;
  - right: a list of `<details>` (works without JS, good for SEO).
- **Note:** answers must not state unconfirmed figures.
- **Reference:** `capabilities/faq-section.tsx`.

### C2. Brand CTA band with a sunken image
- **Purpose:** close with an action. Reused at the bottom of many pages.
- **Layout:**
  - brand background with a heavily tinted image behind;
  - SectionHeading `tone="light"` on the left;
  - 1 to 2 ButtonLinks `tone="light"` on the right, opening the contact form with the purpose preselected (`/contact?purpose=quote#contact-form`).
- **Position:** always directly above the footer.
- **Reference:** `home/cta-section.tsx`.

### C3. Vertical contact form
- **Layout:**
  - one continuous vertical form, white background, directly under the PageHeader;
  - from sm, pairs of short fields go in 2 columns; message and attachments take 1 column;
  - purpose is a radio pill group, preselected from `?purpose=`; the code of the item of interest can be prefilled from `?model=`;
  - errors show per field and entered values are kept; on success, a confirmation panel appears.
- **Fits:** quotes, bookings, consultations, course enrollment, table reservations (adjust the field set).
- **Dropped:**
  - info column to the left of the form;
  - colored background for the form block.
- **Reference:** `contact/contact-form.tsx`.

### C4. Contact info + map
- **Layout:**
  - left: contact channels (phone, email, Zalo/WhatsApp, opening hours; `null` values are hidden), address + directions, an invitation to visit with a booking button;
  - right: embedded map.
- **Reference:** `contact/visit-section.tsx`.

## D. Detail pages

### D1. Detail hero: gallery + sticky info column
- **Fits:** products, real estate, hotel rooms, courses, services.
- **Layout:**
  - shared breadcrumb;
  - **left:** gallery. Large 3:2 image; use `object-contain` for studio shots so the object is not cropped; the thumbnail strip only shows with 2 or more images; clicking an image opens a lightbox (zoom, fullscreen, thumbnails, swipe, ←→ keys);
  - **right** (sticky at lg): type → H1 name → code → intro paragraph → short spec table → primary action button (prefills the code into the form) + note.
- **Dropped:**
  - colored background for the image frame;
  - zoom icon.
- **Reference:** `products/product-detail.tsx`, `product-gallery.tsx`.

### D2. Description / specs tabs with collapsible blocks
- **Layout:**
  - tab row directly under the hero;
  - **Description:** HTML from the CMS;
  - **Specs:** `details/summary` blocks (dimensions, materials, packaging, options...). Empty fields hide their row or show "Being updated";
  - every tab's content is rendered into the HTML up front (good for SEO).
- **Next on the page:** "Same group" (soft background, grid + ButtonLink) → CTA.

### D3. Content detail page (article style)
- **Fits:** materials, services, medical specialties, projects.
- **Layout:**
  - PageHeader with a square image as `aside` on the right;
  - alternating media-text blocks (e.g. characteristics: text | portrait 2:3 image | landscape 4:3 image);
  - a large text block on a soft background;
  - the page ends with a grid of related items (hidden if there are none).
- **Reference:** `materials/material-detail.tsx`.

### D4. 404 and error pages
- **Layout:**
  - shared header + footer; a centered block filling most of the screen height;
  - SectionHeading `as="h1"` + 2 buttons (home, contact);
  - the error page (`error.tsx`) adds a "Try again" button and the error code (digest).
- `[...rest]/page.tsx` catches every unknown URL so the 404 still has the header and footer.

## N. Patterns without a reference build yet (design from the shared principles)
When an industry needs one of the patterns below, build it fresh with the same components and tokens, then add it to this catalog once approved.

| Pattern | Fits | Layout suggestion within the system |
| --- | --- | --- |
| Pricing / plans | SaaS, services, courses | 3 equal-height cards, the recommended plan gets a brand border + highlight label; one ButtonLink per card; feature comparison table in a `<details>` below |
| Testimonials | Every industry | One large `text-section` quote with a highlight quotation mark + name, title; scroll-snap carousel if there are many; real, approved quotes only |
| Client / partner logo strip | B2B, SaaS | Row of gray (grayscale) logos, color on hover; only logos with permission |
| Team | Services, healthcare, education, agencies | Grid of portraits in the same 4:5 ratio, name + role; click to open details |
| News / blog | Every industry | Featured article with a large image + 3-column grid of other articles (3:2 image, date, title); article pages use Container `narrow` |
| Menu | Restaurants | Tabs per dish group; rows of name … price with hairlines; selected dish photos |
| Event / class schedule | Events, education | List by date (large highlight-colored date | name | venue | register button) |
| Digital product features | SaaS | Alternating media-text with framed screenshots; or a 3×2 grid with lucide icon + title + 1 sentence |

## Reference background rhythm
Reference project homepage:
`Hero (image) → Statement (white) → Bento (white) → Carousel (white) → Map (brand) → Media offset (white) → CTA (brand) → Footer (ink)`

Capabilities page:
`PageHeader → Stats band (brand) → Vertical process (soft) → Split (white) → Split (white) → Certifications (white) → Phase cards (brand) → FAQ (white) → Footer`

Adjacent white blocks are fine because their layouts differ clearly. Only avoid two blocks with the same colored background (soft, tint, brand) next to each other.

## Hidden section store (reusable, in the reference project's archive)
| Section | Layout | Fits |
| --- | --- | --- |
| ProjectsSection | 16:10 image carousel bleeding off the right edge | Projects, case studies |
| AboutSection | Centered heading, 2 text columns, row of bordered figures | Short intro on the homepage |
| CapabilitiesSection | Full-bleed 100svh horizontal accordion, closed panels show vertical labels | Services, capabilities (high impact) |
| MaterialsSection | One band per item, prev/next slideshow | Presenting items one by one on a single page |
| ProcessSection | Steps from inquiry to delivery | Ordering process |
| ExplodedChair | 3D object pinned mid-screen, parts separate as you scroll | Physical products that need a "wow" (heavy, requires three.js) |
| AboutValues | Soft background, 4 principles numbered 01 to 04 | Core values |
| PageHero | Page header with a large background image | Campaign pages, stories |
