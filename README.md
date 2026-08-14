# HeaderTweaker

HeaderTweaker is a browser extension for adding, changing, and removing HTTP request headers. Create header rules, enable or disable them, and optionally limit them to matching URL patterns.

[![Install from Firefox Add-ons](https://img.shields.io/badge/Firefox%20Add--ons-Install-ff7139?logo=firefox&logoColor=white)](https://addons.mozilla.org/firefox/addon/headertweaker/)
[![Install from the Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Install-4285f4?logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/headertweaker/jhcfgkcenmleehpcpimgmnabjdgmchod)

## Features

- Add, edit, enable, disable, and delete request-header rules.
- Match rules to URL patterns when needed.
- Import and export configuration as JSON.
- Enable or disable all header modifications from the settings panel.
- Firefox support through `webRequest` and Chrome support through `declarativeNetRequest`.

All configuration is stored locally in the browser.

## Development

Requirements: Node.js 20+ and pnpm 10+.

```bash
pnpm install
pnpm build:firefox
pnpm build:chrome
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

## License

MIT
