# components/archive

Store for components that are **no longer shown on the site** but are kept for reuse.
The main folders (`features/*/components`, `components/shared`) contain only components in use.

Conventions:

- Hiding a section = move the file here (under the original page folder), remove it from the feature's `index.ts` barrel,
  and leave a one-line note in the page. Do not delete.
- Reusing = import directly from `@/components/archive/<page>/<file>` or move the file back into the feature.
- Files here are still checked by tsc/eslint, so they must always build. Data and messages stay
  in the original feature.

## <page> (formerly in features/<page>/components)

| File | Component | Hidden since | Layout | Reason hidden / replaced by |
| ---- | --------- | ------------ | ------ | --------------------------- |
