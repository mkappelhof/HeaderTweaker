import type { Header } from '@interfaces/index';
import { describe, expect, it, vi } from 'vitest';
import { updateHeader } from './update-headers.helper';

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

describe('updateHeader', () => {
  it('replaces the matching header and persists the collection', async () => {
    const original = header();
    const updated = header({ value: 'updated', enabled: true });
    storageLocal.get.mockResolvedValue({ headers: [original] });

    await expect(updateHeader(updated)).resolves.toEqual(updated);
    expect(storageLocal.set).toHaveBeenCalledWith({ headers: [updated] });
  });
});
