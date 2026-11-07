# Design tokens

Source: `assets/globals.css`. Tokens are declared in Tailwind 4's `@theme inline` block, so use them directly as classes: `text-ink`, `bg-brand`, `py-section`, `text-h1`...

Name tokens by **role**, not by color, so a rebrand only changes values.

## Color: roles
| Token | Role | Example (BFC reference project) | Common classes |
| --- | --- | --- | --- |
| `ink` | Main text, dark backgrounds (footer, dark sections), button hover | `#141414` | `text-ink`, `bg-ink` |
| `ink-soft` | Body paragraphs, lede | `#444444` | `text-ink-soft` |
| `ink-mute` | Secondary labels, breadcrumb, meta | `#6b6b6b` | `text-ink-mute` |
| `line` | Hairlines, card borders | `#e8e8e8` | `border-line` |
| `brand` | Brand color: eyebrow, highlighted header button, `brand` section, focus ring | `#32764a` (green) | `text-brand`, `bg-brand` |
| `highlight` | Accent: numbers, years, active state, accent rules, CardAction hover on images | `#f2c230` (yellow) | `text-highlight`, `bg-highlight` |
| `highlight-ink` | Dark version of the accent, used as **text on white backgrounds** | `#8a6d12` | `text-highlight-ink` |
| `surface-soft` | Neutral alternating background | `#f3f1ec` (warm) | `bg-surface-soft` |
| `surface-tint` | Light alternating background derived from brand | `#eaf1ed` | `bg-surface-tint` |

Do not name tokens `primary` or `accent`: shadcn already uses those names for its own palette (`--primary`, `--accent`...). Leave the shadcn palette at its neutral defaults.

## Deriving a palette for a new project
1. **brand:**
   - take it from the logo or brand guideline;
   - check that white text on brand reaches **≥ 4.5:1** (WCAG AA). If not, darken the color (lower lightness) and keep the hue;
   - for colors that are too light (yellow, turquoise), use a darker version as `brand` and keep the original as `highlight`.
2. **highlight:**
   - an accent that contrasts with brand in hue: green with yellow, navy with orange, burgundy with gold, black with a neon color;
   - use it sparingly: numbers, rules, states; never as a large background area;
   - `highlight-ink` is the dark version of highlight and reaches ≥ 4.5:1 on white.
3. **surface-soft:**
   - warm brands (wood, food, hotels): warm gray, e.g. `#f3f1ec`;
   - cool brands (tech, healthcare): cool gray, e.g. `#f2f4f7`.
4. **surface-tint:** brand mixed at about 6 to 8% over white.
5. **ink:** near-neutral black (`#141414`); navy brands can use a blue-leaning ink (`#0f172a`).
6. Offer the user 2 to 3 options, each with its contrast ratios. Once one is chosen, record it in the brief and in a comment in globals.css.

Color conventions:
- The accent is **not** a CTA button background. The single highlighted button (contact, quote, booking) uses a brand background.
- On dark backgrounds: white text, secondary text `text-white/70`, eyebrow `text-white/60`, hairline `border-white/15`.
- Every time a color changes, record the old value in a comment so it can be restored.

## Mood variants
| Mood | Adjustments |
| --- | --- |
| Solid, B2B (default) | `--radius` 2px, uppercase headings, square-cornered images, restrained motion |
| Soft, friendly (education, healthcare, F&B) | `--radius` 0.75rem, sentence-case headings `font-semibold`, slightly rounded images `rounded-lg`, buttons may use `rounded-full` (still a single button style) |
| Dark, premium (luxury, tech) | Page background `ink`, alternating sections use a lighter ink (e.g. `#1c1c1c`); white text; metallic highlight; high-contrast images |
| Tech / SaaS | Blue-leaning ink, cool surfaces, font can be Geist or Inter; add framed product screenshots |

To change the mood, change tokens and shared components, not individual sections.

