import type { Header } from '@interfaces/index';
import { v4 as uuidv4 } from 'uuid';
import { getHeaders } from './get-headers.helper';
import { saveHeaders } from './save-headers.helper';

export const addHeader = async (header: Header) => {
  const id = uuidv4();
  const newHeader = { ...header, id, enabled: true };
  const headers = await getHeaders();
  headers.push(newHeader);
  await saveHeaders(headers);
  return newHeader;
};
