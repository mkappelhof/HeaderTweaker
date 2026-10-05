import { describe, expect, it } from 'vitest';
import { escapeRegularExpression } from './escape-regex.helper';

describe('escapeRegularExpression', () => {
  it('escapes regular expression metacharacters', () => {
    const escaped = escapeRegularExpression('a.b+c?d[e]');

    expect(escaped).toBe('a\\.b\\+c\\?d\\[e\\]');
    expect(new RegExp(`^${escaped}$`).test('a.b+c?d[e]')).toBe(true);
    expect(new RegExp(`^${escaped}$`).test('axb+c?d[e]')).toBe(false);
  });

  it('leaves ordinary text unchanged', () => {
    expect(escapeRegularExpression('example/path')).toBe('example/path');
  });
});
