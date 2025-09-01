import { isFirefox, storage } from '@constants/index';
import type { Header } from '@interfaces/index';

const setHeaders = async (headers: Header[]) => {
  if (isFirefox) {
    await storage.local.set({ headers });
  } else {
    storage.local.set({ headers });
  }
};

const getSelectedHeader = async (header: Header) => {
  const headers = await getHeaders();
  const index = headers.findIndex(({ name }) => name === header.name);
  return { index, headers, header: headers[index] };
};

export const getHeaders = async (): Promise<Header[]> => {
  const result = await storage.local.get('headers');
  return result.headers || [];
};

export const addHeader = async (header: Header) => {
  const headers = await getHeaders();
  headers.push({ ...header, enabled: true });
  await setHeaders(headers);
  return header;
};

export const updateHeader = async (header: Header) => {
  const { index, headers } = await getSelectedHeader(header);
  headers[index] = header;
  await setHeaders(headers);
  return headers[index];
};

export const removeHeader = async (header: Header) => {
  const { index, headers } = await getSelectedHeader(header);
  headers.splice(index, 1);
  await setHeaders(headers);
};

export const activateHeader = async (header: Header, isActive: boolean) => {
  const { index, headers, header: currentHeader } = await getSelectedHeader(header);
  headers[index] = { ...currentHeader, enabled: isActive };
  await setHeaders(headers);
  return headers[index];
};
