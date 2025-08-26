import { isFirefox, storage } from '../constants/constants';
import type { Header } from '../types';

export const byId = <T extends HTMLElement>(id: string) => document.querySelector<T>(`#${id}`);

export const getHeaders = async (): Promise<Header[]> => {
  const result = await storage.local.get('headers');
  return result.headers || [];
};

export const setHeaders = async (
  headers: Header[],
  callback: () => Promise<void>,
  timeout: number | undefined = 0
) => {
  if (isFirefox) {
    await storage.local.set({ headers });
    setTimeout(async () => await callback(), timeout);
  } else {
    storage.local.set({ headers }, callback);
  }
};

export const updateHeader = async (header: Header, pos: number, callback: () => Promise<void>) => {
  const headers = await getHeaders();
  headers[pos] = header;
  await setHeaders(headers, callback, 300);
};

export const isValidHeaderKey = async (key: string) => {
  const headers = await getHeaders();
  return headers.some((header) => header.name !== key);
};

export const escapeHTML = (input: string | undefined) => {
  if (!input) return '';

  return input
    .replace(/&/g, '&amp;')
    .replace(/&lt;/g, '&lt;')
    .replace(/&gt;/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const closePanel = () => {
  const panel = byId('edit-panel');
  const backdrop = byId('backdrop');

  panel?.classList.remove('is-open');
  backdrop?.classList.remove('is-visible');
  backdrop?.setAttribute('hidden', 'true');
};
