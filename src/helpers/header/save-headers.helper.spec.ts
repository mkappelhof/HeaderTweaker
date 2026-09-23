import type { Header } from '@interfaces/index';
import { describe, expect, it, vi } from 'vitest';
import { saveHeaders } from './save-headers.helper';

const { storageLocal } = vi.hoisted(() => ({
  storageLocal: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

vi.mock('@constants/index', () => ({ storage: { local: storageLocal } }));

const header: Header = {
  id: 'header-id',
  name: 'X-Example',
  value: 'value',
  enabled: true,
};

describe('saveHeaders', () => {
  it('saves the provided headers to local storage', async () => {
    storageLocal.set.mockResolvedValue(undefined);

    await expect(saveHeaders([header])).resolves.toBeUndefined();
    expect(storageLocal.set).toHaveBeenCalledWith({ headers: [header] });
  });
});
