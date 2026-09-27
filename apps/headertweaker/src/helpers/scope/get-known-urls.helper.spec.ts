import type { Header } from '@interfaces/index';
import { describe, expect, it } from 'vitest';
import { getKnownUrls } from './get-known-urls.helper';

const header = (urls?: string[]): Header => ({
  id: 'header-id',
  name: 'X-Example',
  value: 'value',
  enabled: true,
  urls,
});

describe('getKnownUrls', () => {
  it('collects unique URLs from all headers in alphabetical order', () => {
    expect(
      getKnownUrls([header(['https://www.example.com', 'b.com']), header(['example.com'])])
    ).toEqual(['b.com', 'https://www.example.com']);
  });

  it('returns an empty list when no header is scoped', () => {
    expect(getKnownUrls([header(), header([])])).toEqual([]);
  });
});
