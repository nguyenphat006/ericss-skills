# Shared components

Source code is in `assets/components/`. Copy it into `components/shared/` (and `components/layout/` for the header/footer). The comment at the top of each file explains the reason behind each detail.

## Section, Container (`shared/section/section.tsx`)
```tsx
<Section tone="light|soft|tint|brand|dark" spacing="default|band|none" id="anchor">
  <Container size="wide|default|narrow">…</Container>
</Section>
```

| tone | Background / text | Used for |
| --- | --- | --- |
| `light` | white / ink | Default |
| `soft` | surface-soft / ink | Lists, card grids, "related" blocks, secondary content |
| `tint` | light brand (surface-tint) / ink | Processes, certifications, partners |
| `brand` | strong brand / white | Emphasis blocks: CTA, stats band, timeline, partnership process |
| `dark` | ink / white | Rarely used, since the footer is already dark |

- Sections have `scroll-mt-[72px]` by default so anchor jumps are not hidden behind the header.
- Full-bleed images: place them outside the Container, or compute the margin with `calc((100vw - min(100vw, 1800px))/2 + gutter)`.

## SectionHeading (`shared/section/section-heading.tsx`)
```tsx
<SectionHeading eyebrow="Products" title="Product catalog" action={<ButtonLink href="/products">View all</ButtonLink>} />
```
- Props:
  - `eyebrow` (subtitle, should always be present);
  - `title`;
  - `lede` (description, sentence case, unused by default);
  - `action` (bottom-aligned on the right);
  - `align="left|center"`;
  - `tone="dark|light"` (use light on dark backgrounds);
  - `as="h1|h2|h3"`;
  - `className`.
- Default bottom spacing is `mb-12 lg:mb-14`. When the heading sits in a narrow or sticky column, pass `className="mb-0 lg:mb-0"` or `mb-6`.
- Card and form-panel headings do **not** use SectionHeading.

## ButtonLink (`shared/button-link.tsx`)
- The only CTA style: `h-12`, `px-7`, 1px border, text `text-sm font-medium tracking-[.14em] uppercase`, with `ArrowRight` (strokeWidth 2.5).
- Hover: ink background + white text (`tone="light"`: white background + ink text), arrow slides right.
- Call sites do **not** override font size or weight.
- `<button>` elements (form submit, "Try again") use `className={buttonLinkClass(tone)}` + `<ButtonArrow />` to match the style.

## ArrowLink, CardAction
- `ArrowLink` (Link): uppercase 13px semibold text + arrow, no frame. Hover: brand text (highlight on dark backgrounds). Use for "See more" in secondary spots.
- `CardAction` (span): same as above, but placed on image cards where the whole card is already a `<Link className="group">`. Hovering or focusing the card turns the text highlight and slides the arrow.
- `LineLink` (text with a rule above) is **no longer used** and lives in the archive.

## CircleNavButton (`shared/circle-nav-button.tsx`)
Round ← → buttons for carousels:
- thin border with a gap at the tail end of the arrow;
- hover: a solid fill spreads from the center, and a white border draws itself around the button over about 1.1s (SVG `pathLength=100`).

Place the pair in the middle of the screen, with a static line running out to the right edge.

## PageHeader, Breadcrumb
- `PageHeader`: subpage header, replacing an image hero. Contains:
  - white background;
  - breadcrumb (Home / parent / current page);
  - **H1 is the page name**, not a slogan;
  - lede directly under the H1;
  - `children` (CTA, stats) and `aside` (small image on the right, e.g. a close-up of a material surface).
- `Breadcrumb`: small uppercase text, tracking 0.16em. Parent levels gray, the "/" separator black, the current page black semibold with `aria-current="page"`.
- Tried and dropped: lede in the right column; an eyebrow that duplicates the page name.

## ImagePlaceholder (`shared/image-placeholder.tsx`)
- `label` is the image file name; the next line is a note. If `resolveAsset(label)` finds the file in the manifest (`config/assets.ts`) or the label is an http(s) URL, it renders `next/image fill object-cover`. Otherwise it shows a diagonal-stripe background with a mono label.
- The parent must have `relative` + an aspect ratio (`aspect-[3/2]`...) + `overflow-hidden`. Always pass `sizes`.
- Mark stand-in images clearly in the label, e.g. `"team_2.jpg\nstand-in - team photo pending"`.

## CountUp
Counts numbers up when scrolled into view, writing straight to the DOM via motion's `animate()`. With reduced motion, the final number shows immediately.

## Header (`layout/site-header.tsx` + `nav-dropdowns.tsx`)
- **Always a white background**, fixed height 72px (80px from xl), stuck to the top while scrolling (no auto-hide).
- Layout from xl: round logo on the left (no name) | text menu in the center | VI/EN · primary action button (Contact, Quote, Book, Try it; solid brand background) on the right. Whether the logo is icon-only or includes a wordmark depends on the brand.
- Items with children (e.g. product groups, services) open a full-width mega dropdown:
  - opens on hover (closes after a short delay when the pointer leaves, to avoid flicker), or via a separate ▾ button (keyboard, touch); Esc closes it;
  - the panel is text only, split into columns by group, group labels uppercase in the accent color, with a "view all" link at the end of the panel;
  - the parent item is still a real page.
- Below xl: logo on the left; primary action button + hamburger flush right; the menu panel drops down below the header.
- Tried and dropped: centered logo, transparent header over the hero, oversized logo, fullscreen dialog menu (still kept in `layout/menu-dialog.tsx`).

## Footer (`layout/site-footer.tsx`)
Ink background, identical on every page:
1. **Cross-link band** (3 cells, hairline dividers): suggests 3 other pages. The page passes `crossKeys={["about","services","contact"]}` (keys from the project's navigation); this is the only part that changes per page.
2. **3-column grid** `lg:grid-cols-[1fr_0.9fr_1.05fr]`:
   - logo + blurb + a small strip of certifications or awards (if any, confirmed items only);
   - company / product link column;
   - contact (address, phone, email, directions link) + **embedded Google map** (`output=embed`, no API key needed).
3. Copyright line, Privacy, Terms.

## ScrollToTop, SectionDots
- `ScrollToTop`: floating back-to-top button, mounted in the layout.
- `SectionDots`: fixed dot rail on the right (desktop only, homepage only), marking the section in view via IntersectionObserver.
