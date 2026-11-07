# Discovery before building the site

Goal: before writing the first line of code, make sure you clearly understand:
- who the business is, what the site is for, and who visits it;
- the **product structure and specifications** that need to be managed;
- the **brand and colors**;
- the features and the infrastructure.

Getting this step wrong means tearing down and redoing both the CMS models and the UI. Asking thoroughly here is far cheaper.

The questions below are written in English; at runtime, ask them in the user's own language and reply to the user in that language.

## How to ask
1. **Research first, ask later.**
   - Ask the user what material they already have, then read it first: old website, company profile (PDF), catalogue, price list or product Excel, logo, brand guideline, photos, ERP data.
   - If a question can be answered from the material, **do not ask it again**: just confirm ("I see the catalogue is split into 6 groups A, B, C..., is that right?").
2. **Ask in rounds, at most 4 questions per round** (AskUserQuestion tool). Each question:
   - offers concrete options, with the recommended option first, marked "(Recommended)";
   - stands on its own and says clearly what it is asking about.

   Ask open questions (company name, slogan, list of markets) in plain text.
3. **Order the rounds** by impact: goals → content and page structure → product structure → brand → features → infrastructure. Skip a round when the user has already covered it.
4. **Do not guess figures or facts about the business.** If something is missing, record it under "Open questions" and use the placeholder `NULL`. Never invent a founding year, capacity or certification.
5. **Dig deeper when an answer is vague.** For example, if the user says "blue/green" (Vietnamese "xanh" covers both), ask: green or blue, dark or bright, is there a hex code in the logo, an example site whose color they like. For "luxurious", ask: minimal-white luxury or dark-with-gold luxury.
6. **Close with a brief:** record every answer in the project's `docs/brief.md` (template in `assets/brief-template.md`). Summarize it back for the user to confirm before scaffolding. The brief is the source of truth for every agent that works on the project later; when the user changes their mind, update the brief and note the date of the change.

## Round 1: Business and goals
- **Domain:** what field is the site about (manufacturing, services, SaaS, F&B, hotel, real estate, education, healthcare, organization...)? Which preset in `references/pages.md` of the landing-design-system skill (if installed) does it match? Company name, brand name, domain name?
- **Model:** B2B (OEM/ODM, distributor, projects) or B2C? Do they sell online? Usually not, in which case the site is a catalog + quote request intake.
- **Who visits the site** (import buyers, architects, dealers, consumers)? In which markets? Which languages (default vi + en; are other languages needed)?
- **The #1 goal** of the site:
  - receive quote requests;
  - prove factory capability;
  - showcase products;
  - recruiting;
  - brand building.
- **Primary action** (CTA) visitors should take: submit a form, call, message on Zalo/WhatsApp, book a factory visit, download the catalogue.
- **Differentiators** versus competitors: scale, materials, certifications, speed, price, custom design.
- **Reference sites** they like or dislike, and what they like about them (layout, feel, how products are presented). Learn layout only, do not copy.
- **Real figures available:** founding year, floor area, headcount, capacity, number of markets, notable clients (may they be named?).

## Round 2: Content and page structure
- **Page list.** Default suggestion: Home, Capabilities, Products, (Materials / Services / Projects), About us, Contact. Do they also need News, Careers, Downloads, Policies?
- **The home page** must convey which 3 to 5 points, in priority order? Each point becomes a section linking to a page (see the landing-design-system skill).
- **Dynamic content types** (go into the CMS): products, materials, projects/case studies, news, FAQ, certifications, history milestones, team, jobs, downloadable documents.
- **Who updates it, and how often:** content that changes often goes into the CMS; content that rarely changes stays in messages or code.
- **Is approval needed before publishing** (a single Admin role, or Editor + Reviewer)?
- **Existing data sources:** ERP, Excel, PDF catalogue, old website. How many items (a few dozen or several thousand)?
- **Photos:** are there real photos yet (studio product shots, factory, people)? Who shoots the missing ones? Any video?

## Round 3: Main content structure and specifications (dig deepest here)
"Main content" is what visitors come to the site to see, depending on the domain:
- products (manufacturing, wholesale);
- services (agency, clinic);
- rooms (hotel);
- dishes (restaurant);
- projects or units (real estate);
- courses (education);
- events (organization).

This round determines the CMS models, the API, the filters and the detail pages. **Ask with real examples:** request 2 to 3 representative items with complete information, then compare them against the patterns in `content-models.md`.

- **Content types:** which types exist? Which is primary (has a list page, filters and a detail page), and which are secondary (only shown inside sections)?
- **Hierarchy:** how many grouping levels? For example:
  - Group → Type → Model (catalog);
  - Specialty → Service;
  - Area → Project → Unit.

  Can an item belong to several groups? Is there a "collection" or "programme" that bundles items? Can that collection be public?
