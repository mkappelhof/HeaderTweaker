import type { Header } from '@interfaces/index';
import { describe, expect, it } from 'vitest';
import { isDuplicateUrl, normalizeUrlRestriction } from './scope.helper';

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