## Typography
The default font is Inter (`next/font/google`) with subsets matching the site's languages (e.g. `latin` + `vietnamese`), assigned to the `--font-sans` variable. To change fonts, change one place in the layout.

| Token | Value | Used for |
| --- | --- | --- |
| `text-display` | `clamp(3rem, 5vw + 1rem, 6rem)` / lh 1.05 | Hero heading |
| `text-h1` | `clamp(2.25rem, 3vw + 1.5rem, 4rem)` / 1.1 | Subpage H1, product or service name |
| `text-section` | `clamp(2rem, 3.2vw, 3rem)` / 1.15 | Section headings, statement lines |
| `text-h2` | `clamp(1.875rem, 1vw + 1.6rem, 2.5rem)` / 1.2 | Secondary headings in subpages |
| `text-h3` | `1.5rem` / 1.25 | Card names, step names |
| `text-lede` | `1.0625rem` / 1.7 | Lede, main body text |
| `text-eyebrow` | `0.75rem`, tracking 0.16em | Uppercase labels |

Typography rules:
- Loosen tracking on uppercase text: `.01em` for headings, `.14em` for buttons, `.16em` for labels.
- Tighten large sentence-case text slightly (`-0.015em`).
- `text-balance` for headings, `text-wrap: pretty` for body.
- Paragraphs max 60 to 64ch wide, heading blocks max 40rem.
- Only two weights: `font-semibold` for headings and labels, `font-medium` for buttons.

## Spacing and grid
| Token | Value | Meaning |
| --- | --- | --- |
| `gutter` (`px-gutter`) | `clamp(1.5rem, 5.6vw, 5rem)` | Left/right margin: 24px on mobile, 80px on large screens |
| `section` (`py-section`) | `clamp(5rem, 6vw + 2.5rem, 7rem)` | Default vertical rhythm 80 to 112px |
| `band` (`py-band`) | `clamp(3rem, 5vw, 6rem)` | Colored bands, shorter rhythm |
| `--container-content` | `1640px` | Max content width (1800px total with gutters) |

- Use the `wide` container for everything (header, hero, sections, footer) so everything aligns to **one left axis**. `default` (1100px) and `narrow` (760px) are for narrow centered reading columns. Text-heavy sites (blogs, organizations) can lower `--container-content` to about 1280px.
- Header height is 72px (80px from xl). Sections have `scroll-mt-[72px]`.
- Breakpoints: sm 640, md 768, lg 1024, xl 1280. The full text menu shows from xl; below that, use a hamburger. With few menu items it can show from lg.

## Radius, borders, shadows
- `--radius: 0.125rem` (2px) for buttons, inputs and cards; **images have 0 radius**. Chips, swatches and round buttons use `rounded-full`. For the soft variant, see the mood table above.
- No drop shadows on cards; separate with hairlines or background changes.

## Motion
- Easing:
  - `ease-out-soft`: `cubic-bezier(0.22,1,0.36,1)`;
  - `ease-emphasized`: `cubic-bezier(0.2,0,0,1)`.
- Durations:
  - `--duration-micro`: 120ms;
  - `--duration-base`: 220ms, for hover;
  - `--duration-slow`: 420ms.

  Class syntax: `duration-(--duration-base)`.
- Common motion patterns:
  - arrow slides `translate-x-1` on hover;
  - slight image zoom inside cards;
  - lines that draw themselves when scrolled into view;
  - count-up numbers;
  - crossfade with Ken Burns in the hero.
- Constraint: use IntersectionObserver or motion's `useScroll`; do not attach `scroll` listeners.
- `prefers-reduced-motion`: already disabled site-wide in globals.css; components using motion should also check `useReducedMotion()`.
- Focus: `outline 2px brand, offset 3px` applies to every element.

## tailwind-merge
Custom tokens must be declared in `extendTailwindMerge` (`assets/utils.ts`). Otherwise `cn("text-section", "text-white")` will drop `text-section`. When adding a new token, add it here too.
