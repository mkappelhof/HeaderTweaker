import { SCOPES, type Scope } from '@constants/scopes';
import { matchesUrl } from '@helpers/header.helper';
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

export const isScoped = (header: Header) => Boolean(header.urls?.length);

export const filterHeadersByScope = (headers: Header[], scope: Scope, currentUrl?: string) => {
  switch (scope) {
    case SCOPES.SCOPED:
      return headers.filter(isScoped);
    case SCOPES.NO_SCOPE:
      return headers.filter((header) => !isScoped(header));
    case SCOPES.CURRENT_URL:
      return currentUrl
        ? headers.filter((header) => isScoped(header) && matchesUrl(currentUrl, header.urls ?? []))
        : [];
    default:
      return headers;
  }
};

export type HeaderGroup = {
  url: string;
  headers: Header[];
};

export const groupHeadersByUrl = (headers: Header[]): HeaderGroup[] => {
  const groups = new Map<string, Header[]>();

  for (const header of headers) {
    for (const url of header.urls ?? []) {
      const group = groups.get(url);
      if (group) {
        group.push(header);
      } else {
        groups.set(url, [header]);
      }
    }
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([url, groupedHeaders]) => ({ url, headers: groupedHeaders }));
};

export const getScopeErrorMessage = (scope: Scope) => {
  switch (scope) {
    case SCOPES.SCOPED:
      return 'None of the headers are limited to a URL';
    case SCOPES.NO_SCOPE:
      return 'Every header is limited to a URL, so none apply everywhere';
    case SCOPES.CURRENT_URL:
      return 'None of the headers apply to the current URL';
    default:
      return 'No headers match the selected filter';
  }
};
