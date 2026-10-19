import { describe, expect, it, vi } from 'vitest';
import { getCurrentTabUrl } from './get-current-tab.helper';

const { tabsQuery } = vi.hoisted(() => ({ tabsQuery: vi.fn() }));

vi.mock('@constants/index', () => ({
  tabs: { query: tabsQuery },
}));

describe('getCurrentTabUrl', () => {
  it('gets the active tab URL when it is available', async () => {
    tabsQuery.mockResolvedValue([{ url: 'https://example.com' }]);
    await expect(getCurrentTabUrl()).resolves.toBe('https://example.com');

    tabsQuery.mockResolvedValue([]);
    await expect(getCurrentTabUrl()).resolves.toBeUndefined();
  });
});
