import type { Header } from '@interfaces/index';
import { describe, expect, it, vi } from 'vitest';
import { activateHeader } from './activate-header.helper';

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

describe('activateHeader', () => {
  it('updates activation only when the header exists', async () => {
    const storedHeader = header({ enabled: false });
    storageLocal.get.mockResolvedValue({ headers: [storedHeader] });

    await expect(activateHeader(storedHeader, true)).resolves.toEqual(header({ enabled: true }));
    expect(storageLocal.set).toHaveBeenCalledWith({ headers: [header({ enabled: true })] });

    storageLocal.get.mockResolvedValue({ headers: [] });
    await expect(activateHeader(storedHeader, true)).resolves.toBeUndefined();
    expect(storageLocal.set).toHaveBeenCalledTimes(1);
  });
});
