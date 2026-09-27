import type { Header } from '@interfaces/index';
import { describe, expect, it, vi } from 'vitest';
import { importHeaders } from './import-headers.helper';
import { saveHeaders } from './save-headers.helper';

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

describe('importHeaders', () => {
  it('imports arrays, reorders headers, and ignores malformed imports', async () => {
    const headers = [header()];

    await importHeaders(headers);
    await saveHeaders(headers);
    await importHeaders({} as Header[]);

    expect(storageLocal.set).toHaveBeenCalledTimes(2);
    expect(storageLocal.set).toHaveBeenNthCalledWith(1, { headers });
    expect(storageLocal.set).toHaveBeenNthCalledWith(2, { headers });
  });
});
