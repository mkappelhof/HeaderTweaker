import type { Header } from '@interfaces/index';
import { saveHeaders } from './save-headers.helper';

export const importHeaders = async (headers: Header[]) => {
  if (!Array.isArray(headers)) return;
  await saveHeaders(headers);
};
