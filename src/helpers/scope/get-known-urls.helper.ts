import type { Header } from '@interfaces/index';
import { normalizeUrlRestriction } from './normalize-url-restriction.helper';

export const getKnownUrls = (headers: ReadonlyArray<Header>) => {
  const seen = new Set<string>();

  return headers
    .flatMap((header) => header.urls ?? [])
    .filter((url) => {
      const normalized = normalizeUrlRestriction(url);
      if (!normalized || seen.has(normalized)) return false;

      seen.add(normalized);
      return true;
    })
    .map((url) => url.trim())
    .sort((a, b) => a.localeCompare(b));
};
