import type { Header } from '@interfaces/index';

export type HeaderGroup = {
  urls: string[];
  headers: Header[];
};

/**
 * Group headers in the header list by scope url
 * - headers that have the same url scope are grouped together
 * - headers with combined scope-group are shown first
 * - headers with a single scope shown after
 * - unscoped headers shown last
 */
export const groupHeaders = (headers: ReadonlyArray<Header>): HeaderGroup[] => {
  const groups = new Map<string, HeaderGroup>();
  const globalHeaders: Header[] = [];

  for (const header of headers) {
    const urls = header.urls ?? [];
    if (!urls.length) {
      globalHeaders.push(header);
      continue;
    }

    // Group headers with the same scope (set)
    const sortedUrls = [...urls].sort((a, b) => a.localeCompare(b));
    const key = sortedUrls.join('\u0000');

    const group = groups.get(key);
    if (group) {
      group.headers.push(header);
    } else {
      groups.set(key, { urls: sortedUrls, headers: [header] });
    }
  }

  // Place combined scope groups first, both sorted alphabetically.
  const sortedGroups = Array.from(groups.values()).sort((a, b) => {
    if (a.urls.length > 1 !== b.urls.length > 1) {
      return a.urls.length > 1 ? -1 : 1;
    }
    return a.urls.join(', ').localeCompare(b.urls.join(', '));
  });

  // Place unscoped headers last and group as "Global"
  return globalHeaders.length
    ? [...sortedGroups, { urls: [], headers: globalHeaders }]
    : sortedGroups;
};
