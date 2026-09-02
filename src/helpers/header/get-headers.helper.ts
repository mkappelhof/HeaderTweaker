import { storage } from '@constants/index';
import { saveHeaders } from '@helpers/header/save-headers.helper';
import type { Header } from '@interfaces/index';
import { v4 as uuidv4 } from 'uuid';

export const getHeaders = async (): Promise<Header[]> => {
  const result = await storage.local.get('headers');
  const headers: Header[] = result.headers || [];
  const headersWithoutId = headers.some(({ id }) => !id);

  if (headersWithoutId) {
    const headersWithId = headers.map((h) => (h.id ? h : { ...h, id: uuidv4() }));
    await saveHeaders(headersWithId);
    return headersWithId;
  }

  return headers;
};
