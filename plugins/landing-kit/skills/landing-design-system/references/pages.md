# Page skeletons and presets by website type

## General rules
- Every page is `<SiteHeader /> <main className="flex-1">…</main> <SiteFooter crossKeys={[3 other pages]} />`.
- Keep pages thin: fetch data, `setRequestLocale`, compose sections, `generateMetadata`. The comment at the top of the file records the section order and the date it changed.
- Subpages **do not use an image hero**. Use `PageHeader`: breadcrumb, H1 as the page name (not a slogan), lede directly below.
- Sitemap at most 2 levels deep. The homepage is a table of contents: each section leads to exactly one page. Pages without content are removed from the menu; never leave dead links.
- Header menu has 4 to 6 text items, plus a language switcher and one primary action button.

## Presets by website type
Use a preset as the starting point, then adjust to the brief. Section codes are in `sections.md`.

### 1. Manufacturing / B2B / export (BFC reference project)
- **Pages:** Home, Capabilities, Products (group → model), Materials, About, Contact.
- **Home:** H1 → H2 → L1 (product groups) → L2 (materials/projects) → P2 (markets) → P3 (factory) → C2.
- **Capabilities:** P1 → P5 (workshops) → P6 (QC) → P7 → P8 (OEM partnership) → C1.
- **Primary CTA:** Request a quote. CMS: products (taxonomy + specs + sets), materials.

### 2. Professional services (agency, consulting, law, accounting, architecture)
- **Pages:** Home, Services (+ detail), Projects/Case studies, About (team), News, Contact.
- **Home:** H1 (or split hero) → H2 → L1 (services) → L2 (case studies) → N (client logos) → N (testimonials) → C2.
- **Service detail:** PageHeader → D3 → P8 (how we work) → C1 → C2.
- **CTA:** Book a consultation. CMS: services, case studies, articles, team.

### 3. SaaS / digital product
- **Pages:** Home, Features, Pricing, Customers, Docs/Blog, Contact/Demo.
- **Home:** split hero (screenshot) → N (client logos) → N (alternating features) → P1 → N (testimonials) → N (condensed pricing) → C1 → C2.
- **Tokens:** blue-leaning ink, cool surfaces; the "soft" variant is an option.
- **CTA:** Try it / Book a demo. CMS: articles, changelog, case studies.

### 4. Restaurant / cafe / F&B
- **Pages:** Home, Menu, Space, Events/Offers, Contact/Reservations.
- **Home:** H1 (dishes, space) → H2 → L2 (signature dishes) → P3 (space) → N (testimonials) → C4 (opening hours + map) → C2 (reservations).
- **Tokens:** "soft" variant, warm surfaces.
- **CTA:** Book a table. CMS: dishes, dish groups, offers.

### 5. Hotel / resort / travel
- **Pages:** Home, Rooms (+ detail), Amenities, Offers, Gallery, Contact.
- **Home:** H1 (video or slider) → H2 → L2 (rooms) → L1 (amenities) → P2 (destinations) → N (testimonials) → C2.
- **Room detail:** D1 + D2 (amenities, area, capacity).
- **CTA:** Book a room (links to the booking system). CMS: rooms, amenities, offers.

### 6. Real estate / construction projects
- **Pages:** Home, Projects (filtered), Project detail, Progress, About, Contact.
- **Home:** H1 → P1 → L2 (featured projects) → P2 (location) → P4 (journey) → C2.
- **Listing:** L4 (filter by area, type, status).
- **Detail:** D1 + D2 + map + progress (P5).
- **CTA:** Get a quote / Book a viewing. CMS: projects, units/models, progress.

### 7. Education / training center
- **Pages:** Home, Courses (filtered), Course detail, Instructors, Intake schedule, News, Enroll.
- **Home:** H1 → H2 → L1 (programs) → P1 → N (team) → N (schedule) → N (student testimonials) → C1 → C2.
- **Tokens:** "soft" variant.
- **CTA:** Request a consultation. CMS: courses, schedules, instructors, articles.

### 8. Healthcare / clinic
- **Pages:** Home, Specialties/Services, Doctors, Pricing, Visit guide, Contact/Booking.
- **Home:** H1 (a single still image) → H2 → L1 (specialties) → P5 (visit process) → N (doctors) → P7 (licenses) → C1 → C4.
- **Tokens:** cool surfaces, "soft" variant, minimal motion.
- **CTA:** Book an appointment.
- **Note:** never promise treatment outcomes; comply with healthcare advertising regulations.

### 9. Organization / NGO / events
- **Pages:** Home, Activities/Programs, Events, News, About, Join/Donate.
- **Home:** H1 → H2 → P1 (impact) → L2 (programs) → N (event calendar) → P4 → C2.
- **CTA:** Join / Donate / Register. CMS: programs, events, articles.

## Skeleton per page type
| Page type | Order |
| --- | --- |
| Home | Hero → statement → 3 to 5 summary sections (each with one outbound link) → CTA |
| Catalog page | PageHeader → L3 or L4 → CTA |
| Group page | PageHeader (cover image aside) → L4 filtered by type → CTA |
| Item detail page | D1 → D2 → related (soft background) → CTA |
| In-depth content page | PageHeader (aside) → D3 → related |
| About | PageHeader → large image → story + sticky summary table → P4 → media-text (people, values) |
| Contact | PageHeader → C3 → C4 |
| 404 / error | D4 |

## When adding a new page, ask the user
1. What customer question does this page answer?
2. Which sections from the catalog can be reused?
3. Are real photos and figures available yet?

Then propose a section order along with the background rhythm.
