import { describe, expect, it } from 'vitest';
import { parseUrlRestriction } from './parse-url-restriction.helper';

describe('parseUrlRestriction', () => {
  it('normalizes protocol, port, query, and fragment while preserving the path', () => {
    expect(parseUrlRestriction(' HTTPS://WWW.Example.COM:8443/api/items?sort=asc#top ')).toEqual({
      hostname: 'www.example.com',
      pathname: '/api/items',
      isExplicitSubdomain: true,
    });
  });

  it('detects an explicit subdomain', () => {
    expect(parseUrlRestriction('api.example.com')).toEqual({
      hostname: 'api.example.com',
      pathname: undefined,
      isExplicitSubdomain: true,
    });
  });

  it('returns null when no hostname is provided', () => {
    expect(parseUrlRestriction('https://')).toBeNull();
  });
});
