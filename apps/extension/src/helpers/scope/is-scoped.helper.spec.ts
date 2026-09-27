import type { Header } from '@interfaces/index';
import { describe, expect, it } from 'vitest';
import { isScoped } from './is-scoped.helper';

const header = (urls?: string[]): Header => ({
  id: 'header-id',
  name: 'X-Example',
  value: 'value',
  enabled: true,
  urls,
});

describe('isScoped', () => {
  it('is only true when the header has at least one URL', () => {
    expect(isScoped(header())).toBe(false);
    expect(isScoped(header([]))).toBe(false);
    expect(isScoped(header(['example.com']))).toBe(true);
  });
});
