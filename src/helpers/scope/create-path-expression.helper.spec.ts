import { describe, expect, it } from 'vitest';
import { createPathExpression } from './create-path-expression.helper';

describe('createPathExpression', () => {
  it('matches a single-segment wildcard without crossing a slash', () => {
    const expression = new RegExp(`^${createPathExpression('/api/*')}$`);

    expect(expression.test('/api/users')).toBe(true);
    expect(expression.test('/api/users/details')).toBe(false);
  });

  it('matches multi-segment wildcards and their descendants', () => {
    const expression = new RegExp(`^${createPathExpression('/api/**')}$`);

    expect(expression.test('/api/users/details')).toBe(true);
    expect(expression.test('/api')).toBe(true);
  });

  it('escapes literal path characters', () => {
    expect(createPathExpression('/api/v1.0')).toBe('/api/v1\\.0');
  });
});
