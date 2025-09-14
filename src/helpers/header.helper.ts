import { isFirefox, storage } from '@constants/index';
import type { Header } from '@interfaces/index';
import { v4 as uuidv4 } from 'uuid';

const setHeaders = async (headers: Header[]) => {
  if (isFirefox) {
    await storage.local.set({ headers });
  } else {
    storage.local.set({ headers });
  }
};

const getSelectedHeader = async (header: Header) => {
  const headers = await getHeaders();
  return {
    headers,
    pos: headers.findIndex(({ id }) => id === header.id),
    selectedHeader: headers.find(({ id }) => id === header.id),
  };
};

export const getHeaders = async (): Promise<Header[]> => {
  const result = await storage.local.get('headers');
  return result.headers || [];
};

export const addHeader = async (header: Header) => {
  const id = uuidv4();
  const newHeader = { ...header, id, enabled: true };
  const headers = await getHeaders();
  headers.push(newHeader);
  await setHeaders(headers);
  return newHeader;
};

export const updateHeader = async (header: Header) => {
  const { selectedHeader, headers, pos } = await getSelectedHeader(header);
  headers[pos] = header;
  await setHeaders(headers);
  return selectedHeader;
};

export const removeHeader = async (header: Header) => {
  const { headers, pos } = await getSelectedHeader(header);
  headers.splice(pos, 1);
  await setHeaders(headers);
};

export const activateHeader = async (header: Header, isActive: boolean) => {
  const { pos, headers, selectedHeader } = await getSelectedHeader(header);
  if (selectedHeader) {
    headers[pos] = { ...selectedHeader, enabled: isActive };
    await setHeaders(headers);
    return headers[pos];
  }
};

export const exportHeaders = async () => {
  const headers = await getHeaders();
  const exportData = {
    name: 'HeaderTweaker export',
    date: new Date().toISOString(),
    headers: headers,
  };
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'headertweaker-export.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importHeaders = async (headers: Header[]) => {
  if (!Array.isArray(headers)) return;
  await setHeaders(headers);
};
