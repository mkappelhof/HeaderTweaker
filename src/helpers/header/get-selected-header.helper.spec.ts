import type { Header } from '@interfaces/index';
import { describe, expect, it, vi } from 'vitest';
import { getSelectedHeader } from './get-selected-header.helper';

const { storageLocal } = vi.hoisted(() => ({
  storageLocal: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

vi.mock('@constants/index', () => ({ storage: { local: storageLocal } }));

const header = (overrides: Partial<Header> = {}): Header => ({
  id: 'header-id',
  name: 'X-Example',
  value: 'value',
  enabled: false,
  ...overrides,
});

describe('getSelectedHeader', () => {
  it('returns the selected header and its position', async () => {
    const headers = [header({ id: 'first-id' }), header({ id: 'second-id' })];
    storageLocal.get.mockResolvedValue({ headers });

    await expect(getSelectedHeader(header({ id: 'second-id' }))).resolves.toEqual({
      headers,
      pos: 1,
      selectedHeader: headers[1],
    });
  });

  it('returns no selected header when the ID is not stored', async () => {
    const headers = [header()];
    storageLocal.get.mockResolvedValue({ headers });

    await expect(getSelectedHeader(header({ id: 'missing-id' }))).resolves.toEqual({
      headers,
      pos: -1,
      selectedHeader: undefined,
    });
  });
});
