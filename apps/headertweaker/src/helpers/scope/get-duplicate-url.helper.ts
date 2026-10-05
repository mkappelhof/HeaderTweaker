import { normalizeUrlRestriction } from './normalize-url-restriction.helper';

export const getDuplicateUrlIndexes = (urls: string[]) => {
  const seen = new Set<string>();

  return urls.reduce<number[]>((duplicates, url, index) => {
    const normalized = normalizeUrlRestriction(url);
    if (!normalized) return duplicates;

    if (seen.has(normalized)) {
      duplicates.push(index);
      return duplicates;
    }

    seen.add(normalized);
    return duplicates;
  }, []);
};
