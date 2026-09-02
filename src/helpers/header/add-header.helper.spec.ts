import type { Header } from '@interfaces/index';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addHeader } from './add-header.helper';

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

describe('addHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    uuid.mockReturnValue('generated-id');
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
});
