import { getSelectedHeader } from '@helpers/header/get-selected-header.helper';
import { saveHeaders } from '@helpers/header/save-headers.helper';
import type { Header } from '@interfaces/index';

export const updateHeader = async (header: Header) => {
  const { headers, pos } = await getSelectedHeader(header);
  headers[pos] = header;
  await saveHeaders(headers);
  return header;
};
