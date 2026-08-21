---
"headertweaker": minor
---

changes:

- Add filter bar to distinguish headers with a URL scope
- Improve empty header-list states
- Place focus on header key input field after creating a header
- Group headers on the URL-specific tab by their exact scoped url
- Add a Select component and reuse previously used URLs when scoping a header
- Externalize all UI copy to `src/i18n` (English only for now)
- Match scoped headers against domains, subdomains, paths, and wildcards consistently.
