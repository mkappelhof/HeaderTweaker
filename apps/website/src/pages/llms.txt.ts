import { EXTENSION_META } from '@data/extension-meta';
import { FEATURES } from '@data/features';
import { PERMISSIONS } from '@data/permissions';
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const homeUrl = new URL('/', site).toString();

  const featureLines = FEATURES.map((feature) => `- ${feature.title} ${feature.description}`).join(
    '\n'
  );

  const permissionLines = PERMISSIONS.map(
    (permission) => `- ${permission.name} (${permission.where}): ${permission.why}`
  ).join('\n');

  const body = `# ${EXTENSION_META.name}

> ${EXTENSION_META.description}

${EXTENSION_META.name} is a free, open-source (MIT licensed) browser extension for Firefox and
Chrome that adds, changes and removes outgoing HTTP request headers, either globally or scoped
to specific URLs. It collects no data, has no tracking or telemetry, and runs no remote code —
only what ships in the installed package executes. Current version: ${EXTENSION_META.version}.

## Features

${featureLines}

## How it works

1. Add a header: enter a key and a value, and optionally a label.
2. Pick where it applies: leave it global, or target it to the current URL or any URL you add.
3. Browse as usual: matching requests leave the browser with the headers applied. Toggle a rule
   off whenever you're done.

Firefox uses the webRequest API to modify outgoing requests before they're sent. Chrome uses the
declarativeNetRequestWithHostAccess API, so the browser applies the rules itself and the
extension never reads or intercepts request contents.

## Permissions requested

${permissionLines}

## Links

- Website: ${homeUrl}
- Source code: ${EXTENSION_META.repositoryUrl}
- Firefox Add-ons: ${EXTENSION_META.firefoxUrl}
- Chrome Web Store: ${EXTENSION_META.chromeUrl}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
