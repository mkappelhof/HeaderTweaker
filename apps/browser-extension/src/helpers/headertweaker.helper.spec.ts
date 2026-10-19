import { beforeEach, describe, expect, it, vi } from 'vitest';

const { storageLocal } = vi.hoisted(() => ({
  storageLocal: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

vi.mock('@constants/index', () => ({
  storage: { local: storageLocal },
}));

import { getStatus, isDisabledGlobally, setStatus } from './headertweaker.helper';

describe('header tweaker status helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    ['enabled', false],
    ['disabled', true],
  ] as const)('stores the %s status', async (status, isDisabled) => {
    await expect(setStatus(status)).resolves.toBe(status);
    expect(storageLocal.set).toHaveBeenCalledWith({ isDisabled });
  });

  it('returns disabled when the stored value is truthy', async () => {
    storageLocal.get.mockResolvedValue({ isDisabled: true });

    await expect(getStatus()).resolves.toBe('disabled');
    await expect(isDisabledGlobally()).resolves.toBe(true);
  });

  it('defaults to enabled when the stored value is falsy', async () => {
    storageLocal.get.mockResolvedValue({ isDisabled: false });

    await expect(getStatus()).resolves.toBe('enabled');
    await expect(isDisabledGlobally()).resolves.toBe(false);
  });
});
