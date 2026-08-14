import type { Header } from '@interfaces/index';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { storageLocal, tabsQuery, uuid } = vi.hoisted(() => ({
  storageLocal: {
    get: vi.fn(),
    set: vi.fn(),
  },
  tabsQuery: vi.fn(),
  uuid: vi.fn(),
}));

vi.mock('@constants/index', () => ({
  storage: { local: storageLocal },
  tabs: { query: tabsQuery },
}));

vi.mock('uuid', () => ({ v4: uuid }));

import {
  activateHeader,
  addHeader,
  exportHeaders,
  getCurrentTabUrl,
  getHeaders,
  importHeaders,
  matchesUrl,
  removeHeader,
  reorderHeaders,
  updateHeader,
} from './header.helper';

const header = (overrides: Partial<Header> = {}): Header => ({
  id: 'header-id',
  name: 'X-Example',
  value: 'value',
  enabled: false,
  ...overrides,
});

describe('header helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    uuid.mockReturnValue('generated-id');
  });

  it('returns stored headers unchanged when they all have IDs', async () => {
    const headers = [header()];
    storageLocal.get.mockResolvedValue({ headers });

    await expect(getHeaders()).resolves.toEqual(headers);
    expect(storageLocal.set).not.toHaveBeenCalled();
  });

  it('assigns IDs to legacy headers and persists the migration', async () => {
    const legacyHeader = { ...header(), id: '' };
    storageLocal.get.mockResolvedValue({ headers: [legacyHeader] });

    await expect(getHeaders()).resolves.toEqual([header({ id: 'generated-id' })]);
    expect(storageLocal.set).toHaveBeenCalledWith({ headers: [header({ id: 'generated-id' })] });
  });

  it('adds an enabled header with a generated ID', async () => {
    storageLocal.get.mockResolvedValue({ headers: [header()] });

    await expect(addHeader(header({ id: 'ignored', enabled: false }))).resolves.toEqual(
      header({ id: 'generated-id', enabled: true })
    );
    expect(storageLocal.set).toHaveBeenCalledWith({
      headers: [header(), header({ id: 'generated-id', enabled: true })],
    });
  });

  it('updates and removes the selected header', async () => {
    const original = header();
    const replacement = header({ value: 'updated' });
    storageLocal.get.mockResolvedValue({ headers: [original] });

    await expect(updateHeader(replacement)).resolves.toEqual(replacement);
    expect(storageLocal.set).toHaveBeenLastCalledWith({ headers: [replacement] });

    storageLocal.get.mockResolvedValue({ headers: [replacement] });
    await removeHeader(replacement);
    expect(storageLocal.set).toHaveBeenLastCalledWith({ headers: [] });
  });

  it('updates activation only when the header exists', async () => {
    const storedHeader = header({ enabled: false });
    storageLocal.get.mockResolvedValue({ headers: [storedHeader] });

    await expect(activateHeader(storedHeader, true)).resolves.toEqual(header({ enabled: true }));
    expect(storageLocal.set).toHaveBeenCalledWith({ headers: [header({ enabled: true })] });

    storageLocal.get.mockResolvedValue({ headers: [] });
    await expect(activateHeader(storedHeader, true)).resolves.toBeUndefined();
    expect(storageLocal.set).toHaveBeenCalledTimes(1);
  });

  it('exports headers as a downloaded JSON file', async () => {
    storageLocal.get.mockResolvedValue({ headers: [header()] });
    const createObjectURL = vi.fn(() => 'blob:test');
    const revokeObjectURL = vi.fn();
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });

    await exportHeaders();

    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(click).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:test');
    click.mockRestore();
  });

  it('imports arrays, reorders headers, and ignores malformed imports', async () => {
    const headers = [header()];

    await importHeaders(headers);
    await reorderHeaders(headers);
    await importHeaders({} as Header[]);

    expect(storageLocal.set).toHaveBeenCalledTimes(2);
    expect(storageLocal.set).toHaveBeenNthCalledWith(1, { headers });
    expect(storageLocal.set).toHaveBeenNthCalledWith(2, { headers });
  });

  it('gets the active tab URL when it is available', async () => {
    tabsQuery.mockResolvedValue([{ url: 'https://example.com' }]);
    await expect(getCurrentTabUrl()).resolves.toBe('https://example.com');

    tabsQuery.mockResolvedValue([]);
    await expect(getCurrentTabUrl()).resolves.toBeUndefined();
  });

  it('matches wildcard URL patterns while treating regex characters literally', () => {
    expect(matchesUrl('https://example.com/api/v1', ['https://example.com/*'])).toBe(true);
    expect(matchesUrl('https://exampleXcom', ['https://example.com'])).toBe(false);
    expect(matchesUrl('https://example.com', ['https://other.example/*'])).toBe(false);
  });
});
