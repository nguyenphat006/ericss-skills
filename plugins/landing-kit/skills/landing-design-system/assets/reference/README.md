# Section reference code

Snapshots of real sections from the reference project (BFC, Next 16 + Tailwind 4 + next-intl + motion), matched to the codes in `references/sections.md`.

- These are **examples to read and adapt**, not to copy verbatim: the files still import the reference project's data, messages and image paths (`@/features/*/data`, `@/data/catalog`, `useTranslations("HomePage...")`).
- Token names in these files are the reference project's: `forest` = `brand`, `gold` = `highlight`, `surface-stone` = `surface-soft`, `surface-forest` = `surface-tint`, tone `stone` = `soft`, tone `forest` = `tint`. When adapting, rename them to the role names in `assets/globals.css`.
- `archive/`: some sections that are hidden but still reusable.
