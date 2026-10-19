import { describe, expect, it } from 'vitest';
import { getDuplicateUrlIndexes } from './get-duplicate-url.helper';

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