- **Variants:** does an item have several versions (color, size, room class, class schedule)? Is each version its own page, or an option within the same page?
- **Composite items:** are there sets, combos or packages (dining set, health check package, meal combo)? Does each component have its own information?
- **Filter attributes:** what do visitors actually use to choose (material, area, price, level, format, amenities)? Is each attribute single-select or multi-select? If multi-select, does it match with AND or OR?
- **Information shown for each item:** list every field and unit (dimensions in cm, area in m², duration, capacity, price...). Ask specifically:
  - Is price shown? B2B usually does not.
  - Are there MOQ, lead time, warranty, certifications?
  - Which fields are required? Which empty fields hide the row, and which show a placeholder such as "Updating soon" (example copy; it goes in messages per locale)?
- **Translation:** which fields need translating (description, dish name) and which stay the same in every language (code, measurements, proper names)? Machine translation followed by human review?
- **Images, documents:** how many images per item, what aspect ratio, what background? Are there spec sheet PDFs, videos, 3D files, floor plans?
- **Identifiers and URLs:** is there an internal code, and may it be shown publicly? Slug by name or by code? Does the old site have URLs that need redirects?
- **Data that must not be public:** client names, cost prices, internal notes, personal data.
- **Conversion flow from the detail page:** quote, booking, room reservation, registration. Is the item code prefilled into the form? Is there a multi-item "interested" list? Does it need to connect to an external system (booking, CRM)?
- **Source and sync:** manual entry, a one-time Excel import, or periodic sync from ERP/CRM (one-way, with review)? Current and expected volume?

Record the result as a **model diagram** in the brief: table name, fields, type, required or optional, translated or synchronized, used for filtering or not. Have the user approve this diagram before writing migrations.

## Round 4: Brand and visual design
Details are in the landing-design-system skill (the "Ask about the brand" section in SKILL.md). At minimum you need:
- logo (vector file or transparent PNG), brand guideline if available;
- **primary color** and **accent color** (hex codes, or a description from which you propose 2 to 3 options to choose from);
- 3 adjectives describing the desired feel;
- keep the BFC design system as is or adjust it (font, corner radius, amount of imagery);
- what they dislike.

## Round 5: Features
- **Contact form:**
  - fields (name, email, company, country, phone, purpose, model code, message, attachment);
  - where submissions go (which email, stored in the CMS, which CRM);
  - who receives them, whether an auto-reply is needed.
- **Anti-spam:** Cloudflare Turnstile (recommended), honeypot, rate limiting.
- **Messaging channels:** Zalo, WhatsApp, Messenger. Map, opening hours.
- **Analytics:** GA4, Google Tag Manager, Meta Pixel? If so, a cookie consent banner is needed (EU visitors).
- **Other:** product search, catalogue download (gated behind a form?), newsletter, blog, careers page with a CV submission form.
- **SEO:** main keywords, old pages that need redirects to new URLs, Google Search Console.

## Round 6: Infrastructure and operations
- Who manages the domain and DNS? Is there a VPS already (OS, specs)? Or do they prefer a managed service?
- Existing systems to connect: ERP (one-way sync with review?), CRM, company email (SMTP).
- Dev machine:
  - Windows or macOS?
  - Is Docker allowed?
  - Which ports are already taken (e.g. in the reference project 8000 was taken by another app, so the CMS uses 9000 and the web app uses 4000)?
  - Is there a policy blocking .exe execution?
- Who maintains the site after handover? Is an editor guide needed?
- Timeline, priority phases (launch a minimal version first?), budget for paid services (machine translation, email, CDN).
- Specific requirements from management or the organization: must the admin UI look like internal systems? Security and data retention policies?

## From answers to decisions
| Answer | Affects |
| --- | --- |
| Hierarchy, variants, sets, specifications | `apps/catalog` models (taxonomy, Product, SetItem, SpecFields), API, ProductBrowser filters, detail page |
| Translated / synchronized fields | `translatable_fields`, multilingual ADR |
| Who edits, whether approval is needed | Roles, permissions, DraftState or not |
| Page list, home page points | IA, `config/navigation.ts`, choosing sections from the catalog |
| Colors, feel, logo | Tokens in `globals.css`, Wagtail admin theme |
| Form, receiving channels | `inquiries` app, email, private storage |
| Infrastructure | `docker-compose.prod.yml`, env, dev ports |

Only start G0 once the user has confirmed the brief. Open questions do not block scaffolding, but they must be in the brief and raised again when you reach the related part.
