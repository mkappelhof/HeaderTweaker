import { describe, expect, it } from 'vitest';
import { createChromeUrlRestriction } from './chrome-url-restriction.helper';

describe('createChromeUrlRestriction', () => {
  it('creates a Chrome rule with the same matching behavior', () => {
    const regexFilter = createChromeUrlRestriction('example.com/path');

    expect(regexFilter).not.toBeNull();
    expect(new RegExp(regexFilter ?? '').test('https://test.example.com/path/123')).toBe(true);
    expect(new RegExp(regexFilter ?? '').test('https://example.com/path-specified')).toBe(false);
  });
});
