import { SCOPES } from '@constants/scopes';
import type { Header } from '@interfaces/index';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@constants/index', () => ({
  storage: { local: { get: vi.fn(), set: vi.fn() } },
  tabs: { query: vi.fn() },
}));

import {
  filterHeadersByScope,
  getDuplicateUrlIndexes,
  getKnownUrls,
  getScopeErrorMessageKey,
  groupHeadersByUrl,
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

describe('getDuplicateUrlIndexes', () => {
  it('ignores empty entries and reports every repeated normalized URL', () => {
    expect(
      getDuplicateUrlIndexes(['example.com', '  ', 'https://www.example.com', 'other.com'])
    ).toEqual([2]);
  });

  it('returns an empty list when all URLs are unique', () => {
    expect(getDuplicateUrlIndexes(['example.com', 'api.example.com'])).toEqual([]);
  });
});

describe('getKnownUrls', () => {
  it('collects unique URLs from all headers in alphabetical order', () => {
    expect(
      getKnownUrls([header(['https://www.example.com', 'b.com']), header(['example.com'])])
    ).toEqual(['b.com', 'https://www.example.com']);
  });

  it('returns an empty list when no header is scoped', () => {
    expect(getKnownUrls([header(), header([])])).toEqual([]);
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

describe('groupHeadersByUrl', () => {
  it('groups headers by each exact scoped url', () => {
    const a = { ...header(['example.com/a']), id: 'a' };
    const b = { ...header(['example.com/b']), id: 'b' };
    const c = { ...header(['example.com/a']), id: 'c' };

    expect(groupHeadersByUrl([a, b, c])).toEqual([
      { url: 'example.com/a', headers: [a, c] },
      { url: 'example.com/b', headers: [b] },
    ]);
  });

  it('lists a header under every url it is scoped to', () => {
    const multi = { ...header(['example.com/a', 'example.com/b']), id: 'multi' };

    expect(groupHeadersByUrl([multi])).toEqual([
      { url: 'example.com/a', headers: [multi] },
      { url: 'example.com/b', headers: [multi] },
    ]);
  });

  it('sorts groups alphabetically by url', () => {
    const b = { ...header(['example.com/b']), id: 'b' };
    const a = { ...header(['example.com/a']), id: 'a' };

    expect(groupHeadersByUrl([b, a]).map((group) => group.url)).toEqual([
      'example.com/a',
      'example.com/b',
    ]);
  });

  it('treats different paths on the same host as distinct groups', () => {
    const a = { ...header(['example.com/pathA']), id: 'a' };
    const b = { ...header(['example.com/pathB']), id: 'b' };

    expect(groupHeadersByUrl([a, b])).toHaveLength(2);
  });

  it('returns no groups for unscoped headers', () => {
    expect(groupHeadersByUrl([header()])).toEqual([]);
  });
});

describe('getScopeErrorMessageKey', () => {
  it('returns a distinct key for every scope', () => {
    const keys = Object.values(SCOPES).map(getScopeErrorMessageKey);

    expect(new Set(keys).size).toBe(keys.length);
    expect(keys.every(Boolean)).toBe(true);
  });

  it('points at the message explaining why the selected scope is empty', () => {
    expect(getScopeErrorMessageKey(SCOPES.ALL)).toBe('scopes.emptyAll');
    expect(getScopeErrorMessageKey(SCOPES.SCOPED)).toBe('scopes.emptyScoped');
    expect(getScopeErrorMessageKey(SCOPES.NO_SCOPE)).toBe('scopes.emptyNoScope');
    expect(getScopeErrorMessageKey(SCOPES.CURRENT_URL)).toBe('scopes.emptyCurrentUrl');
  });
});
