import type { Header } from '@interfaces/index';
import { describe, expect, it, vi } from 'vitest';
import { groupHeaders } from './group-headers.helper';

vi.mock('@constants/index', () => ({
  storage: { local: { get: vi.fn(), set: vi.fn() } },
  tabs: { query: vi.fn() },
}));

const header = (urls?: string[]): Header => ({
  id: 'header-id',
  name: 'X-Example',
  value: 'value',
  enabled: true,
  urls,
});

describe('groupHeaders', () => {
  it('groups headers by their exact combined set of urls', () => {
    const a = { ...header(['example.com/a']), id: 'a' };
    const b = { ...header(['example.com/b']), id: 'b' };
    const c = { ...header(['example.com/a']), id: 'c' };

    expect(groupHeaders([a, b, c])).toEqual([
      { urls: ['example.com/a'], headers: [a, c] },
      { urls: ['example.com/b'], headers: [b] },
    ]);
  });

  it('groups a header with multiple urls into a single combined group', () => {
    const multi = { ...header(['example.com/a', 'example.com/b']), id: 'multi' };

    expect(groupHeaders([multi])).toEqual([
      { urls: ['example.com/a', 'example.com/b'], headers: [multi] },
    ]);
  });

  it('groups headers that share the same urls regardless of their order', () => {
    const one = { ...header(['example.com', 'example.net']), id: 'one' };
    const two = { ...header(['example.net', 'example.com']), id: 'two' };

    expect(groupHeaders([one, two])).toEqual([
      { urls: ['example.com', 'example.net'], headers: [one, two] },
    ]);
  });

  it('sorts groups alphabetically by their combined urls', () => {
    const b = { ...header(['example.com/b']), id: 'b' };
    const a = { ...header(['example.com/a']), id: 'a' };

    expect(groupHeaders([b, a]).map((group) => group.urls.join(', '))).toEqual([
      'example.com/a',
      'example.com/b',
    ]);
  });

  it('lists groups scoped to multiple urls before single-url groups', () => {
    const single = { ...header(['z.com']), id: 'single' };
    const joined = { ...header(['a.com', 'b.com']), id: 'joined' };

    expect(groupHeaders([single, joined]).map((group) => group.urls)).toEqual([
      ['a.com', 'b.com'],
      ['z.com'],
    ]);
  });

  it('treats different paths on the same host as distinct groups', () => {
    const a = { ...header(['example.com/pathA']), id: 'a' };
    const b = { ...header(['example.com/pathB']), id: 'b' };

    expect(groupHeaders([a, b])).toHaveLength(2);
  });

  it('groups unscoped headers under a single "Global" group placed last', () => {
    const global1 = { ...header(), id: 'global1' };
    const global2 = { ...header([]), id: 'global2' };
    const scoped = { ...header(['example.com/a']), id: 'scoped' };

    expect(groupHeaders([global1, scoped, global2])).toEqual([
      { urls: ['example.com/a'], headers: [scoped] },
      { urls: [], headers: [global1, global2] },
    ]);
  });

  it('returns no groups for an empty list of headers', () => {
    expect(groupHeaders([])).toEqual([]);
  });
});
