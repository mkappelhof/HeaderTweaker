# HeaderTweaker

A browser extension (Firefox + Chrome) that lets users modify outgoing HTTP headers. Built with React, TypeScript, Vite, and SCSS modules.

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
- **Localization**: never hardcode user-facing text (labels, placeholders, aria-labels, messages). Add a key to the matching group in `src/i18n/locales/en-US.json` and render it with `const { t } = useTranslation()` from `react-i18next`. Interpolate values with `t('group.key', { name })` matching `{{name}}` in the translation, and use i18next `_one` / `_other` suffixed keys with `{ count }` for plurals. Non-component code (helpers, constants) returns a `TranslationKey` instead of translated text, so the component can translate it.
- **SCSS styling**: Use SCSS modules (`.module.scss`) co-located with each component. Import design tokens using `@use '@styles/variables' as vars;` and reference tokens via `vars.$colors-*`, `vars.$spacing-core-*`, `vars.$border-radius-primary`, etc. Never hardcode colors or spacing values — always use design tokens from `src/styles/variables.scss`.
- Components use named arrow-function exports typed as `FC<Props>`.
- Always render text through the `Text` component (`@components/text/text`); never place raw strings in bare DOM elements such as `<span>` or `<p>`.
- Declare all TypeScript types with `type`; do not use `interface`. Export a component prop type when it is shared.
- Constants belong in `src/constants/`, never inline in components. Define sets of options as a `SCREAMING_SNAKE_CASE` object with `as const` and derive the type from it:

  ```ts
  export const SCOPES = {
    ALL: 'all',
    NO_SCOPE: 'no-scope',
  } as const;

  export type Scope = (typeof SCOPES)[keyof typeof SCOPES];
  ```

- Type DOM-wrapping components with `ComponentPropsWithoutRef<'element'>` and wrappers with `PropsWithChildren<Props>`.
- Do not use `as any` or `as unknown as T` to silence TypeScript errors; narrow values to the required type instead.
- Import `clsx` as `classnames`: `import classnames from 'clsx'`. Compose class names as `classnames(css.header, className)`.
- **Composition over configuration**: pass content as `children` rather than through content props (`label`, `icon`, `text`). `Button`, `IconButton`, and `Text` follow this.
- **Compound components**: Build multi-part components using composition, not props. Keep subcomponents in an `elements/` folder and re-export them from the parent module (no `elements/index.ts` barrel). The parent manages state and shares it with its subcomponents through a context. This pattern is used for `Modal` and `Steps`.

```tsx
// src/components/steps/steps.tsx
<StepsProvider value={contextValue}>
  <Steps.StepIndicators />
  <Steps.Step title="...">Content</Steps.Step>
  <Steps.StepNavigation />
</StepsProvider>
```

- **Contexts**: Create all contexts in `src/contexts/` with the naming convention `*.context.tsx`. A context file exports the context value type, the context, a dedicated provider component, and a `use*Context` consumer hook that throws when used outside its provider. Always consume a context through its hook — never `useContext` directly.

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

- Linting/formatting: **Biome** for JS/TS/JSON, **Stylelint** for SCSS — both run in CI

## Testing

- Use **Vitest** with the configured JSDOM environment for unit tests.
- Co-locate tests with their source using the `*.spec.ts` or `*.spec.tsx` naming convention.
- Every helper must have a unit test (add or update the co-located *.spec.ts whenever you add or change one).
- Test pure helpers directly. Mock browser APIs, extension APIs, and external dependencies at module boundaries with Vitest mocks.
- Run `pnpm test` after changing behavior. Also run `pnpm check-types` and `pnpm check` before completing a change.

## Versioning & Release

- Every PR **must include a changeset** — CI will fail without one:

  ```bash
  pnpm change   # interactive prompt to create a changeset
  ```

- Merging to `master` automatically bumps the version, creates a git tag, and publishes a GitHub release with Firefox and Chrome `.zip` artifacts
