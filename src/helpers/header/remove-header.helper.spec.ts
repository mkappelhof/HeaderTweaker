import type { Header } from '@interfaces/index';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { storageLocal, uuid } = vi.hoisted(() => ({
  storageLocal: {
    get: vi.fn(),
    set: vi.fn(),
  },
  uuid: vi.fn(),
}));

vi.mock('@constants/index', () => ({
  storage: { local: storageLocal },
}));

vi.mock('uuid', () => ({ v4: uuid }));

import { removeHeader } from './remove-header.helper';
import { updateHeader } from './update-headers.helper';

const header = (overrides: Partial<Header> = {}): Header => ({
  id: 'header-id',
  name: 'X-Example',
  value: 'value',
  enabled: false,
  ...overrides,
});

describe('removeHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    uuid.mockReturnValue('generated-id');
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
});
