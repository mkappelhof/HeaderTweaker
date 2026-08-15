import { SCOPES } from '@constants/scopes';
import type { Header } from '@interfaces/index';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@constants/index', () => ({
  storage: { local: { get: vi.fn(), set: vi.fn() } },
  tabs: { query: vi.fn() },
}));

import {
  filterHeadersByScope,
  getScopeErrorMessage,
  isDuplicateUrl,
  isScoped,
  normalizeUrlRestriction,
} from './scope.helper';

const header = (urls?: string[]): Header => ({
  id: 'header-id',
  name: 'X-Example',
  value: 'value',
  enabled: true,
  urls,
});

describe('normalizeUrlRestriction', () => {
  it('returns an empty value for whitespace-only input', () => {
    expect(normalizeUrlRestriction('  ')).toBe('');
  });

  it('normalizes HTTP(S), the hostname, and the www prefix while preserving paths', () => {
    expect(normalizeUrlRestriction(' HTTPS://WWW.Example.COM/path?query=value ')).toBe(
      'example.com/path'
    );
    expect(normalizeUrlRestriction('http://example.com/Path')).toBe('example.com/Path');
    expect(normalizeUrlRestriction('example.com/nested/path')).toBe('example.com/nested/path');
  });

  it('uses the URL-like hostname when the input cannot be parsed', () => {
    expect(normalizeUrlRestriction('www. example.com/path?query=value')).toBe('example.com/path');
  });
});

describe('isDuplicateUrl', () => {
  it('returns false for null headers, missing URLs, and the only matching entry', () => {
    expect(isDuplicateUrl(null, 0)).toBe(false);
    expect(isDuplicateUrl(header(), 0)).toBe(false);
    expect(isDuplicateUrl(header(['example.com']), 0)).toBe(false);
  });

  it('finds duplicate scopes with different HTTP(S) protocols and www prefixes', () => {
    expect(
      isDuplicateUrl(header(['https://www.example.com/api', 'http://example.com/api']), 1)
    ).toBe(true);
  });

  it('treats paths on the same hostname as distinct scopes', () => {
    expect(isDuplicateUrl(header(['example.com/pathA', 'example.com/pathB']), 1)).toBe(false);
  });

  it('does not treat distinct normalized hostnames as duplicates', () => {
    expect(isDuplicateUrl(header(['example.com', 'api.example.com']), 1)).toBe(false);
  });
});

describe('isScoped', () => {
  it('is only true when the header has at least one URL', () => {
    expect(isScoped(header())).toBe(false);
    expect(isScoped(header([]))).toBe(false);
    expect(isScoped(header(['example.com']))).toBe(true);
  });
});

describe('filterHeadersByScope', () => {
  const unscoped = { ...header(), id: 'unscoped' };
  const scoped = { ...header(['https://example.com/*']), id: 'scoped' };
  const other = { ...header(['https://other.com/*']), id: 'other' };
  const headers = [unscoped, scoped, other];

  it('returns every header for the "all" scope', () => {
    expect(filterHeadersByScope(headers, SCOPES.ALL)).toEqual(headers);
  });

  it('returns only headers with or without URLs', () => {
    expect(filterHeadersByScope(headers, SCOPES.SCOPED)).toEqual([scoped, other]);
    expect(filterHeadersByScope(headers, SCOPES.NO_SCOPE)).toEqual([unscoped]);
  });

  it('returns only headers matching the current URL', () => {
    expect(filterHeadersByScope(headers, SCOPES.CURRENT_URL, 'https://example.com/page')).toEqual([
      scoped,
    ]);
  });

  it('returns nothing for the current URL scope without a URL', () => {
    expect(filterHeadersByScope(headers, SCOPES.CURRENT_URL)).toEqual([]);
  });
});

describe('getScopeErrorMessage', () => {
  it('returns a distinct message for every scope', () => {
    const messages = Object.values(SCOPES).map(getScopeErrorMessage);

    expect(new Set(messages).size).toBe(messages.length);
    expect(messages.every(Boolean)).toBe(true);
  });

  it('explains why the selected scope is empty', () => {
    expect(getScopeErrorMessage(SCOPES.ALL)).toBe('No headers match the selected filter');
    expect(getScopeErrorMessage(SCOPES.SCOPED)).toBe('None of the headers are limited to a URL');
    expect(getScopeErrorMessage(SCOPES.NO_SCOPE)).toBe(
      'Every header is limited to a URL, so none apply everywhere'
    );
    expect(getScopeErrorMessage(SCOPES.CURRENT_URL)).toBe(
      'None of the headers apply to the current URL'
    );
  });
});
