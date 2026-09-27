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

## Permissions & Privacy

HeaderTweaker requests the smallest possible set of browser permissions and collects no data whatsoever.

### Firefox

| Permission | Purpose |
| --- | --- |
| `storage` | Persist header rules and settings locally in the browser. |
| `webRequest` + `webRequestBlocking` | Modify outgoing request headers before they are sent (Firefox uses the `webRequest` API). |
| `<all_urls>` | Allow rules to target any site. Rules only run on requests matching the URL patterns defined in the extension. |

### Chrome

| Permission | Purpose |
| --- | --- |
| `storage` | Persist header rules and settings locally in the browser. |
| `declarativeNetRequestWithHostAccess` | Modify outgoing request headers via Chrome's `declarativeNetRequest` API, which changes requests **without** the extension reading their contents. |
| `<all_urls>` (host access) | Allow rules to target any site. `declarativeNetRequestWithHostAccess` only acts on hosts that have been granted access. |

On Chrome, HeaderTweaker deliberately uses `declarativeNetRequestWithHostAccess` instead of the broader `declarativeNetRequest` permission. The declarative approach lets the browser apply rules without the extension inspecting or intercepting request contents.

### Privacy commitments

- **No tracking, no telemetry, no analytics.** The extension contains no tracking scripts and makes no outbound calls.
- **No data collection or transmission.** Header rules never leave the device. All configuration is stored locally via the browser's `storage` API.
- **No remote code.** Only the code shipped in the package is executed.

Import and export are fully manual: configuration leaves the browser only when it is explicitly exported to a JSON file.

## License

MIT
