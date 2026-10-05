import { describe, expect, it } from 'vitest';
import { createHostnameExpression } from './create-host-expression.helper';

describe('createHostnameExpression', () => {
  it('creates a hostname expression that keeps single wildcards within one label', () => {
    const expression = new RegExp(`^${createHostnameExpression('*.example.com')}$`);

    expect(expression.test('www.example.com')).toBe(true);
    expect(expression.test('www.api.example.com')).toBe(false);
  });

  it('escapes literal hostname characters', () => {
    expect(createHostnameExpression('example.com')).toBe('example\\.com');
  });
});
