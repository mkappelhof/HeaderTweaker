import type { Header } from '@interfaces/index';
import { describe, expect, it } from 'vitest';
import { countAppliedHeaders } from './count-applied-headers.helper';

const header = (overrides: Partial<Header> = {}): Header => ({
  id: 'header-id',
  name: 'X-Example',
  value: 'value',
  enabled: true,
  ...overrides,
});

describe('countAppliedHeaders', () => {
  it('counts enabled unscoped headers as applied to any URL', () => {
    const headers = [header(), header({ id: 'second' })];

    expect(countAppliedHeaders(headers, 'https://example.com/page')).toBe(2);
  });

  it('ignores disabled headers', () => {
    const headers = [header({ enabled: false }), header({ id: 'enabled' })];

    expect(countAppliedHeaders(headers, 'https://example.com/page')).toBe(1);
  });

  it('counts scoped headers only when a URL matches', () => {
    const headers = [
      header({ id: 'match', urls: ['https://example.com/*'] }),
      header({ id: 'miss', urls: ['https://other.com/*'] }),
    ];

    expect(countAppliedHeaders(headers, 'https://example.com/page')).toBe(1);
  });

  it('does not count scoped headers when there is no current URL', () => {
    const headers = [header({ urls: ['https://example.com/*'] })];

    expect(countAppliedHeaders(headers)).toBe(0);
  });

  it('still counts unscoped headers when there is no current URL', () => {
    const headers = [header()];

    expect(countAppliedHeaders(headers)).toBe(1);
  });

  it('counts scoped headers regardless of their scope on localhost requests', () => {
    const headers = [header({ urls: ['https://other.com/*'] })];

    expect(countAppliedHeaders(headers, 'http://localhost:3000/page')).toBe(1);
  });
});
