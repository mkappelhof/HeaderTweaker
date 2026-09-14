import type { Header } from '@interfaces/index';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getHeaders } from './get-headers.helper';

const { storageLocal, uuid } = vi.hoisted(() => ({
  storageLocal: {
    get: vi.fn(),
    set: vi.fn(),
  },
  uuid: vi.fn(),
}));

vi.mock('@constants/index', () => ({ storage: { local: storageLocal } }));

vi.mock('uuid', () => ({ v4: uuid }));

const header = (overrides: Partial<Header> = {}): Header => ({
  id: 'header-id',
  name: 'X-Example',
  value: 'value',
  enabled: false,
  ...overrides,
});

describe('getHeaders', () => {
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
});
