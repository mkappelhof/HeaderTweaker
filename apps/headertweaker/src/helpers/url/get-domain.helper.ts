import { getDomain as getRegistrableDomain } from 'tldts';

export const getDomain = (url?: string) => {
  if (!url) return undefined;

  try {
    const { hostname } = new URL(url);
    return getRegistrableDomain(hostname) ?? hostname;
  } catch {
    return undefined;
  }
};
