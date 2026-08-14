import type { Header } from '@interfaces/index';

export const normalizeUrlRestriction = (url: string) => {
  const value = url.trim();
  if (!value) return '';

  const urlWithProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    const parsedUrl = new URL(urlWithProtocol);
    return `${parsedUrl.host.replace(/^www\./i, '')}${parsedUrl.pathname}`;
  } catch {
    return value
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .trim()
      .split(/[?#]/)[0];
  }
};

export const isDuplicateUrl = (header: Header | null, index: number) => {
  const url = normalizeUrlRestriction(header?.urls?.[index] ?? '');
  return Boolean(
    url &&
      header?.urls?.some((value, valueIndex) => {
        return valueIndex !== index && normalizeUrlRestriction(value) === url;
      })
  );
};
