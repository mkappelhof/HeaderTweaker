import type { Header } from '@interfaces/index';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { getHeaders } = vi.hoisted(() => ({ getHeaders: vi.fn() }));

vi.mock('@helpers/header.helper', () => ({ getHeaders }));

import { validateHeaderImport } from './import.helper';

class MockFileReader {
  static instance: MockFileReader;

  error: DOMException | null = null;
  onerror: (() => void) | null = null;
  onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
  readAsText = vi.fn();

  constructor() {
    MockFileReader.instance = this;
  }
}

const header = (overrides: Partial<Header> = {}): Header => ({
  id: 'header-id',
  name: 'X-Example',
  value: 'value',
  enabled: true,
  ...overrides,
});

const files = (file?: File) =>
  (file
    ? { 0: file, length: 1, item: (index: number) => (index === 0 ? file : null) }
    : { length: 0, item: () => null }) as unknown as FileList;

const triggerLoad = (value: unknown) => {
  MockFileReader.instance.onload?.({ target: { result: value } } as ProgressEvent<FileReader>);
};

describe('validateHeaderImport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('FileReader', MockFileReader);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns valid, non-duplicate headers through the success callback', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    getHeaders.mockResolvedValue([header({ name: 'Existing' })]);

    validateHeaderImport(files(new File(['{}'], 'headers.json', { type: 'application/json' })), {
      onSuccess,
      onError,
    });
    triggerLoad(
      JSON.stringify({
        headers: [header(), header({ name: 'Existing' }), header({ id: '', name: 'Invalid' })],
      })
    );

    await vi.waitFor(() => expect(onSuccess).toHaveBeenCalledWith([header()]));
    expect(onError).not.toHaveBeenCalled();
  });

  it('reports missing and unsupported files without reading them', () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    validateHeaderImport(files(), { onSuccess, onError });
    validateHeaderImport(files(new File(['text'], 'headers.txt', { type: 'text/plain' })), {
      onSuccess,
      onError,
    });

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenNthCalledWith(1, new Error('No file selected.'));
    expect(onError).toHaveBeenNthCalledWith(2, new Error('Only JSON files can be imported.'));
  });

  it('reports malformed and invalid export data', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    getHeaders.mockResolvedValue([]);

    validateHeaderImport(files(new File(['{}'], 'headers.json', { type: 'application/json' })), {
      onSuccess,
      onError,
    });
    triggerLoad('{');

    await vi.waitFor(() => expect(onError).toHaveBeenCalledOnce());
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('reports file read failures', () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const error = new DOMException('File cannot be read.');

    validateHeaderImport(files(new File(['{}'], 'headers.json', { type: 'application/json' })), {
      onSuccess,
      onError,
    });
    MockFileReader.instance.error = error;
    MockFileReader.instance.onerror?.();

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(error);
  });
});
