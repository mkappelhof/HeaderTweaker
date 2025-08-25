# HeaderTweaker - Easily modify outgoing HTTP headers

HeaderTweaker lets developers, testers and/or power‑users inject, modify, or remove headers to outgoing HTTP requests on the fly. Whether you need to test APIs that require special authentication tokens, run A/B tests, simulate different browsers or debug CORS issues, this lightweight extension gives you full control over the outgoing headers without touching server code.

## Key Features

- **Dynamic Header Injection** – Define any number of `key: value` pairs that will be appended to each outgoing request.
- **Per‑Domain Rules** – Scope headers to specific domains or URL patterns (wildcards supported).
- **Header Editing UI** – Simple popup UI for adding, editing, disabling, or deleting rules on the fly.
- **Export / Import** – Save your configuration as JSON and import it on another machine or share with teammates.
- **Toggle On‑Demand** – Enable or disable the extension globally or per‑tab with a single click.
- **Zero‑Impact on Page Content** – Operates purely in the background via the webRequest API; no DOM injection or page reload required.

## Typical use cases

| Scenario | What HeaderTweaker can do |
| - | - |
| API testing |  Add `Authorization: Bearer <token>` to all calls without hard‑coding it in your client. |
| Feature flagging | Send `X-Feature-Flag: new-ui` to toggle experimental UI paths on the server side. |
|CORS debugging | Append `Origin: <http://localhost:3000>` to see how the server reacts to different origins. |
| Localization | Force `Accept-Language: nl-NL` to preview translated content. |
| Security research | Inject custom security headers (e.g., `X-Content-Type-Options`) to evaluate client‑side handling. |

## Installation

End users can install the extension from the Firefox and Chrome extension stores

### Local setup

1. Clone the repository with `git clone https://github.com/mkappelhof/HeaderTweaker.git`
2. Load the unpacked extension in Chrome/Edge/Brave or Firefox:

   **Firefox:** `about:debugging → This Firefox → Load Temporary Add‑on → select manifest.json`

   **Chrome based browsers:** `chrome://extensions → Enable Developer mode → Load unpacked → select the folder`

## Permissions

- `webRequest`, `webRequestBlocking` – to intercept and modify outgoing requests.
- `storage` – to persist user‑defined header rules.
- `activeTab` – for per‑tab toggling.

> **Note:** All modifications happen locally in the browser; no data is transmitted to external servers.
