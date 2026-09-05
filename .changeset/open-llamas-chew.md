---
"headertweaker": minor
---

## New Features

- **URL filter bar** — Filter the header list by URL scope to quickly find scoped headers
- **Global tab wizard** — Batch-target multiple headers to a specific URL via a guided flow
- **Drag & drop URL targeting** — Reassign a header's URL target by dragging it to a new scope
- **i18n groundwork** — All UI copy is now externalized to `src/i18n` (English only for now, contributions welcome!)

## Improvements

- Consistently match scoped headers against domains, subdomains, paths, and wildcards
- Group headers on the URL-specific tab by their exact scoped URL
- Reuse previously used URLs via the new `Select` component when targeting a header
- Focus the header key input automatically after creating a new header
- Clearer empty states for the header list
- Prominent alert on the Global tab clarifying that those headers apply everywhere
- New `Toast` component — saving header info now gives instant feedback