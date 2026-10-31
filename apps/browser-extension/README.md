# HeaderTweaker

## Development

Requirements: Node.js 20+ and pnpm 10+.

```bash
pnpm install
pnpm build:firefox
pnpm build:chrome
# or build both
pnpm build:all
```

The builds are written to `dist/firefox/` and `dist/chrome/`. To run a development build in a browser:

```bash
pnpm dev:firefox
pnpm dev:chrome
```

Useful checks:

```bash
pnpm check-types
pnpm lint
pnpm test
```
