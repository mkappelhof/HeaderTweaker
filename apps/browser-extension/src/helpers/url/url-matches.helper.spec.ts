import { describe, expect, it } from 'vitest';
import { urlMatches } from './url-matches.helper';

describe('urlMatches', () => {
  it('matches wildcard URL patterns while treating regex characters literally', () => {
    expect(urlMatches('https://example.com/api/v1', ['https://example.com/*'])).toBe(true);
    expect(urlMatches('https://exampleXcom', ['https://example.com'])).toBe(false);
    expect(urlMatches('https://example.com', ['https://other.example/*'])).toBe(false);
  });
});
