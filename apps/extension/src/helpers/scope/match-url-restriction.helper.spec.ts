import { describe, expect, it, vi } from 'vitest';
import { matchUrlRestriction } from './match-url-restriction.helper';

vi.mock('@constants/index', () => ({
  storage: { local: { get: vi.fn(), set: vi.fn() } },
  tabs: { query: vi.fn() },
}));

describe('matchUrlRestriction', () => {
  it('matches a registrable domain and its subdomains', () => {
    expect(matchUrlRestriction('https://example.com/path', 'example.com/path')).toBe(true);
    expect(matchUrlRestriction('https://test.example.com/path/123', 'example.com/path')).toBe(true);
  });

  it('matches a literal path and its descendants, but not adjacent paths', () => {
    expect(matchUrlRestriction('https://example.com/path/details', 'example.com/path')).toBe(true);
    expect(matchUrlRestriction('https://example.com/path-specified', 'example.com/path')).toBe(
      false
    );
  });

  it('matches an explicit subdomain only', () => {
    expect(matchUrlRestriction('https://test.example.com/path', 'test.example.com/path')).toBe(
      true
    );
    expect(matchUrlRestriction('https://preview.example.com/path', 'test.example.com/path')).toBe(
      false
    );
  });

  it('supports single-segment and multi-segment wildcards', () => {
    expect(matchUrlRestriction('https://example.com/path-specified', 'example.com/path*')).toBe(
      true
    );
    expect(matchUrlRestriction('https://example.com/path/details', 'example.com/path*')).toBe(
      false
    );
    expect(matchUrlRestriction('https://example.com/path/details', 'example.com/path/**')).toBe(
      true
    );
  });
});
