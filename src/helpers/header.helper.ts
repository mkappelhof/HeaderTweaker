import { storage } from '@constants/index';
import type { Header } from '@interfaces/index';

export const getHeaders = async (): Promise<Header[]> => {
  const result = await storage.local.get('headers');
  return result.headers || [];
};

export const saveHeader = async (header: Header) => {
  const headers = await getHeaders();
  headers.push({ ...header, enabled: true });
  await storage.local.set({ headers });
};
