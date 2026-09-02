import { SCOPES } from '@constants/scopes';
import type { Header } from '@interfaces/index';
import { describe, expect, it } from 'vitest';
import { filterHeadersByScope } from './filter-headers-by-scope.helper';

const header = (urls?: string[]): Header => ({
  id: 'header-id',
  name: 'X-Example',
  value: 'value',
  enabled: true,
  urls,
});

describe('filterHeadersByScope', () => {
  const unscoped = { ...header(), id: 'unscoped' };
  const scoped = { ...header(['https://example.com/*']), id: 'scoped' };
  const other = { ...header(['https://other.com/*']), id: 'other' };
  const headers = [unscoped, scoped, other];

  it('returns every header for the "all" scope', () => {
    expect(filterHeadersByScope(headers, SCOPES.ALL)).toEqual(headers);
  });

  it('returns only unscoped headers for the "no scope" filter', () => {
    expect(filterHeadersByScope(headers, SCOPES.NO_SCOPE)).toEqual([unscoped]);
  });

  it('returns only headers matching the current URL', () => {
    expect(filterHeadersByScope(headers, SCOPES.CURRENT_URL, 'https://example.com/page')).toEqual([
      scoped,
    ]);
  });

  it('returns nothing for the current URL scope without a URL', () => {
    expect(filterHeadersByScope(headers, SCOPES.CURRENT_URL)).toEqual([]);
  });
});
