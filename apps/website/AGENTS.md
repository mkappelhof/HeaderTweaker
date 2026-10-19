# HeaderTweaker website

Static marketing site for the HeaderTweaker browser extension, built with Astro. No client-side
framework — static HTML/CSS, with small inline `<script>` tags only where genuinely needed (e.g.
the mobile nav toggle).

Also read `@mkappelhof/agent-instructions`'s `astro.md` (`node_modules/@mkappelhof/agent-instructions/astro.md`)
for generic Astro conventions. Where this file differs, this file wins.

## Build & Dev

```bash
pnpm --filter headertweaker-website dev     # Dev server
pnpm --filter headertweaker-website build   # Build → apps/website/dist/
pnpm --filter headertweaker-website preview # Preview the production build
```

## Conventions

- Design tokens come from `packages/tokens/src/variables.scss` via `@use 'pkg:headertweaker-tokens'
  as vars;` — injected globally by `astro.config.mjs`, so component `<style lang="scss">` blocks
  can reference `vars.$colors-*` / `vars.$spacing-core-*` directly without an explicit `@use`.
  Never hardcode colors or spacing — add a token to the shared package instead.
- `src/data/extension-meta.ts` applies astro.md's "values read in `astro.config.mjs`" pattern to
  expose the extension's version/description (read from `apps/headertweaker/package.json`) as
  `vite.define` constants.
- `src/data/features.ts` and `src/data/permissions.ts` are this project's data modules (see
  astro.md's Data section); `seo.astro`'s JSON-LD and `llms.txt` are generated from them.
- Screenshots live in `src/assets/screenshots/` (see astro.md's Images section).
