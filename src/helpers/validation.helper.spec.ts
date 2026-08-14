import { describe, expect, it } from 'vitest';
import { cleanupHeaderKey } from './validation.helper';

describe('cleanupHeaderKey', () => {
  it('returns an empty value when input is missing', () => {
    expect(cleanupHeaderKey(undefined)).toBe('');
  });

  it('trims input and replaces each whitespace sequence with a dash', () => {
    expect(cleanupHeaderKey('  X  Custom\tHeader  ')).toBe('X-Custom-Header');
  });
});
