import { createHostnameExpression } from '@helpers/scope/create-host-expression.helper';
import { createPathExpression } from '@helpers/scope/create-path-expression.helper';
import { escapeRegularExpression } from '@helpers/scope/escape-regex.helper';
import { parseUrlRestriction } from './parse-url-restriction.helper';

export const createChromeUrlRestriction = (restrictionValue: string) => {
  const restriction = parseUrlRestriction(restrictionValue);
  if (!restriction) return null;

  const hostnameExpression = restriction.hostname.includes('*')
    ? createHostnameExpression(restriction.hostname)
    : restriction.isExplicitSubdomain
      ? escapeRegularExpression(restriction.hostname)
      : `(?:[a-z0-9-]+\\.)*${escapeRegularExpression(restriction.hostname)}`;

  const pathnameExpression =
    !restriction.pathname || restriction.pathname === '/'
      ? '/.*'
      : restriction.pathname.includes('*')
        ? createPathExpression(restriction.pathname)
        : `${escapeRegularExpression(restriction.pathname)}(?:/.*)?`;

  return `^https?://${hostnameExpression}(?::\\d+)?${pathnameExpression}(?:[?#].*)?$`;
};
