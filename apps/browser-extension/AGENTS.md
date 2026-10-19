# HeaderTweaker

A browser extension (Firefox + Chrome) that lets users modify outgoing HTTP headers. Built with React, TypeScript, Vite, and SCSS modules.

Also read `@mkappelhof/agent-instructions`'s `react.md` (`node_modules/@mkappelhof/agent-instructions/react.md`)
for generic React conventions. Where this file differs — e.g. design tokens here are SCSS variables
(`vars.$colors-*`), not CSS custom properties — this file wins.

## Build & Dev

```bash
pnpm install               # Install dependencies

pnpm build:firefox         # Build for Firefox  → dist/firefox/
pnpm build:chrome          # Build for Chrome   → dist/chrome/
pnpm build:all             # Build both targets

pnpm dev:firefox           # Build + run in Firefox with file watching
pnpm dev:chrome            # Build + run in Chromium with file watching

pnpm check-types           # TypeScript type check (no emit)
pnpm test                  # Run Vitest unit tests
pnpm lint                  # Biome lint
pnpm format                # Biome format + Stylelint (SCSS)
pnpm format-n-lint         # Both lint and format checks
pnpm format-n-lint:fix     # Auto-fix lint and format issues
```

## Architecture

- **`src/background.ts`** — Extension background script (service worker)
- **`src/headertweaker.tsx`** — Main UI entry point
- **`src/components/`** — Feature components, each co-located with its `.module.scss`
- **`src/helpers/`** — Pure utility functions; every function must live in its own dedicated helper file
- **`src/contexts/`** — React context providers
- **`src/interfaces/`** — Shared TypeScript types (`Header`, `Status`)
- **`src/i18n/`** — Localization: `config.ts` initializes i18next, `locales/en-US.json` holds the nested translation keys
- **`public/manifest.json`** — Firefox manifest (base); `manifests/chrome.json` for Chrome overrides
- The Vite `sync-manifest` plugin writes the current `package.json` version into the built manifests at bundle time

## Conventions

- Use **path aliases** for cross-directory imports (never relative `../../`):
  `@components/*`, `@helpers/*`, `@contexts/*`, `@interfaces/*`, `@constants/*`, `@styles/*`, `@i18n/*`
- **SCSS styling**: Use SCSS modules (`.module.scss`) co-located with each component. Design tokens are injected globally by Vite (`@use "pkg:headertweaker-tokens" as vars;`, see `vite.config.ts`) — reference them via `vars.$colors-*`, `vars.$spacing-core-*`, `vars.$border-radius-primary`, etc. Never hardcode colors or spacing values — always use design tokens from `packages/tokens/src/variables.scss` (shared with the website).
- **Compound components** (see react.md): used in this repo for `Modal` and `Steps`:

  ```tsx
  // src/components/steps/steps.tsx
  <StepsProvider value={contextValue}>
    <Steps.StepIndicators />
    <Steps.Step title="...">Content</Steps.Step>
    <Steps.StepNavigation />
  </StepsProvider>
  ```

- **Contexts** (see react.md): example from this repo:

  ```tsx
  // src/contexts/steps.context.tsx
  export type StepsContextValue = { /* ... */ };
  export const StepsContext = createContext<StepsContextValue | undefined>(undefined);
  export const StepsProvider: FC<PropsWithChildren<{ value: StepsContextValue }>> = ({ value, children }) => (
    <StepsContext.Provider value={value}>{children}</StepsContext.Provider>
  );
  export const useStepsContext = (): StepsContextValue => {
    const context = useContext(StepsContext);

    if (!context) throw new Error('useStepsContext must be used within a StepsProvider');

    return context;
  };
  ```

## Testing

- Also mock extension APIs (not just browser APIs) at module boundaries with Vitest mocks — see react.md for the rest of the testing conventions.
- Run `pnpm test` after changing behavior. Also run `pnpm check-types` and `pnpm check` before completing a change.

## Versioning & Release

- Every PR **must include a changeset** — CI will fail without one:

  ```bash
  pnpm change   # interactive prompt to create a changeset
  ```

- Merging to `master` automatically bumps the version, creates a git tag, and publishes a GitHub release with Firefox and Chrome `.zip` artifacts
