import { getSelectedHeader } from '@helpers/header/get-selected-header.helper';
import { saveHeaders } from '@helpers/header/save-headers.helper';
import type { Header } from '@interfaces/index';

export const removeHeader = async (header: Header) => {
  const { headers, pos } = await getSelectedHeader(header);
  headers.splice(pos, 1);
  await saveHeaders(headers);
};
